CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  message_id INTEGER NOT NULL,
  message_text TEXT NOT NULL,
  played_at TEXT NOT NULL CHECK (played_at == date(played_at)),
  message_at TEXT NOT NULL CHECK (message_at == datetime(message_at)),
  score1 INTEGER NOT NULL,
  score2 INTEGER NOT NULL,
  score3 INTEGER NOT NULL,
  score4 INTEGER NOT NULL,
  score5 INTEGER NOT NULL,
  total INTEGER NOT NULL
);
