SELECT *
FROM scores
WHERE (played_at = $played_at)
ORDER BY final_score DESC;
