import { QUESTION_BANK } from '../../src/data/questions.js';

export interface SeedQuestion {
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const SEED_QUESTIONS: SeedQuestion[] = QUESTION_BANK.map((q) => ({
  question_text: q.questionText,
  options: q.options,
  correct_option_index: q.correctOptionIndex,
  explanation: q.explanation,
  category: q.category,
  difficulty: 'medium',
}));
