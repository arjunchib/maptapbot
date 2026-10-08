import createScore from "./sql/create_score.sql" with { type: "text" };
import readScoreByDay from "./sql/read_score_by_day.sql" with { type: "text" };
import getLastScore from "./sql/get_last_score.sql" with { type: "text" };
import getMissingRank from "./sql/get_missing_rank.sql" with { type: "text" };
import updateRank from "./sql/update_rank.sql" with { type: "text" };
import getDailyAverages from "./sql/get_daily_averages.sql" with { type: "text" };

export {
  createScore,
  readScoreByDay,
  getLastScore,
  getMissingRank,
  updateRank,
  getDailyAverages,
};
