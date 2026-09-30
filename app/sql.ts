import createScore from "./sql/create_score.sql" with { type: "text" };
import readScoreByDay from "./sql/read_score_by_day.sql" with { type: "text" };

export { createScore, readScoreByDay };
