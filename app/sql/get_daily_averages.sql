SELECT
  played_at,
  avg(score1) AS score1,
  avg(score2) AS score2,
  avg(score3) * 2 AS score3,
  avg(score4) * 3 AS score4,
  avg(score5) * 3 AS score5
FROM scores
GROUP BY played_at;
