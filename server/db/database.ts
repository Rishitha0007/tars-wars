import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), 'tars_wars.db');

export interface QuestionRecord {
  id: string;
  question_text: string;
  options: string; // JSON string array of 4 options
  correct_option_index: number;
  explanation: string;
  category: string;
  difficulty: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface AttemptRecord {
  id: string;
  normalized_roll_number: string;
  raw_roll_number: string;
  roll_number: string; // Backward compatibility alias
  status: 'in_progress' | 'completed' | 'abandoned';
  current_question_index: number; // 0 to 19
  score: number;
  percentage: number;
  energy_percentage: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  assigned_question_ids: string | null; // JSON array of 20 IDs in order
  started_at: string;
  completed_at: string | null;
  time_taken_seconds: number;
  metadata: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttemptResponseRecord {
  id: string;
  attempt_id: string;
  question_id: string;
  sequence_number: number;
  shuffled_options: string; // JSON string array
  correct_shuffled_index: number;
  selected_option_index: number | null;
  is_correct: number | null;
  is_unanswered: number;
  activated_at: string;
  deadline_at: string;
  submitted_at: string | null;
  time_taken_ms: number | null;
}

export function normalizeRollNumber(raw: string): string {
  return raw ? raw.trim().toUpperCase() : '';
}

export class TarsDatabase {
  private db: Database.Database;

  constructor(customPath?: string) {
    const targetPath = customPath || DB_PATH;
    this.db = new Database(targetPath);
    // Enable WAL mode for high performance concurrent reads and writes
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('synchronous = NORMAL');
    this.initSchema();
  }

  private initSchema() {
    // 1. Non-destructive migration for existing attempts table FIRST
    try {
      const tableCheck = this.db.prepare(`
        SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='attempts'
      `).get() as { count: number };

      if (tableCheck && tableCheck.count > 0) {
        const columns = this.db.prepare(`PRAGMA table_info(attempts)`).all() as { name: string }[];
        const colNames = new Set(columns.map(c => c.name));

        if (!colNames.has('normalized_roll_number')) {
          this.db.exec(`ALTER TABLE attempts ADD COLUMN normalized_roll_number TEXT;`);
        }
        if (!colNames.has('raw_roll_number')) {
          this.db.exec(`ALTER TABLE attempts ADD COLUMN raw_roll_number TEXT;`);
        }
        if (!colNames.has('percentage')) {
          this.db.exec(`ALTER TABLE attempts ADD COLUMN percentage REAL DEFAULT 0.0;`);
        }
        if (!colNames.has('correct_count')) {
          this.db.exec(`ALTER TABLE attempts ADD COLUMN correct_count INTEGER DEFAULT 0;`);
        }
        if (!colNames.has('incorrect_count')) {
          this.db.exec(`ALTER TABLE attempts ADD COLUMN incorrect_count INTEGER DEFAULT 0;`);
        }
        if (!colNames.has('unanswered_count')) {
          this.db.exec(`ALTER TABLE attempts ADD COLUMN unanswered_count INTEGER DEFAULT 0;`);
        }
        if (!colNames.has('assigned_question_ids')) {
          this.db.exec(`ALTER TABLE attempts ADD COLUMN assigned_question_ids TEXT;`);
        }
        if (!colNames.has('updated_at')) {
          this.db.exec(`ALTER TABLE attempts ADD COLUMN updated_at TEXT;`);
        }

        // Backfill normalized roll number and statistics
        this.db.exec(`
          UPDATE attempts
          SET normalized_roll_number = UPPER(TRIM(roll_number))
          WHERE normalized_roll_number IS NULL OR normalized_roll_number = '';

          UPDATE attempts
          SET raw_roll_number = roll_number
          WHERE raw_roll_number IS NULL OR raw_roll_number = '';

          UPDATE attempts
          SET percentage = (CAST(score AS REAL) / 20.0) * 100.0
          WHERE percentage = 0.0 AND score > 0;

          UPDATE attempts
          SET correct_count = score
          WHERE correct_count = 0 AND score > 0;

          UPDATE attempts
          SET updated_at = COALESCE(completed_at, started_at, created_at, datetime('now'))
          WHERE updated_at IS NULL;
        `);
      }
    } catch (migErr) {
      console.warn('Database schema pre-migration notice:', migErr);
    }

    // 2. Execute schema.sql to ensure all tables, triggers, and indexes exist
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      this.db.exec(sql);
    }

    // Default festival settings
    const insertSetting = this.db.prepare(
      `INSERT OR IGNORE INTO fest_settings (key, value) VALUES (?, ?)`
    );
    insertSetting.run('allow_duplicate_attempts', process.env.ALLOW_DUPLICATE_ATTEMPTS || 'false');
    insertSetting.run('leaderboard_display_mode', process.env.LEADERBOARD_DISPLAY_MODE || 'best');
    insertSetting.run('mask_roll_numbers', process.env.MASK_ROLL_NUMBERS || 'false');
    insertSetting.run('question_timer_seconds', '45');
    insertSetting.run('total_questions_per_quiz', '20');
  }

  // --- SETTINGS ---
  getSettings(): Record<string, string> {
    const rows = this.db.prepare(`SELECT key, value FROM fest_settings`).all() as { key: string; value: string }[];
    const res: Record<string, string> = {};
    for (const row of rows) {
      res[row.key] = row.value;
    }
    return res;
  }

  getSetting(key: string, defaultValue: string = ''): string {
    const row = this.db.prepare(`SELECT value FROM fest_settings WHERE key = ?`).get(key) as { value: string } | undefined;
    return row ? row.value : defaultValue;
  }

  updateSetting(key: string, value: string): void {
    this.db.prepare(`INSERT OR REPLACE INTO fest_settings (key, value) VALUES (?, ?)`).run(key, value);
  }

  // --- QUESTIONS ---
  getAllQuestions(includeInactive = true): (QuestionRecord & { parsedOptions: string[] })[] {
    const query = includeInactive
      ? `SELECT * FROM questions ORDER BY created_at DESC`
      : `SELECT * FROM questions WHERE is_active = 1 ORDER BY created_at DESC`;
    const rows = this.db.prepare(query).all() as QuestionRecord[];
    return rows.map((r) => ({
      ...r,
      parsedOptions: JSON.parse(r.options),
    }));
  }

  getQuestionById(id: string): (QuestionRecord & { parsedOptions: string[] }) | null {
    const row = this.db.prepare(`SELECT * FROM questions WHERE id = ?`).get(id) as QuestionRecord | undefined;
    if (!row) return null;
    return {
      ...row,
      parsedOptions: JSON.parse(row.options),
    };
  }

  getActiveQuestionsCount(): number {
    const row = this.db.prepare(`SELECT COUNT(*) as count FROM questions WHERE is_active = 1`).get() as { count: number };
    return row.count;
  }

  createQuestion(data: {
    question_text: string;
    options: string[];
    correct_option_index: number;
    explanation?: string;
    category?: string;
    difficulty?: string;
    is_active?: boolean;
  }): QuestionRecord {
    const id = 'q_' + crypto.randomUUID();
    const now = new Date().toISOString();
    const is_active = data.is_active === false ? 0 : 1;

    this.db.prepare(`
      INSERT INTO questions (id, question_text, options, correct_option_index, explanation, category, difficulty, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.question_text.trim(),
      JSON.stringify(data.options),
      data.correct_option_index,
      data.explanation || '',
      data.category || 'General',
      data.difficulty || 'medium',
      is_active,
      now,
      now
    );

    return this.getQuestionById(id)!;
  }

  updateQuestion(id: string, data: {
    question_text?: string;
    options?: string[];
    correct_option_index?: number;
    explanation?: string;
    category?: string;
    difficulty?: string;
    is_active?: boolean;
  }): QuestionRecord | null {
    const existing = this.getQuestionById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const question_text = data.question_text !== undefined ? data.question_text.trim() : existing.question_text;
    const options = data.options !== undefined ? JSON.stringify(data.options) : existing.options;
    const correct_option_index = data.correct_option_index !== undefined ? data.correct_option_index : existing.correct_option_index;
    const explanation = data.explanation !== undefined ? data.explanation : existing.explanation;
    const category = data.category !== undefined ? data.category : existing.category;
    const difficulty = data.difficulty !== undefined ? data.difficulty : existing.difficulty;
    const is_active = data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active;

    this.db.prepare(`
      UPDATE questions
      SET question_text = ?, options = ?, correct_option_index = ?, explanation = ?, category = ?, difficulty = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `).run(question_text, options, correct_option_index, explanation, category, difficulty, is_active, now, id);

    return this.getQuestionById(id);
  }

  deleteQuestion(id: string): boolean {
    const res = this.db.prepare(`DELETE FROM questions WHERE id = ?`).run(id);
    return res.changes > 0;
  }

  toggleQuestionStatus(id: string, is_active: boolean): QuestionRecord | null {
    const now = new Date().toISOString();
    this.db.prepare(`UPDATE questions SET is_active = ?, updated_at = ? WHERE id = ?`).run(is_active ? 1 : 0, now, id);
    return this.getQuestionById(id);
  }

  bulkInsertQuestions(questionsList: Array<{
    question_text: string;
    options: string[];
    correct_option_index: number;
    explanation?: string;
    category?: string;
    difficulty?: string;
  }>): number {
    const insert = this.db.prepare(`
      INSERT INTO questions (id, question_text, options, correct_option_index, explanation, category, difficulty, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    const now = new Date().toISOString();
    let count = 0;

    const transaction = this.db.transaction((items: typeof questionsList) => {
      for (const item of items) {
        const id = 'q_' + crypto.randomUUID();
        insert.run(
          id,
          item.question_text.trim(),
          JSON.stringify(item.options),
          item.correct_option_index,
          item.explanation || '',
          item.category || 'General',
          item.difficulty || 'medium',
          now,
          now
        );
        count++;
      }
    });

    transaction(questionsList);
    return count;
  }

  // --- ATTEMPTS & PARTICIPANT VALIDATION ---

  findAttemptByNormalizedRoll(normalizedRoll: string): AttemptRecord | null {
    const row = this.db.prepare(`
      SELECT * FROM attempts
      WHERE normalized_roll_number = ?
    `).get(normalizedRoll) as AttemptRecord | undefined;
    return row || null;
  }

  findActiveAttemptByRollNumber(rollNumber: string): AttemptRecord | null {
    const normalized = normalizeRollNumber(rollNumber);
    const row = this.db.prepare(`
      SELECT * FROM attempts
      WHERE normalized_roll_number = ? AND status = 'in_progress'
      ORDER BY started_at DESC LIMIT 1
    `).get(normalized) as AttemptRecord | undefined;
    return row || null;
  }

  getCompletedAttemptsCountByRollNumber(rollNumber: string): number {
    const normalized = normalizeRollNumber(rollNumber);
    const row = this.db.prepare(`
      SELECT COUNT(*) as count FROM attempts
      WHERE normalized_roll_number = ? AND status = 'completed'
    `).get(normalized) as { count: number };
    return row.count;
  }

  /**
   * Authoritative Start or Resume Quiz Attempt
   * Strictly enforces one attempt per normalized roll number at database level.
   * Race conditions from simultaneous requests or multi-tab starts are resolved
   * atomically via UNIQUE constraint on normalized_roll_number.
   */
  startQuizAttempt(rawRollNumber: string, metadata?: any): {
    attempt: AttemptRecord;
    resumed: boolean;
    currentQuestion: any;
  } {
    const normalizedRoll = normalizeRollNumber(rawRollNumber);
    if (!normalizedRoll || normalizedRoll.length < 2 || normalizedRoll.length > 35) {
      throw new Error('Roll number must be between 2 and 35 characters.');
    }

    const allowDuplicates = this.getSetting('allow_duplicate_attempts', 'false') === 'true';

    // 1. Check if an attempt already exists for this normalized roll number
    const existingAttempt = this.findAttemptByNormalizedRoll(normalizedRoll);
    if (existingAttempt) {
      if (existingAttempt.status === 'completed' && !allowDuplicates) {
        throw new Error(`Roll number ${normalizedRoll} has already completed the TARS WARS mission. Retakes are strictly restricted.`);
      }

      if (existingAttempt.status === 'in_progress') {
        const q = this.getCurrentQuestionDetails(existingAttempt.id);
        return {
          attempt: existingAttempt,
          resumed: true,
          currentQuestion: q,
        };
      }
    }

    // 2. Select exactly 20 random unique active questions
    const activeQuestions = this.db.prepare(`
      SELECT * FROM questions WHERE is_active = 1
    `).all() as QuestionRecord[];

    if (activeQuestions.length < 20) {
      throw new Error(`Insufficient active questions in the orbital database (${activeQuestions.length}/20 required). Please contact flight command.`);
    }

    // Fisher-Yates shuffle 20 questions
    const shuffledQuestions = [...activeQuestions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    const selected20 = shuffledQuestions.slice(0, 20);
    const assignedIds = selected20.map(q => q.id);

    const attemptId = 'att_' + crypto.randomUUID();
    const now = new Date();
    const nowIso = now.toISOString();
    const timerSeconds = parseInt(this.getSetting('question_timer_seconds', '45'), 10) || 45;

    // 3. Atomically insert attempt with UNIQUE constraint
    try {
      const createAttemptTx = this.db.transaction(() => {
        this.db.prepare(`
          INSERT INTO attempts (
            id, normalized_roll_number, raw_roll_number, roll_number, status,
            current_question_index, score, percentage, energy_percentage,
            correct_count, incorrect_count, unanswered_count, assigned_question_ids,
            started_at, created_at, updated_at, metadata
          ) VALUES (?, ?, ?, ?, 'in_progress', 0, 0, 0.0, 0, 0, 0, 0, ?, ?, ?, ?, ?)
        `).run(
          attemptId,
          normalizedRoll,
          rawRollNumber.trim(),
          normalizedRoll, // Compatibility alias
          JSON.stringify(assignedIds),
          nowIso,
          nowIso,
          nowIso,
          metadata ? JSON.stringify(metadata) : null
        );

        const insertResponse = this.db.prepare(`
          INSERT INTO attempt_responses (
            id, attempt_id, question_id, sequence_number, shuffled_options, correct_shuffled_index,
            activated_at, deadline_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (let i = 0; i < selected20.length; i++) {
          const q = selected20[i];
          const originalOptions: string[] = JSON.parse(q.options);
          const correctText = originalOptions[q.correct_option_index];

          // Shuffle options for this attempt while tracking correct position
          const shuffledWithOriginalIdx = originalOptions.map((opt, idx) => ({ opt, originalIdx: idx }));
          for (let j = shuffledWithOriginalIdx.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [shuffledWithOriginalIdx[j], shuffledWithOriginalIdx[k]] = [shuffledWithOriginalIdx[k], shuffledWithOriginalIdx[j]];
          }

          const shuffledOptions = shuffledWithOriginalIdx.map(item => item.opt);
          const correctShuffledIndex = shuffledOptions.findIndex(o => o === correctText);

          // Sequence 1 is activated immediately with 45s deadline
          const responseId = `resp_${attemptId}_${i + 1}`;
          const activatedAt = i === 0 ? nowIso : '';
          const deadlineAt = i === 0 ? new Date(now.getTime() + timerSeconds * 1000).toISOString() : '';

          insertResponse.run(
            responseId,
            attemptId,
            q.id,
            i + 1,
            JSON.stringify(shuffledOptions),
            correctShuffledIndex,
            activatedAt,
            deadlineAt
          );
        }
      });

      createAttemptTx();
    } catch (insertErr: any) {
      // Handle race condition: another concurrent request created the attempt
      if (insertErr.code === 'SQLITE_CONSTRAINT_UNIQUE' || insertErr.message?.includes('UNIQUE')) {
        const concurrentAttempt = this.findAttemptByNormalizedRoll(normalizedRoll);
        if (concurrentAttempt) {
          if (concurrentAttempt.status === 'completed' && !allowDuplicates) {
            throw new Error(`Roll number ${normalizedRoll} has already completed the TARS WARS mission. Retakes are strictly restricted.`);
          }
          const q = this.getCurrentQuestionDetails(concurrentAttempt.id);
          return {
            attempt: concurrentAttempt,
            resumed: true,
            currentQuestion: q,
          };
        }
      }
      throw insertErr;
    }

    const createdAttempt = this.getAttemptById(attemptId)!;
    const currentQuestion = this.getCurrentQuestionDetails(attemptId);

    return {
      attempt: createdAttempt,
      resumed: false,
      currentQuestion,
    };
  }

  getAttemptById(id: string): AttemptRecord | null {
    const row = this.db.prepare(`SELECT * FROM attempts WHERE id = ?`).get(id) as AttemptRecord | undefined;
    return row || null;
  }

  getCurrentQuestionDetails(attemptId: string): any {
    const attempt = this.getAttemptById(attemptId);
    if (!attempt) return null;

    if (attempt.status !== 'in_progress') {
      return null;
    }

    const seq = attempt.current_question_index + 1;
    const responseRow = this.db.prepare(`
      SELECT ar.*, q.question_text, q.category, q.difficulty
      FROM attempt_responses ar
      JOIN questions q ON ar.question_id = q.id
      WHERE ar.attempt_id = ? AND ar.sequence_number = ?
    `).get(attemptId, seq) as (AttemptResponseRecord & { question_text: string; category: string; difficulty: string }) | undefined;

    if (!responseRow) return null;

    // Check if activated; if not yet activated, activate now with full 45s timer
    const timerSeconds = parseInt(this.getSetting('question_timer_seconds', '45'), 10) || 45;
    let activatedAt = responseRow.activated_at;
    let deadlineAt = responseRow.deadline_at;

    if (!activatedAt) {
      const now = new Date();
      activatedAt = now.toISOString();
      deadlineAt = new Date(now.getTime() + timerSeconds * 1000).toISOString();

      this.db.prepare(`
        UPDATE attempt_responses
        SET activated_at = ?, deadline_at = ?
        WHERE id = ?
      `).run(activatedAt, deadlineAt, responseRow.id);
    }

    const nowTime = Date.now();
    const deadlineTime = new Date(deadlineAt).getTime();
    const isExpired = nowTime > deadlineTime + 1500; // 1.5s grace for network

    // Safe client payload: NEVER include correct_shuffled_index or server correct option!
    return {
      sequenceNumber: seq,
      totalQuestions: 20,
      questionText: responseRow.question_text,
      options: JSON.parse(responseRow.shuffled_options),
      category: responseRow.category,
      difficulty: responseRow.difficulty,
      activatedAt,
      deadlineAt,
      remainingSeconds: Math.max(0, Math.ceil((deadlineTime - nowTime) / 1000)),
      isAnswered: responseRow.selected_option_index !== null || responseRow.is_unanswered === 1,
      selectedOptionIndex: responseRow.selected_option_index,
      isCorrect: responseRow.is_correct === 1,
      isExpired,
      score: attempt.score,
      energyPercentage: attempt.energy_percentage,
    };
  }

  /**
   * Authoritative answer evaluation on server
   * Never trusts score or correctness flags from client browser.
   */
  submitAnswer(attemptId: string, sequenceNumber: number, selectedOptionIndex: number): {
    success: boolean;
    isCorrect: boolean;
    explanation: string;
    correctOptionIndex: number;
    score: number;
    percentage: number;
    energyPercentage: number;
    isLastQuestion: boolean;
    nextQuestionIndex: number;
  } {
    const attempt = this.getAttemptById(attemptId);
    if (!attempt || attempt.status !== 'in_progress') {
      throw new Error('Attempt is not currently in progress');
    }

    const expectedSeq = attempt.current_question_index + 1;
    if (sequenceNumber !== expectedSeq) {
      throw new Error(`Sequence mismatch. Expected question ${expectedSeq}, got ${sequenceNumber}.`);
    }

    const responseRow = this.db.prepare(`
      SELECT ar.*, q.explanation
      FROM attempt_responses ar
      JOIN questions q ON ar.question_id = q.id
      WHERE ar.attempt_id = ? AND ar.sequence_number = ?
    `).get(attemptId, sequenceNumber) as (AttemptResponseRecord & { explanation: string }) | undefined;

    if (!responseRow) {
      throw new Error('Question response record not found');
    }

    // Idempotent: Prevent double submissions or modifying evaluated answers
    if (responseRow.selected_option_index !== null || responseRow.is_unanswered === 1) {
      return {
        success: true,
        isCorrect: responseRow.is_correct === 1,
        explanation: responseRow.explanation || 'Protocol evaluation confirmed.',
        correctOptionIndex: responseRow.correct_shuffled_index,
        score: attempt.score,
        percentage: attempt.percentage,
        energyPercentage: attempt.energy_percentage,
        isLastQuestion: sequenceNumber === 20,
        nextQuestionIndex: attempt.current_question_index + 1,
      };
    }

    // Verify deadline
    const now = new Date();
    const nowIso = now.toISOString();
    const deadlineTime = new Date(responseRow.deadline_at).getTime();
    const isTimeout = now.getTime() > (deadlineTime + 2500); // 2.5s network latency buffer

    let isCorrect = false;
    let selectedIndex: number | null = selectedOptionIndex;
    let isUnanswered = 0;

    if (isTimeout) {
      isUnanswered = 1;
      selectedIndex = null;
      isCorrect = false;
    } else {
      isCorrect = (selectedOptionIndex === responseRow.correct_shuffled_index);
    }

    const activatedTime = new Date(responseRow.activated_at).getTime();
    const timeTakenMs = Math.max(0, now.getTime() - activatedTime);
    const isLast = sequenceNumber === 20;

    let updatedScore = attempt.score;
    let updatedPercentage = attempt.percentage;
    let updatedEnergy = attempt.energy_percentage;

    // Transaction for atomic update of response + attempt stats
    const submitTx = this.db.transaction(() => {
      this.db.prepare(`
        UPDATE attempt_responses
        SET selected_option_index = ?,
            is_correct = ?,
            is_unanswered = ?,
            submitted_at = ?,
            time_taken_ms = ?
        WHERE id = ?
      `).run(
        selectedIndex,
        isCorrect ? 1 : 0,
        isUnanswered,
        nowIso,
        timeTakenMs,
        responseRow.id
      );

      // Recalculate authoritative counts
      const counts = this.db.prepare(`
        SELECT
          SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as c_cnt,
          SUM(CASE WHEN is_correct = 0 AND is_unanswered = 0 AND selected_option_index IS NOT NULL THEN 1 ELSE 0 END) as i_cnt,
          SUM(CASE WHEN is_unanswered = 1 THEN 1 ELSE 0 END) as u_cnt
        FROM attempt_responses
        WHERE attempt_id = ?
      `).get(attemptId) as { c_cnt: number; i_cnt: number; u_cnt: number };

      const correctCount = counts.c_cnt || 0;
      const incorrectCount = counts.i_cnt || 0;
      const unansweredCount = counts.u_cnt || 0;
      updatedScore = correctCount;
      updatedPercentage = (correctCount / 20.0) * 100.0;
      updatedEnergy = correctCount * 5;

      if (isLast) {
        const startTime = new Date(attempt.started_at).getTime();
        const totalDurationSeconds = Math.max(1, Math.round((now.getTime() - startTime) / 1000));

        this.db.prepare(`
          UPDATE attempts
          SET score = ?,
              percentage = ?,
              energy_percentage = ?,
              correct_count = ?,
              incorrect_count = ?,
              unanswered_count = ?,
              status = 'completed',
              completed_at = ?,
              time_taken_seconds = ?,
              updated_at = ?
          WHERE id = ?
        `).run(
          updatedScore,
          updatedPercentage,
          updatedEnergy,
          correctCount,
          incorrectCount,
          unansweredCount,
          nowIso,
          totalDurationSeconds,
          nowIso,
          attemptId
        );
      } else {
        this.db.prepare(`
          UPDATE attempts
          SET score = ?,
              percentage = ?,
              energy_percentage = ?,
              correct_count = ?,
              incorrect_count = ?,
              unanswered_count = ?,
              updated_at = ?
          WHERE id = ?
        `).run(
          updatedScore,
          updatedPercentage,
          updatedEnergy,
          correctCount,
          incorrectCount,
          unansweredCount,
          nowIso,
          attemptId
        );
      }
    });

    submitTx();

    return {
      success: true,
      isCorrect,
      explanation: responseRow.explanation || 'Protocol evaluation confirmed.',
      correctOptionIndex: responseRow.correct_shuffled_index,
      score: updatedScore,
      percentage: updatedPercentage,
      energyPercentage: updatedEnergy,
      isLastQuestion: isLast,
      nextQuestionIndex: attempt.current_question_index + 1,
    };
  }

  handleQuestionTimeout(attemptId: string, sequenceNumber: number): {
    success: boolean;
    score: number;
    percentage: number;
    energyPercentage: number;
    isLastQuestion: boolean;
    nextQuestionIndex: number;
    explanation: string;
    correctOptionIndex: number;
  } {
    const attempt = this.getAttemptById(attemptId);
    if (!attempt || attempt.status !== 'in_progress') {
      throw new Error('Attempt is not in progress');
    }

    const expectedSeq = attempt.current_question_index + 1;
    if (sequenceNumber !== expectedSeq) {
      throw new Error(`Sequence mismatch. Expected question ${expectedSeq}, got ${sequenceNumber}.`);
    }

    const responseRow = this.db.prepare(`
      SELECT ar.*, q.explanation
      FROM attempt_responses ar
      JOIN questions q ON ar.question_id = q.id
      WHERE ar.attempt_id = ? AND ar.sequence_number = ?
    `).get(attemptId, sequenceNumber) as (AttemptResponseRecord & { explanation: string }) | undefined;

    if (!responseRow) {
      throw new Error('Question response not found');
    }

    if (responseRow.selected_option_index !== null || responseRow.is_unanswered === 1) {
      return {
        success: true,
        score: attempt.score,
        percentage: attempt.percentage,
        energyPercentage: attempt.energy_percentage,
        isLastQuestion: sequenceNumber === 20,
        nextQuestionIndex: attempt.current_question_index + 1,
        explanation: responseRow.explanation || '',
        correctOptionIndex: responseRow.correct_shuffled_index,
      };
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const isLast = sequenceNumber === 20;

    let updatedScore = attempt.score;
    let updatedPercentage = attempt.percentage;
    let updatedEnergy = attempt.energy_percentage;

    const timeoutTx = this.db.transaction(() => {
      this.db.prepare(`
        UPDATE attempt_responses
        SET selected_option_index = NULL,
            is_correct = 0,
            is_unanswered = 1,
            submitted_at = ?,
            time_taken_ms = 45000
        WHERE id = ?
      `).run(nowIso, responseRow.id);

      const counts = this.db.prepare(`
        SELECT
          SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as c_cnt,
          SUM(CASE WHEN is_correct = 0 AND is_unanswered = 0 AND selected_option_index IS NOT NULL THEN 1 ELSE 0 END) as i_cnt,
          SUM(CASE WHEN is_unanswered = 1 THEN 1 ELSE 0 END) as u_cnt
        FROM attempt_responses
        WHERE attempt_id = ?
      `).get(attemptId) as { c_cnt: number; i_cnt: number; u_cnt: number };

      const correctCount = counts.c_cnt || 0;
      const incorrectCount = counts.i_cnt || 0;
      const unansweredCount = counts.u_cnt || 0;
      updatedScore = correctCount;
      updatedPercentage = (correctCount / 20.0) * 100.0;
      updatedEnergy = correctCount * 5;

      if (isLast) {
        const startTime = new Date(attempt.started_at).getTime();
        const totalDurationSeconds = Math.max(1, Math.round((now.getTime() - startTime) / 1000));
        this.db.prepare(`
          UPDATE attempts
          SET score = ?,
              percentage = ?,
              energy_percentage = ?,
              correct_count = ?,
              incorrect_count = ?,
              unanswered_count = ?,
              status = 'completed',
              completed_at = ?,
              time_taken_seconds = ?,
              updated_at = ?
          WHERE id = ?
        `).run(
          updatedScore,
          updatedPercentage,
          updatedEnergy,
          correctCount,
          incorrectCount,
          unansweredCount,
          nowIso,
          totalDurationSeconds,
          nowIso,
          attemptId
        );
      } else {
        this.db.prepare(`
          UPDATE attempts
          SET score = ?,
              percentage = ?,
              energy_percentage = ?,
              correct_count = ?,
              incorrect_count = ?,
              unanswered_count = ?,
              updated_at = ?
          WHERE id = ?
        `).run(
          updatedScore,
          updatedPercentage,
          updatedEnergy,
          correctCount,
          incorrectCount,
          unansweredCount,
          nowIso,
          attemptId
        );
      }
    });

    timeoutTx();

    return {
      success: true,
      score: updatedScore,
      percentage: updatedPercentage,
      energyPercentage: updatedEnergy,
      isLastQuestion: isLast,
      nextQuestionIndex: attempt.current_question_index + 1,
      explanation: responseRow.explanation || 'Timer expired. Zero energy gained for this cycle.',
      correctOptionIndex: responseRow.correct_shuffled_index,
    };
  }

  advanceToNextQuestion(attemptId: string): any {
    const attempt = this.getAttemptById(attemptId);
    if (!attempt || attempt.status !== 'in_progress') {
      throw new Error('Attempt not in progress');
    }

    const nextIndex = attempt.current_question_index + 1;
    if (nextIndex >= 20) {
      const now = new Date().toISOString();
      const startTime = new Date(attempt.started_at).getTime();
      const totalDuration = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      this.db.prepare(`
        UPDATE attempts
        SET status = 'completed',
            completed_at = ?,
            time_taken_seconds = ?,
            updated_at = ?
        WHERE id = ?
      `).run(now, totalDuration, now, attemptId);

      return { completed: true };
    }

    const timerSeconds = parseInt(this.getSetting('question_timer_seconds', '45'), 10) || 45;
    const now = new Date();
    const nowIso = now.toISOString();
    const nextDeadlineIso = new Date(now.getTime() + timerSeconds * 1000).toISOString();

    const advanceTx = this.db.transaction(() => {
      this.db.prepare(`
        UPDATE attempts
        SET current_question_index = ?,
            updated_at = ?
        WHERE id = ?
      `).run(nextIndex, nowIso, attemptId);

      this.db.prepare(`
        UPDATE attempt_responses
        SET activated_at = ?,
            deadline_at = ?
        WHERE attempt_id = ? AND sequence_number = ?
      `).run(nowIso, nextDeadlineIso, attemptId, nextIndex + 1);
    });

    advanceTx();

    return this.getCurrentQuestionDetails(attemptId);
  }

  getAttemptResults(attemptId: string): any {
    const attempt = this.getAttemptById(attemptId);
    if (!attempt) return null;

    const responses = this.db.prepare(`
      SELECT ar.sequence_number, ar.selected_option_index, ar.is_correct, ar.is_unanswered,
             ar.shuffled_options, ar.correct_shuffled_index, ar.time_taken_ms,
             q.question_text, q.explanation, q.category, q.difficulty
      FROM attempt_responses ar
      JOIN questions q ON ar.question_id = q.id
      WHERE ar.attempt_id = ?
      ORDER BY ar.sequence_number ASC
    `).all(attemptId) as any[];

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const breakdown = responses.map(r => {
      const opts = JSON.parse(r.shuffled_options);
      if (r.is_correct === 1) correctCount++;
      else if (r.is_unanswered === 1) unansweredCount++;
      else if (r.selected_option_index !== null) incorrectCount++;

      return {
        sequence: r.sequence_number,
        questionText: r.question_text,
        options: opts,
        selectedOptionIndex: r.selected_option_index,
        selectedOptionText: r.selected_option_index !== null ? opts[r.selected_option_index] : null,
        correctOptionIndex: r.correct_shuffled_index,
        correctOptionText: opts[r.correct_shuffled_index],
        isCorrect: r.is_correct === 1,
        isUnanswered: r.is_unanswered === 1,
        explanation: r.explanation,
        category: r.category,
        timeTakenSeconds: r.time_taken_ms ? Math.round(r.time_taken_ms / 1000) : 0,
      };
    });

    // If attempt is still 'in_progress' when results are fetched, mark it completed in the database
    // so the participant is guaranteed to appear in the leaderboard.
    if (attempt.status === 'in_progress') {
      const now = new Date();
      const nowIso = now.toISOString();
      const startTime = new Date(attempt.started_at).getTime();
      const totalDurationSeconds = Math.max(1, Math.round((now.getTime() - startTime) / 1000));
      const percentage = (correctCount / 20.0) * 100.0;
      const energyPercentage = correctCount * 5;

      this.db.prepare(`
        UPDATE attempts
        SET status = 'completed',
            completed_at = ?,
            time_taken_seconds = ?,
            score = ?,
            percentage = ?,
            energy_percentage = ?,
            correct_count = ?,
            incorrect_count = ?,
            unanswered_count = ?,
            updated_at = ?
        WHERE id = ?
      `).run(
        nowIso,
        totalDurationSeconds,
        correctCount,
        percentage,
        energyPercentage,
        correctCount,
        incorrectCount,
        unansweredCount,
        nowIso,
        attemptId
      );

      attempt = this.getAttemptById(attemptId)!;
    }

    return {
      attemptId: attempt.id,
      rollNumber: attempt.roll_number,
      normalizedRollNumber: attempt.normalized_roll_number,
      rawRollNumber: attempt.raw_roll_number,
      status: attempt.status,
      score: attempt.score,
      totalQuestions: 20,
      percentage: attempt.percentage,
      energyPercentage: attempt.energy_percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      startedAt: attempt.started_at,
      completedAt: attempt.completed_at,
      timeTakenSeconds: attempt.time_taken_seconds,
      breakdown,
    };
  }

  // --- LEADERBOARD ---
  getLeaderboard(): any[] {
    const displayMode = this.getSetting('leaderboard_display_mode', 'best');
    const maskSetting = this.getSetting('mask_roll_numbers', 'false') === 'true';

    let rawRows: any[];

    if (displayMode === 'first') {
      rawRows = this.db.prepare(`
        WITH RankedAttempts AS (
          SELECT *,
                 ROW_NUMBER() OVER(PARTITION BY normalized_roll_number ORDER BY completed_at ASC) as rn
          FROM attempts
          WHERE status = 'completed'
        )
        SELECT id, roll_number, normalized_roll_number, score, percentage, energy_percentage, time_taken_seconds, completed_at
        FROM RankedAttempts
        WHERE rn = 1
        ORDER BY score DESC, time_taken_seconds ASC, completed_at ASC
      `).all() as any[];
    } else {
      rawRows = this.db.prepare(`
        WITH RankedAttempts AS (
          SELECT *,
                 ROW_NUMBER() OVER(
                   PARTITION BY normalized_roll_number
                   ORDER BY score DESC, time_taken_seconds ASC, completed_at ASC
                 ) as rn
          FROM attempts
          WHERE status = 'completed'
        )
        SELECT id, roll_number, normalized_roll_number, score, percentage, energy_percentage, time_taken_seconds, completed_at
        FROM RankedAttempts
        WHERE rn = 1
        ORDER BY score DESC, time_taken_seconds ASC, completed_at ASC
      `).all() as any[];
    }

    return rawRows.map((row, index) => {
      let rollFormatted = row.roll_number;
      if (maskSetting && rollFormatted.length > 4) {
        const prefix = rollFormatted.slice(0, 2);
        const suffix = rollFormatted.slice(-2);
        rollFormatted = `${prefix}****${suffix}`;
      }

      return {
        rank: index + 1,
        id: row.id,
        rollNumber: rollFormatted,
        rawRollNumber: row.roll_number,
        normalizedRollNumber: row.normalized_roll_number,
        score: row.score,
        totalQuestions: 20,
        percentage: row.percentage ?? ((row.score / 20.0) * 100),
        energyPercentage: row.energy_percentage,
        timeTakenSeconds: row.time_taken_seconds,
        completedAt: row.completed_at,
      };
    });
  }

  // --- ADMIN ATTEMPT MANAGEMENT & PAGINATION (UP TO 1,000 PARTICIPANTS) ---

  getAllAttempts(): any[] {
    return this.db.prepare(`
      SELECT id, normalized_roll_number, raw_roll_number, roll_number, status,
             current_question_index, score, percentage, energy_percentage,
             correct_count, incorrect_count, unanswered_count,
             time_taken_seconds, started_at, completed_at, updated_at
      FROM attempts
      ORDER BY started_at DESC
    `).all();
  }

  getAttemptsPaginated(params: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }): {
    attempts: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    summary: {
      totalAttempts: number;
      completedAttempts: number;
      inProgressAttempts: number;
      averageScore: number;
      highestScore: number;
    };
  } {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(1000, Math.max(1, params.limit || 25));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const sqlParams: any[] = [];

    // Search filter: normalize input or search raw
    if (params.search && params.search.trim()) {
      const q = `%${params.search.trim().toUpperCase()}%`;
      conditions.push(`(normalized_roll_number LIKE ? OR raw_roll_number LIKE ? OR roll_number LIKE ?)`);
      sqlParams.push(q, q, q);
    }

    // Status filter
    if (params.status && params.status !== 'all' && ['completed', 'in_progress', 'abandoned'].includes(params.status.toLowerCase())) {
      conditions.push(`status = ?`);
      sqlParams.push(params.status.toLowerCase());
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Allowed sort columns
    const allowedSortColumns: Record<string, string> = {
      started_at: 'started_at',
      completed_at: 'completed_at',
      score: 'score',
      percentage: 'percentage',
      roll_number: 'normalized_roll_number',
      time_taken_seconds: 'time_taken_seconds',
    };
    const sortCol = allowedSortColumns[params.sortBy || 'started_at'] || 'started_at';
    const sortDir = (params.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Count matching
    const countSql = `SELECT COUNT(*) as count FROM attempts ${whereClause}`;
    const totalMatch = (this.db.prepare(countSql).get(...sqlParams) as { count: number }).count;

    // Fetch paginated
    const dataSql = `
      SELECT id, normalized_roll_number, raw_roll_number, roll_number, status,
             current_question_index, score, percentage, energy_percentage,
             correct_count, incorrect_count, unanswered_count,
             time_taken_seconds, started_at, completed_at, updated_at
      FROM attempts
      ${whereClause}
      ORDER BY ${sortCol} ${sortDir}
      LIMIT ? OFFSET ?
    `;
    const attempts = this.db.prepare(dataSql).all(...sqlParams, limit, offset);

    // Global summary statistics for the festival oversight
    const summaryRow = this.db.prepare(`
      SELECT
        COUNT(*) as total_attempts,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_attempts,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_attempts,
        ROUND(AVG(score), 2) as avg_score,
        MAX(score) as max_score
      FROM attempts
    `).get() as any;

    return {
      attempts,
      total: totalMatch,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(totalMatch / limit)),
      summary: {
        totalAttempts: summaryRow?.total_attempts || 0,
        completedAttempts: summaryRow?.completed_attempts || 0,
        inProgressAttempts: summaryRow?.in_progress_attempts || 0,
        averageScore: summaryRow?.avg_score || 0,
        highestScore: summaryRow?.max_score || 0,
      },
    };
  }

  resetAttempt(attemptId: string): boolean {
    const res = this.db.prepare(`DELETE FROM attempts WHERE id = ?`).run(attemptId);
    return res.changes > 0;
  }
}

// Singleton database instance
export const db = new TarsDatabase();
