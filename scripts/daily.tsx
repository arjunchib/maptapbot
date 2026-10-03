// @jsxImportSource mango

import { db } from "../db/database";
import { Score } from "../app/models/score";
import { client } from "../app/client";
import { DailySummary } from "../app/views/daily_summary";
import { createScore, getLastScore, readScoreByDay } from "../app/sql";
import { messageParser } from "../app/message_parser";
import { environment } from "../app/env";

const channel = await client.channels.fetch(environment.channel_id);
if (!channel || !channel.isTextBased()) throw new Error("Missing channel");

const sendChannel =
  environment.channel_id === environment.send_channel_id
    ? channel
    : await client.channels.fetch(environment.send_channel_id);

if (!sendChannel || !sendChannel.isSendable())
  throw new Error("Missing send channel");

const score = db.query(getLastScore).as(Score).get();

if (!score) throw new Error("Could not get the latest score");

const messages = await channel.messages.fetch({
  after: score.message_id,
  limit: 100,
});

if (messages.size >= 100)
  throw new Error(`Expected 100 messages but got ${messages.size}`);

const scoresToDb = messages
  .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
  .map((m) => messageParser.parse(m))
  .filter((m) => m != null);

const insert = db.prepare(createScore);
const insertMany = db.transaction((values) => {
  for (const value of values) insert.run(value);
});
insertMany(scoresToDb);

const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });

const scoresFromDb = db
  .query(readScoreByDay)
  .as(Score)
  .all({ played_at: yesterday.toString() });

await sendChannel.send(<DailySummary scores={scoresFromDb} date={yesterday} />);

await client.destroy();
