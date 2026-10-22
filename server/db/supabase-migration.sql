-- TARS WARS Supabase / PostgreSQL Migration Script
-- Run this in your Supabase SQL Editor if connecting to Supabase

CREATE TABLE IF NOT EXISTS fest_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INTEGER NOT NULL,
  explanation TEXT,
  category TEXT DEFAULT 'General',
  difficulty TEXT DEFAULT 'medium',
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  roll_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  current_question_index INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  energy_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_taken_seconds INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempt_responses (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id),
  sequence_number INTEGER NOT NULL,
  shuffled_options JSONB NOT NULL,
  correct_shuffled_index INTEGER NOT NULL,
  selected_option_index INTEGER,
  is_correct INTEGER,
  is_unanswered INTEGER DEFAULT 0,
  activated_at TIMESTAMPTZ NOT NULL,
  deadline_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  time_taken_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_attempts_roll ON attempts(roll_number);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard ON attempts(status, score DESC, time_taken_seconds ASC, completed_at ASC);
CREATE INDEX IF NOT EXISTS idx_attempt_responses_attempt_seq ON attempt_responses(attempt_id, sequence_number);

-- Supabase RLS (Row Level Security) Configuration
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fest_settings ENABLE ROW LEVEL SECURITY;

-- Note: The Express backend acts as the secure trusted service layer with service_role / direct pool connection.
