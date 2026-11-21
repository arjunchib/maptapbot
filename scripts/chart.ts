import { buildChart } from "../app/lib/build_chart";
import { Score } from "../app/models/score";
import { getScoresByDay } from "../app/sql";
import { dbReadonly } from "../db/database";

const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });

const scores = dbReadonly
  .query(getScoresByDay)
  .as(Score)
  .all({ played_at: yesterday.toString() });

await Bun.write("chart.png", buildChart(scores));
