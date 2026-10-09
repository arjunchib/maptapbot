SELECT
  avg(score1) AS ":one:",
  avg(score2) AS ":two:",
  avg(score3) AS ":three:",
  avg(score4) AS ":four:",
  avg(score5) AS ":five:",
  avg(final_score) AS ":abacus:"
FROM scores
WHERE played_at = "2026-10-07";
