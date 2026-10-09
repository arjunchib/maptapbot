import createScore from "./sql/create_score.sql" with { type: "text" };
import getScoreByDay from "./sql/get_score_by_day.sql" with { type: "text" };
import getLastScore from "./sql/get_last_score.sql" with { type: "text" };
import updateRank from "./sql/update_rank.sql" with { type: "text" };
import getDailyAverages from "./sql/get_daily_averages.sql" with { type: "text" };
import getAvgScoresByDay from "./sql/get_avg_scores_by_day.sql" with { type: "text" };

export {
  createScore,
  getScoreByDay,
  getLastScore,
  updateRank,
  getDailyAverages,
  getAvgScoresByDay,
};
