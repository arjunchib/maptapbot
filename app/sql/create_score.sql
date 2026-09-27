INSERT INTO scores
  (
    author_id,
    message_id,
    message_text,
    played_at,
    message_at,
    score1,
    score2,
    score3,
    score4,
    score5,
    total
  )
VALUES
  (
    $author_id,
    $message_id,
    $message_text,
    $played_at,
    $message_at,
    $score1,
    $score2,
    $score3,
    $score4,
    $score5,
    $total
  ) ON CONFLICT DO NOTHING;
