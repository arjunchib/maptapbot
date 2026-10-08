SELECT *
FROM scores
WHERE played_at IN (SELECT DISTINCT played_at FROM scores WHERE rank IS NULL);
