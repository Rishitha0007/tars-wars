import { describe, it, expect } from 'vitest';
import { QUESTION_BANK, TOTAL_QUESTIONS_IN_BANK, selectRandomQuestions } from './questions.js';

describe('Master Question Bank Validation (Features 4 & 5)', () => {
  it('contains exactly 200 total questions', () => {
    expect(TOTAL_QUESTIONS_IN_BANK).toBe(200);
    expect(QUESTION_BANK.length).toBe(200);
  });

  it('contains exactly 50 questions from each of the 4 source PDFs', () => {
    const set1 = QUESTION_BANK.filter((q) => q.sourcePdf === 'set1.pdf');
    const set2 = QUESTION_BANK.filter((q) => q.sourcePdf === 'set2.pdf');
    const set3 = QUESTION_BANK.filter((q) => q.sourcePdf === 'set3.pdf');
    const set4 = QUESTION_BANK.filter((q) => q.sourcePdf === 'set4.pdf');

    expect(set1.length).toBe(50);
    expect(set2.length).toBe(50);
    expect(set3.length).toBe(50);
    expect(set4.length).toBe(50);
  });

  it('has unique IDs for every question without collisions', () => {
    const ids = new Set(QUESTION_BANK.map((q) => q.id));
    expect(ids.size).toBe(200);
  });

  it('has valid structure and valid answer key mappings for every question', () => {
    const validLetters = ['A', 'B', 'C', 'D'];
    const letterToIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

    QUESTION_BANK.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.questionText.trim().length).toBeGreaterThan(5);
      expect(q.options.length).toBe(4);
      q.options.forEach((opt) => expect(opt.trim().length).toBeGreaterThan(0));

      expect(validLetters).toContain(q.correctOptionLetter);
      expect(q.correctOptionIndex).toBe(letterToIndex[q.correctOptionLetter]);
      expect(q.options[q.correctOptionIndex]).toBe(q.correctOptionText);
      expect(q.category).toBeTruthy();
    });
  });

  it('verifies specific sample questions from each set against source PDFs', () => {
    // Set 1 Q1 & Q50
    const set1Q1 = QUESTION_BANK.find((q) => q.id === 'set1_q1');
    expect(set1Q1?.questionText).toBe('What is translating an idea into a valuable product or service?');
    expect(set1Q1?.correctOptionLetter).toBe('B');
    expect(set1Q1?.correctOptionText).toBe('Innovation');

    const set1Q50 = QUESTION_BANK.find((q) => q.id === 'set1_q50');
    expect(set1Q50?.questionText).toBe('What is achieved when a product satisfies strong market demand?');
    expect(set1Q50?.correctOptionLetter).toBe('B');
    expect(set1Q50?.correctOptionText).toBe('Product-Market Fit');

    // Set 2 Q1 & Q50
    const set2Q1 = QUESTION_BANK.find((q) => q.id === 'set2_q1');
    expect(set2Q1?.questionText).toBe('What is improving an existing product step by step?');
    expect(set2Q1?.correctOptionLetter).toBe('D');
    expect(set2Q1?.correctOptionText).toBe('Incremental innovation');

    const set2Q50 = QUESTION_BANK.find((q) => q.id === 'set2_q50');
    expect(set2Q50?.questionText).toBe('What is responsible innovation meant to consider?');
    expect(set2Q50?.correctOptionLetter).toBe('C');
    expect(set2Q50?.correctOptionText).toBe('Safety, people, and environmental impact');

    // Set 3 Q1 & Q50
    const set3Q1 = QUESTION_BANK.find((q) => q.id === 'set3_q1');
    expect(set3Q1?.questionText).toBe('What is the first step in solving a customer problem?');
    expect(set3Q1?.correctOptionLetter).toBe('A');
    expect(set3Q1?.correctOptionText).toBe('Identify the need');

    const set3Q50 = QUESTION_BANK.find((q) => q.id === 'set3_q50');
    expect(set3Q50?.questionText).toBe('What is a key goal of sustainable space activity?');
    expect(set3Q50?.correctOptionLetter).toBe('A');
    expect(set3Q50?.correctOptionText).toBe('Reduce debris and resource waste');

    // Set 4 Q1 & Q50
    const set4Q1 = QUESTION_BANK.find((q) => q.id === 'set4_q1');
    expect(set4Q1?.questionText).toBe('What is a fresh solution to a problem called?');
    expect(set4Q1?.correctOptionLetter).toBe('B');
    expect(set4Q1?.correctOptionText).toBe('Innovation');

    const set4Q50 = QUESTION_BANK.find((q) => q.id === 'set4_q50');
    expect(set4Q50?.questionText).toBe('What is a simple drawing of a product layout called?');
    expect(set4Q50?.correctOptionLetter).toBe('B');
    expect(set4Q50?.correctOptionText).toBe('Wireframe');
  });

  describe('Feature 6: Random Selection of 20 Unique Questions', () => {
    it('selects exactly 20 unique questions without replacement', () => {
      const selected = selectRandomQuestions(20);
      expect(selected.length).toBe(20);

      const uniqueIds = new Set(selected.map((q) => q.id));
      expect(uniqueIds.size).toBe(20);
    });

    it('each selected question belongs to the master 200 question bank', () => {
      const selected = selectRandomQuestions(20);
      const masterIds = new Set(QUESTION_BANK.map((q) => q.id));
      selected.forEach((q) => {
        expect(masterIds.has(q.id)).toBe(true);
      });
    });

    it('generates different random subsets across multiple attempts', () => {
      const attempt1 = selectRandomQuestions(20);
      const attempt2 = selectRandomQuestions(20);

      const ids1 = attempt1.map((q) => q.id).join(',');
      const ids2 = attempt2.map((q) => q.id).join(',');

      // While mathematically possible to collide, probability is 1 / C(200, 20) ~ 10^-27
      expect(ids1).not.toBe(ids2);
    });
  });
});
