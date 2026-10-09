// @jsxImportSource mango

import { db } from "../db/database";
import { Score } from "../app/models/score";
import { client } from "../app/client";
import { DailySummary } from "../app/views/daily_summary";
import { getScoreByDay, updateRank } from "../app/sql";
import { environment } from "../app/env";
import { backfillMessages } from "../app/lib/backfill_messages";

await backfillMessages(client);

db.run(updateRank);

const sendChannel = await client.channels.fetch(environment.send_channel_id);

if (!sendChannel || !sendChannel.isSendable())
  throw new Error("Missing send channel");

const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });

const scoresFromDb = db
  .query(getScoreByDay)
  .as(Score)
  .all({ played_at: yesterday.toString() });

await sendChannel.send(<DailySummary scores={scoresFromDb} date={yesterday} />);

await client.destroy();
