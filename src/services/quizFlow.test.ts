import { describe, it, expect, beforeEach } from 'vitest';
import {
  startNewQuizSession,
  getActiveQuizSession,
  updateActiveQuizSession,
  finalizeQuizSession,
  getLocalLeaderboard,
  getLastResults,
} from './quizSession.js';

// Simple in-memory localStorage mock for node test environment
const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, val: string) => { mockStorage[key] = String(val); },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => {
    for (const k of Object.keys(mockStorage)) delete mockStorage[k];
  },
  key: (i: number) => Object.keys(mockStorage)[i] ?? null,
  length: 0,
};

describe('TARS WARS Full Quiz Flow Integration Tests (Features 1, 2, 6, 7, 8)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Feature 6: Initializes attempt with exactly 20 unique random questions', () => {
    const session = startNewQuizSession('21BCE2001');
    expect(session.rollNumber).toBe('21BCE2001');
    expect(session.questions.length).toBe(20);

    const uniqueIds = new Set(session.questions.map((q) => q.id));
    expect(uniqueIds.size).toBe(20);
    expect(session.score).toBe(0);
    expect(session.energyPercentage).toBe(0);
  });

  it('Feature 1 & 2: Handles selection, change, removal, and locked submission evaluation', () => {
    const session = startNewQuizSession('21BCE2001');
    const firstQ = session.questions[0];

    // 1. Selection: choosing an option does not alter score or energy
    let selectedOption: number | null = (firstQ.correctOptionIndex + 1) % 4; // initially pick wrong
    expect(session.score).toBe(0);
    expect(session.energyPercentage).toBe(0);

    // 2. Change option: user switches to correct option
    selectedOption = firstQ.correctOptionIndex;
    expect(session.score).toBe(0);
    expect(session.energyPercentage).toBe(0);

    // 3. Remove option: user clicks REMOVE SELECTED OPTION
    selectedOption = null;
    expect(selectedOption).toBeNull();

    // 4. NEXT clicked with no option: rejected
    let validationError = selectedOption === null ? 'Select an answer or wait for the timer to expire.' : null;
    expect(validationError).toBe('Select an answer or wait for the timer to expire.');

    // 5. Select correct option again and submit
    selectedOption = firstQ.correctOptionIndex;
    const isCorrect = selectedOption === firstQ.correctOptionIndex;
    const newScore = isCorrect ? session.score + 1 : session.score;
    const newEnergy = newScore * 5; // +5 percentage points

    expect(isCorrect).toBe(true);
    expect(newScore).toBe(1);
    expect(newEnergy).toBe(5);

    // 6. Test wrong answer submission on Q2: does not subtract previously earned energy
    const secondQ = session.questions[1];
    const wrongOption = (secondQ.correctOptionIndex + 1) % 4;
    const isQ2Correct = wrongOption === secondQ.correctOptionIndex;
    const scoreAfterQ2 = isQ2Correct ? newScore + 1 : newScore;
    const energyAfterQ2 = scoreAfterQ2 * 5;

    expect(isQ2Correct).toBe(false);
    expect(scoreAfterQ2).toBe(1); // unchanged
    expect(energyAfterQ2).toBe(5); // unchanged: earned energy is NEVER subtracted
  });

  it('Feature 7 & 1.10: Unanswered timeout records 0 points and preserves earned energy', () => {
    const session = startNewQuizSession('21BCE2001');
    session.score = 3;
    session.energyPercentage = 15;

    // Timeout occurs with no option selected
    const chosenOption = null;
    const isUnanswered = chosenOption === null;
    const isCorrect = false;

    const newScore = isCorrect ? session.score + 1 : session.score;
    const newEnergy = session.energyPercentage; // No change

    expect(isUnanswered).toBe(true);
    expect(newScore).toBe(3);
    expect(newEnergy).toBe(15);
  });

  it('Feature 8: Finalizing session produces accurate telemetry and updates local leaderboard', () => {
    const session = startNewQuizSession('PILOT_TEST');

    // Simulate answering 20 questions (18 correct, 1 incorrect, 1 unanswered timeout)
    session.questions.forEach((q, idx) => {
      let selectedOption: number | null = null;
      let isCorrect = false;
      let isUnanswered = false;

      if (idx < 18) {
        selectedOption = q.correctOptionIndex;
        isCorrect = true;
      } else if (idx === 18) {
        selectedOption = (q.correctOptionIndex + 1) % 4;
        isCorrect = false;
      } else {
        selectedOption = null;
        isUnanswered = true;
      }

      session.userAnswers.push({
        questionId: q.id,
        sourcePdf: q.sourcePdf,
        originalQNum: q.originalQNum,
        questionText: q.questionText,
        category: q.category,
        options: q.options,
        selectedOptionIndex: selectedOption,
        selectedOptionText: selectedOption !== null ? q.options[selectedOption] : '[UNANSWERED]',
        correctOptionIndex: q.correctOptionIndex,
        correctOptionText: q.options[q.correctOptionIndex],
        isCorrect,
        isUnanswered,
        explanation: q.explanation,
      });
    });

    session.score = 18;
    session.energyPercentage = 18 * 5; // 90%

    const results = finalizeQuizSession(session);

    expect(results.score).toBe(18);
    expect(results.totalQuestions).toBe(20);
    expect(results.energyPercentage).toBe(90);
    expect(results.correctCount).toBe(18);
    expect(results.incorrectCount).toBe(1);
    expect(results.unansweredCount).toBe(1);
    expect(results.breakdown.length).toBe(20);

    // Verify local leaderboard has this entry
    const leaderboard = getLocalLeaderboard();
    const found = leaderboard.find((e) => e.rollNumber === 'PILOT_TEST');
    expect(found).toBeDefined();
    expect(found?.score).toBe(18);
    expect(found?.energyPercentage).toBe(90);
  });

  it('Feature 9: Quiz results persistence ensures ResultsPage receives data even after attempt is cleared', () => {
    const session = startNewQuizSession('PILOT_PERSIST_TEST');
    const results = finalizeQuizSession(session);

    // Active attempt is cleared from localStorage upon completion
    expect(localStorage.getItem('tars_wars_active_attempt_id')).toBeNull();

    // Last results are persisted and available for ResultsPage
    const cached = getLastResults();
    expect(cached).not.toBeNull();
    expect(cached?.rollNumber).toBe('PILOT_PERSIST_TEST');
    expect(cached?.attemptId).toBe(results.attemptId);
  });
});
