DROP INDEX IF EXISTS idx_scores_played_at;

DELETE FROM scores
WHERE
  rowid NOT IN (
    SELECT MIN(rowid)
    FROM scores
    GROUP BY played_at, author_id
  );

CREATE UNIQUE INDEX idx_scores_played_at ON scores (played_at, author_id);
