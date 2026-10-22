-- TARS WARS Universal Relational Database Schema
-- Compatible with SQLite and PostgreSQL

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
  roll_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  current_question_index INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  energy_percentage INTEGER DEFAULT 0,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  time_taken_seconds INTEGER DEFAULT 0,
  metadata TEXT,
  created_at TEXT NOT NULL
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
CREATE INDEX IF NOT EXISTS idx_attempts_roll ON attempts(roll_number);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard ON attempts(status, score DESC, time_taken_seconds ASC, completed_at ASC);
CREATE INDEX IF NOT EXISTS idx_attempt_responses_attempt_seq ON attempt_responses(attempt_id, sequence_number);
