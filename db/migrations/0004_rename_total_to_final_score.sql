-- Migration: 001_rename_total_to_final_score
-- Description: Renames the 'total' column to 'final_score' in the scores table.

ALTER TABLE scores
RENAME COLUMN total TO final_score;