import { db } from "../db/database";
import readScoreByDay from "../app/sql/read_score_by_day.sql" with { type: "text" };
import { Score } from "../app/models/score";
import { client } from "../app/client";
import { DailySummary } from "../app/views/daily_summary";

const channel = await client.channels.fetch(Bun.env.TEST_CHANNEL_ID!);
if (!channel) throw new Error("Missing channel");

const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });
const scores = db
  .query(readScoreByDay)
  .as(Score)
  .all({ played_at: yesterday.toString() });

if (channel.isSendable()) {
  await channel.send(<DailySummary scores={scores} date={yesterday} />);
}

await client.destroy();
