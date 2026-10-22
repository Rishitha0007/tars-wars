-- TARS WARS Universal Relational Database Schema
-- Local self-hosted SQLite Database for College Technical Fest

CREATE TABLE IF NOT EXISTS fest_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question_text TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON string of 4 string options
  correct_option_index INTEGER NOT NULL,
  explanation TEXT,
  category TEXT DEFAULT 'General',
  difficulty TEXT DEFAULT 'medium',
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  normalized_roll_number TEXT NOT NULL UNIQUE,
  raw_roll_number TEXT NOT NULL,
  roll_number TEXT NOT NULL, -- Compatibility alias
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'expired'
  current_question_index INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  percentage REAL DEFAULT 0.0,
  energy_percentage INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  unanswered_count INTEGER DEFAULT 0,
  assigned_question_ids TEXT, -- JSON array of assigned 20 question IDs in order
  started_at TEXT NOT NULL,
  completed_at TEXT,
  time_taken_seconds INTEGER DEFAULT 0,
  metadata TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attempt_responses (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  sequence_number INTEGER NOT NULL, -- 1 through 20
  shuffled_options TEXT NOT NULL, -- JSON string array
  correct_shuffled_index INTEGER NOT NULL, -- Never exposed to client before answer!
  selected_option_index INTEGER, -- 0-3 when submitted, NULL when pending
  is_correct INTEGER, -- 1=true, 0=false, NULL=unanswered
  is_unanswered INTEGER DEFAULT 0, -- 1 if timed out
  activated_at TEXT NOT NULL,
  deadline_at TEXT NOT NULL,
  submitted_at TEXT,
  time_taken_ms INTEGER,
  FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS idx_attempts_normalized_roll ON attempts(normalized_roll_number);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard ON attempts(status, score DESC, time_taken_seconds ASC, completed_at ASC);
CREATE INDEX IF NOT EXISTS idx_attempt_responses_attempt_seq ON attempt_responses(attempt_id, sequence_number);

