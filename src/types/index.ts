export interface QuestionClient {
  sequenceNumber: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  activatedAt: string;
  deadlineAt: string;
  remainingSeconds: number;
  isAnswered: boolean;
  selectedOptionIndex: number | null;
  isCorrect?: boolean;
  isExpired?: boolean;
  score?: number;
  energyPercentage?: number;
}

export interface SubmitAnswerResponse {
  success: boolean;
  isCorrect: boolean;
  explanation: string;
  correctOptionIndex: number;
  score: number;
  energyPercentage: number;
  isLastQuestion: boolean;
  nextQuestionIndex: number;
}

export interface QuestionBreakdown {
  sequence: number;
  questionText: string;
  options: string[];
  selectedOptionIndex: number | null;
  selectedOptionText: string | null;
  correctOptionIndex: number;
  correctOptionText: string;
  isCorrect: boolean;
  isUnanswered: boolean;
  explanation: string;
  category: string;
  timeTakenSeconds: number;
}

export interface QuizResults {
  attemptId: string;
  rollNumber: string;
  status: 'completed' | 'in_progress' | 'abandoned';
  score: number;
  totalQuestions: number;
  energyPercentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  startedAt: string;
  completedAt: string;
  timeTakenSeconds: number;
  breakdown: QuestionBreakdown[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  rollNumber: string;
  rawRollNumber?: string;
  score: number;
  totalQuestions: number;
  energyPercentage: number;
  timeTakenSeconds: number;
  completedAt: string;
}

export interface AdminQuestion {
  id: string;
  question_text: string;
  options: string;
  parsedOptions?: string[];
  correct_option_index: number;
  explanation: string;
  category: string;
  difficulty: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface AdminAttempt {
  id: string;
  roll_number: string;
  normalized_roll_number?: string;
  raw_roll_number?: string;
  status: string;
  current_question_index: number;
  score: number;
  percentage?: number;
  energy_percentage: number;
  correct_count?: number;
  incorrect_count?: number;
  unanswered_count?: number;
  time_taken_seconds: number;
  started_at: string;
  completed_at: string | null;
  updated_at?: string;
}

export interface AdminAttemptsResponse {
  attempts: AdminAttempt[];
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
}
