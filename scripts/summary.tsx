import { db } from "../db/database";
import { Score } from "../app/models/score";
import { client } from "../app/client";
import { DailySummary } from "../app/views/daily_summary";
import { SnowflakeUtil } from "discord.js";
import { createScore, readScoreByDay } from "../app/sql";
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

const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });

const snowflake = SnowflakeUtil.generate({
  timestamp: yesterday.toZonedDateTime("UTC").epochMilliseconds,
});

const messages = await channel.messages.fetch({
  after: snowflake.toString(),
  limit: 100,
});

const scoresToDb = messages
  .map((m) => messageParser.parse(m))
  .filter((m) => m != null);

const insert = db.prepare(createScore);
const insertMany = db.transaction((values) => {
  for (const value of values) insert.run(value);
});
insertMany(scoresToDb);

const scoresFromDb = db
  .query(readScoreByDay)
  .as(Score)
  .all({ played_at: yesterday.toString() });

await sendChannel.send(<DailySummary scores={scoresFromDb} date={yesterday} />);

await client.destroy();
