// @jsxImportSource mango

import { db } from "../db/database";
import { Score } from "../app/models/score";
import { client } from "../app/client";
import { DailySummary } from "../app/views/daily_summary";
import { readScoreByDay } from "../app/sql";
import { environment } from "../app/env";
import { backfillMessages, backfillRanks } from "../app/helpers";

await backfillMessages(client);
backfillRanks();

const sendChannel = await client.channels.fetch(environment.send_channel_id);

if (!sendChannel || !sendChannel.isSendable())
  throw new Error("Missing send channel");

const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });

const scoresFromDb = db
  .query(readScoreByDay)
  .as(Score)
  .all({ played_at: yesterday.toString() });

await sendChannel.send(<DailySummary scores={scoresFromDb} date={yesterday} />);

await client.destroy();
