import { Collection, type Client, type Message } from "discord.js";
import { db } from "../../db/database";
import { Score } from "../models/score";
import { createScore, getLastScore } from "../sql";
import { environment } from "../env";
import { sleep } from "bun";
import { messageParser } from "./message_parser";

export async function backfillMessages(client: Client) {
  const channel = await client?.channels.fetch(environment.channel_id);
  if (!channel || !channel.isTextBased()) throw new Error("Missing channel");

  const { message_id } = db.query(getLastScore).as(Score).get() || {};

  let messages = new Collection<string, Message<boolean>>();
  let after = message_id;

  while (true) {
    const batch = await channel.messages.fetch({ limit: 100, after });
    if (!batch.size) break;
    messages = messages.concat(batch.reverse());
    after = messages.lastKey();
    await sleep(500);
  }

  const scores = messages
    .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
    .map((m) => messageParser.parse(m))
    .filter((m) => m != null);

  const insert = db.prepare(createScore);
  const insertMany = db.transaction((values) => {
    for (const value of values) insert.run(value);
  });
  insertMany(scores);
}
