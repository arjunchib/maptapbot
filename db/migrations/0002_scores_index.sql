DROP INDEX IF EXISTS idx_scores_played_at;
CREATE UNIQUE INDEX idx_scores_played_at ON scores (played_at, author_id);
