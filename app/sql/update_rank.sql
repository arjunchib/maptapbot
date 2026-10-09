WITH
  RankedDay AS (
    SELECT
      id,
      RANK() OVER (
        PARTITION BY played_at
        ORDER BY final_score DESC
      ) AS rank
    FROM scores
    WHERE
      played_at IN (SELECT DISTINCT played_at FROM scores WHERE rank IS NULL)
  )
UPDATE scores
SET rank = RankedDay.rank
FROM RankedDay
WHERE scores.id = RankedDay.id;
