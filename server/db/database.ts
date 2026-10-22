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
  roll_number: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  current_question_index: number; // 0 to 19
  score: number;
  energy_percentage: number;
  started_at: string;
  completed_at: string | null;
  time_taken_seconds: number;
  metadata: string | null;
  created_at: string;
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

class TarsDatabase {
  private db: Database.Database;

  constructor(customPath?: string) {
    const targetPath = customPath || DB_PATH;
    this.db = new Database(targetPath);
    // Enable WAL mode for high performance concurrent reads and writes
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initSchema();
  }

  private initSchema() {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      this.db.exec(sql);
    }

    // Default settings
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

  // --- ATTEMPTS ---
  findActiveAttemptByRollNumber(rollNumber: string): AttemptRecord | null {
    const row = this.db.prepare(`
      SELECT * FROM attempts
      WHERE roll_number = ? AND status = 'in_progress'
      ORDER BY started_at DESC LIMIT 1
    `).get(rollNumber) as AttemptRecord | undefined;
    return row || null;
  }

  getCompletedAttemptsCountByRollNumber(rollNumber: string): number {
    const row = this.db.prepare(`
      SELECT COUNT(*) as count FROM attempts
      WHERE roll_number = ? AND status = 'completed'
    `).get(rollNumber) as { count: number };
    return row.count;
  }

