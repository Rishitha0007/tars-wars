import { QuestionBankItem, selectRandomQuestions } from '../data/questions.js';
import { QuizResults, LeaderboardEntry } from '../types/index.js';

export interface UserAnswerRecord {
  questionId: string;
  sourcePdf: string;
  originalQNum: number;
  questionText: string;
  category: string;
  options: string[];
  selectedOptionIndex: number | null;
  selectedOptionText: string;
  correctOptionIndex: number;
  correctOptionText: string;
  isCorrect: boolean;
  isUnanswered: boolean;
  explanation: string;
}

export interface QuizSession {
  attemptId: string;
  rollNumber: string;
  questions: QuestionBankItem[];
  currentIdx: number;
  score: number;
  energyPercentage: number;
  userAnswers: UserAnswerRecord[];
  startedAt: string;
  startTimeMs: number;
  isCompleted: boolean;
}

const STORAGE_KEY_SESSION = 'tars_wars_quiz_session';
const STORAGE_KEY_LEADERBOARD = 'tars_wars_local_leaderboard';
const STORAGE_KEY_LAST_RESULTS = 'tars_wars_last_results';

/**
 * Initializes a new quiz attempt with 20 unique randomized questions from the 200-question bank
 */
export function startNewQuizSession(rollNumber: string): QuizSession {
  const selectedQuestions = selectRandomQuestions(20);

  const session: QuizSession = {
    attemptId: `orb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    rollNumber: rollNumber.trim().toUpperCase(),
    questions: selectedQuestions,
    currentIdx: 0,
    score: 0,
    energyPercentage: 0,
    userAnswers: [],
    startedAt: new Date().toISOString(),
    startTimeMs: Date.now(),
    isCompleted: false,
  };

  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    localStorage.setItem('tars_wars_active_attempt_id', session.attemptId);
    localStorage.setItem('tars_wars_pilot_roll', session.rollNumber);
  } catch (e) {
    console.warn('Failed to persist session to localStorage', e);
  }

  return session;
}

/**
 * Retrieves the currently active quiz session if one exists
 */
export function getActiveQuizSession(): QuizSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw) as QuizSession;
    if (session && Array.isArray(session.questions) && session.questions.length === 20 && !session.isCompleted) {
      return session;
    }
  } catch (e) {
    console.warn('Failed to parse active session', e);
  }
  return null;
}

/**
 * Updates properties of the active quiz session
 */
export function updateActiveQuizSession(patch: Partial<QuizSession>): QuizSession | null {
  const current = getActiveQuizSession();
  if (!current) return null;

  const updated: QuizSession = { ...current, ...patch };
  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to update session in localStorage', e);
  }
  return updated;
}

/**
 * Finalizes the session and saves to the local browser leaderboard
 */
export function finalizeQuizSession(session: QuizSession): QuizResults {
  const completedAt = new Date().toISOString();
  const timeTakenSeconds = Math.max(1, Math.round((Date.now() - session.startTimeMs) / 1000));

  const correctCount = session.userAnswers.filter((a) => a.isCorrect).length;
  const unansweredCount = session.userAnswers.filter((a) => a.isUnanswered).length;
  const incorrectCount = session.userAnswers.length - correctCount - unansweredCount;

  const results: QuizResults = {
    attemptId: session.attemptId,
    rollNumber: session.rollNumber,
    status: 'completed',
    score: session.score,
    totalQuestions: session.questions.length, // 20
    energyPercentage: session.energyPercentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    startedAt: session.startedAt,
    completedAt,
    timeTakenSeconds,
    breakdown: session.userAnswers.map((ua, index) => ({
      sequence: index + 1,
      questionText: ua.questionText,
      options: ua.options,
      selectedOptionIndex: ua.selectedOptionIndex,
      selectedOptionText: ua.selectedOptionText,
      correctOptionIndex: ua.correctOptionIndex,
      correctOptionText: ua.correctOptionText,
      isCorrect: ua.isCorrect,
      isUnanswered: ua.isUnanswered,
      explanation: ua.explanation,
      category: ua.category,
      timeTakenSeconds: Math.round(timeTakenSeconds / session.questions.length),
    })),
  };

  // Clear active session
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem('tars_wars_active_attempt_id');
    localStorage.setItem(STORAGE_KEY_LAST_RESULTS, JSON.stringify(results));

    // Append to local leaderboard
    addLeaderboardEntry({
      rank: 1, // Will be recalculated
      id: results.attemptId,
      rollNumber: results.rollNumber,
      rawRollNumber: results.rollNumber,
      score: results.score,
      totalQuestions: results.totalQuestions,
      energyPercentage: results.energyPercentage,
      timeTakenSeconds: results.timeTakenSeconds,
      completedAt: results.completedAt,
    });
  } catch (e) {
    console.warn('Failed to save finalized results', e);
  }

  return results;
}

/**
 * Gets the last saved completed results
 */
export function getLastResults(): QuizResults | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_RESULTS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Adds an attempt to the local leaderboard, sorts, and assigns ranks
 */
export function addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const list = getLocalLeaderboard();
  
  // Replace existing entry with same id if any, or push
  const filtered = list.filter((e) => e.id !== entry.id);
  filtered.push(entry);

  // Tie-breaker: Score (DESC) -> TimeTaken (ASC) -> CompletedAt (ASC)
  filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.timeTakenSeconds !== b.timeTakenSeconds) return a.timeTakenSeconds - b.timeTakenSeconds;
    return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
  });

  // Assign ranks
  filtered.forEach((e, i) => {
    e.rank = i + 1;
  });

  try {
    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to save leaderboard', e);
  }

  return filtered;
}

/**
 * Retrieves the local demo leaderboard from browser storage
 */
export function getLocalLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load local leaderboard', e);
  }

  // Initial curated local benchmark entries if none yet
  const defaultEntries: LeaderboardEntry[] = [
    {
      rank: 1,
      id: 'bench-1',
      rollNumber: '21BCE0491',
      rawRollNumber: '21BCE0491',
      score: 19,
      totalQuestions: 20,
      energyPercentage: 95,
      timeTakenSeconds: 320,
      completedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      rank: 2,
      id: 'bench-2',
      rollNumber: '21BCE1042',
      rawRollNumber: '21BCE1042',
      score: 18,
      totalQuestions: 20,
      energyPercentage: 90,
      timeTakenSeconds: 385,
      completedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      rank: 3,
      id: 'bench-3',
      rollNumber: '21BIT0234',
      rawRollNumber: '21BIT0234',
      score: 17,
      totalQuestions: 20,
      energyPercentage: 85,
      timeTakenSeconds: 410,
      completedAt: new Date(Date.now() - 10800000).toISOString(),
    },
  ];

  try {
    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(defaultEntries));
  } catch (e) {
    // Ignore
  }

  return defaultEntries;
}
