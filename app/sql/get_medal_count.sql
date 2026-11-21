SELECT
  author_id,
  COALESCE(
    MAX(
      CASE
        WHEN rank = 1 THEN total
      END
    ),
    0
  ) AS gold,
  COALESCE(
    MAX(
      CASE
        WHEN rank = 2 THEN total
      END
    ),
    0
  ) AS silver,
  COALESCE(
    MAX(
      CASE
        WHEN rank = 3 THEN total
      END
    ),
    0
  ) AS bronze
FROM
  (
    SELECT author_id, rank, count(*) AS total
    FROM scores
    WHERE rank IN (1, 2, 3)
    GROUP BY author_id, rank
  )
GROUP BY author_id
ORDER BY gold DESC, silver DESC, bronze DESC;
