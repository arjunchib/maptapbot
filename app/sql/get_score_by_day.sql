SELECT
  s.*,
  COALESCE(
    MAX(
      CASE
        WHEN r.rank = 1 THEN r.total
      END
    ),
    0
  ) AS gold,
  COALESCE(
    MAX(
      CASE
        WHEN r.rank = 2 THEN r.total
      END
    ),
    0
  ) AS silver,
  COALESCE(
    MAX(
      CASE
        WHEN r.rank = 3 THEN r.total
      END
    ),
    0
  ) AS bronze
FROM
  scores AS s
  JOIN (
    SELECT author_id, rank, count(*) AS total
    FROM scores
    WHERE rank IN (1, 2, 3)
    GROUP BY author_id, rank
  ) AS r
    ON s.author_id = r.author_id
WHERE (s.played_at = $played_at)
GROUP BY s.author_id;
