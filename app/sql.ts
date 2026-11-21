import createScore from "./sql/create_score.sql" with { type: "text" };
import getScoresByDay from "./sql/get_scores_by_day.sql" with { type: "text" };
import getLastScore from "./sql/get_last_score.sql" with { type: "text" };
import updateRank from "./sql/update_rank.sql" with { type: "text" };
import getDailyAverages from "./sql/get_daily_averages.sql" with { type: "text" };
import getAvgScoresByDay from "./sql/get_avg_scores_by_day.sql" with { type: "text" };
import getLeaderboard from "./sql/get_leaderboard.sql" with { type: "text" };
import getMedalCount from "./sql/get_medal_count.sql" with { type: "text" };

export {
  createScore,
  getScoresByDay,
  getLastScore,
  updateRank,
  getDailyAverages,
  getAvgScoresByDay,
  getLeaderboard,
  getMedalCount,
};
