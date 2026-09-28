CREATE TABLE __migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  message_text TEXT NOT NULL,
  played_at TEXT NOT NULL,
  message_at TEXT NOT NULL,
  score1 INTEGER NOT NULL,
  score2 INTEGER NOT NULL,
  score3 INTEGER NOT NULL,
  score4 INTEGER NOT NULL,
  score5 INTEGER NOT NULL,
  total INTEGER NOT NULL
);
CREATE UNIQUE INDEX idx_scores_played_at ON scores (played_at, author_id);
