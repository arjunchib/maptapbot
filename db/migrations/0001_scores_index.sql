DELETE FROM scores;
CREATE INDEX idx_scores_played_at ON scores (played_at, author_id);