  startQuizAttempt(rollNumber: string, metadata?: any): {
    attempt: AttemptRecord;
    resumed: boolean;
    currentQuestion: any;
  } {
    const normalizedRoll = rollNumber.trim().toUpperCase();

    // Check if an in-progress attempt already exists - resume it!
    const activeAttempt = this.findActiveAttemptByRollNumber(normalizedRoll);
    if (activeAttempt) {
      const q = this.getCurrentQuestionDetails(activeAttempt.id);
      return {
        attempt: activeAttempt,
        resumed: true,
        currentQuestion: q,
      };
    }

    // Check duplicate attempt policy
    const allowDuplicates = this.getSetting('allow_duplicate_attempts', 'false') === 'true';
    if (!allowDuplicates) {
      const completedCount = this.getCompletedAttemptsCountByRollNumber(normalizedRoll);
      if (completedCount > 0) {
        throw new Error(`Roll number ${normalizedRoll} has already completed the TARS WARS mission. Retakes are restricted.`);
      }
    }

    // Verify minimum 20 active questions
    const activeQuestions = this.db.prepare(`
      SELECT * FROM questions WHERE is_active = 1
    `).all() as QuestionRecord[];

    if (activeQuestions.length < 20) {
      throw new Error(`Insufficient active questions in the orbital database (${activeQuestions.length}/20 required). Please contact flight command.`);
    }

    // Select exactly 20 random unique questions
    const shuffledQuestions = [...activeQuestions].sort(() => Math.random() - 0.5).slice(0, 20);

    const attemptId = 'att_' + crypto.randomUUID();
    const now = new Date();
    const nowIso = now.toISOString();

    const timerSeconds = parseInt(this.getSetting('question_timer_seconds', '45'), 10) || 45;

    // Database transaction to create attempt and all 20 ordered question slots
    const createAttemptTx = this.db.transaction(() => {
      this.db.prepare(`
        INSERT INTO attempts (id, roll_number, status, current_question_index, score, energy_percentage, started_at, created_at, metadata)
        VALUES (?, ?, 'in_progress', 0, 0, 0, ?, ?, ?)
      `).run(attemptId, normalizedRoll, nowIso, nowIso, metadata ? JSON.stringify(metadata) : null);

      const insertResponse = this.db.prepare(`
        INSERT INTO attempt_responses (
          id, attempt_id, question_id, sequence_number, shuffled_options, correct_shuffled_index,
          activated_at, deadline_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < shuffledQuestions.length; i++) {
        const q = shuffledQuestions[i];
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

        // Sequence 1 is activated immediately with 45s deadline; subsequent questions will be activated when reached
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

    // Check if activated; if not yet activated, activate now with full 45s timer!
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

    // Check if the current question's deadline has expired and was not yet evaluated
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

  submitAnswer(attemptId: string, sequenceNumber: number, selectedOptionIndex: number): {
    success: boolean;
    isCorrect: boolean;
    explanation: string;
    correctOptionIndex: number;
    score: number;
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

    // Prevent double submissions or modifying answers
    if (responseRow.selected_option_index !== null || responseRow.is_unanswered === 1) {
      return {
        success: true,
        isCorrect: responseRow.is_correct === 1,
        explanation: responseRow.explanation || '',
        correctOptionIndex: responseRow.correct_shuffled_index,
        score: attempt.score,
        energyPercentage: attempt.energy_percentage,
        isLastQuestion: sequenceNumber === 20,
        nextQuestionIndex: attempt.current_question_index + 1,
      };
    }

    // Check deadline
    const now = new Date();
    const nowIso = now.toISOString();
    const deadlineTime = new Date(responseRow.deadline_at).getTime();
    const isTimeout = now.getTime() > (deadlineTime + 2000); // 2s grace for network latency

    let isCorrect = false;
    let selectedIndex: number | null = selectedOptionIndex;
    let isUnanswered = 0;

    if (isTimeout) {
      // Timeout recorded
      isUnanswered = 1;
      selectedIndex = null;
      isCorrect = false;
    } else {
      isCorrect = (selectedOptionIndex === responseRow.correct_shuffled_index);
    }

    const activatedTime = new Date(responseRow.activated_at).getTime();
    const timeTakenMs = Math.max(0, now.getTime() - activatedTime);

    // Calculate score: +1 for correct, energy = score * 5
    const newScore = attempt.score + (isCorrect ? 1 : 0);
    const newEnergy = newScore * 5;
    const isLast = sequenceNumber === 20;

    // Transaction for atomic update of response + attempt
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

      if (isLast) {
        // Complete the quiz
        const startTime = new Date(attempt.started_at).getTime();
        const totalDurationSeconds = Math.max(1, Math.round((now.getTime() - startTime) / 1000));

        this.db.prepare(`
          UPDATE attempts
          SET score = ?,
              energy_percentage = ?,
              status = 'completed',
              completed_at = ?,
              time_taken_seconds = ?
          WHERE id = ?
        `).run(newScore, newEnergy, nowIso, totalDurationSeconds, attemptId);
      } else {
        // Just update score & energy
        this.db.prepare(`
          UPDATE attempts
          SET score = ?,
              energy_percentage = ?
          WHERE id = ?
        `).run(newScore, newEnergy, attemptId);
      }
    });

    submitTx();

    return {
      success: true,
      isCorrect,
      explanation: responseRow.explanation || 'Protocol evaluation confirmed.',
      correctOptionIndex: responseRow.correct_shuffled_index,
      score: newScore,
      energyPercentage: newEnergy,
      isLastQuestion: isLast,
      nextQuestionIndex: attempt.current_question_index + 1,
    };
  }

  handleQuestionTimeout(attemptId: string, sequenceNumber: number): {
    success: boolean;
    score: number;
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

    // If already evaluated, return current status
    if (responseRow.selected_option_index !== null || responseRow.is_unanswered === 1) {
      return {
        success: true,
        score: attempt.score,
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

      if (isLast) {
        const startTime = new Date(attempt.started_at).getTime();
        const totalDurationSeconds = Math.max(1, Math.round((now.getTime() - startTime) / 1000));
        this.db.prepare(`
          UPDATE attempts
          SET status = 'completed',
              completed_at = ?,
              time_taken_seconds = ?
          WHERE id = ?
        `).run(nowIso, totalDurationSeconds, attemptId);
      }
    });

    timeoutTx();

    return {
      success: true,
      score: attempt.score,
      energyPercentage: attempt.energy_percentage,
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
      // Completed!
      const now = new Date().toISOString();
      const startTime = new Date(attempt.started_at).getTime();
      const totalDuration = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      this.db.prepare(`
        UPDATE attempts
        SET status = 'completed',
            completed_at = ?,
            time_taken_seconds = ?
        WHERE id = ?
      `).run(now, totalDuration, attemptId);

      return { completed: true };
    }

    const timerSeconds = parseInt(this.getSetting('question_timer_seconds', '45'), 10) || 45;
    const now = new Date();
    const nowIso = now.toISOString();
    const nextDeadlineIso = new Date(now.getTime() + timerSeconds * 1000).toISOString();

    const advanceTx = this.db.transaction(() => {
      this.db.prepare(`
        UPDATE attempts
        SET current_question_index = ?
        WHERE id = ?
      `).run(nextIndex, attemptId);

      // Activate the next question's timer
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

    // Detailed question responses with explanations
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

    return {
      attemptId: attempt.id,
      rollNumber: attempt.roll_number,
      status: attempt.status,
      score: attempt.score,
      totalQuestions: 20,
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
      // First completed attempt per roll number
      rawRows = this.db.prepare(`
        WITH RankedAttempts AS (
          SELECT *,
                 ROW_NUMBER() OVER(PARTITION BY roll_number ORDER BY completed_at ASC) as rn
          FROM attempts
          WHERE status = 'completed'
        )
        SELECT id, roll_number, score, energy_percentage, time_taken_seconds, completed_at
        FROM RankedAttempts
        WHERE rn = 1
        ORDER BY score DESC, time_taken_seconds ASC, completed_at ASC
      `).all() as any[];
    } else {
      // Best attempt per roll number (highest score, lowest time)
      rawRows = this.db.prepare(`
        WITH RankedAttempts AS (
          SELECT *,
                 ROW_NUMBER() OVER(
                   PARTITION BY roll_number
                   ORDER BY score DESC, time_taken_seconds ASC, completed_at ASC
                 ) as rn
          FROM attempts
          WHERE status = 'completed'
        )
        SELECT id, roll_number, score, energy_percentage, time_taken_seconds, completed_at
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
        score: row.score,
        totalQuestions: 20,
        energyPercentage: row.energy_percentage,
        timeTakenSeconds: row.time_taken_seconds,
        completedAt: row.completed_at,
      };
    });
  }

  // --- ADMIN ATTEMPT MANAGEMENT ---
  getAllAttempts(): any[] {
    return this.db.prepare(`
      SELECT id, roll_number, status, current_question_index, score, energy_percentage,
             time_taken_seconds, started_at, completed_at
      FROM attempts
      ORDER BY started_at DESC
    `).all();
  }

  resetAttempt(attemptId: string): boolean {
    const res = this.db.prepare(`DELETE FROM attempts WHERE id = ?`).run(attemptId);
    return res.changes > 0;
  }
}

// Singleton database instance
export const db = new TarsDatabase();
