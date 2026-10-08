import type { Client } from "discord.js";
import { db } from "../db/database";
import { Score } from "./models/score";
import { createScore, getLastScore, getMissingRank, updateRank } from "./sql";
import { environment } from "./env";
import { sleep } from "bun";
import { messageParser } from "./message_parser";

export async function backfillMessages(client: Client) {
  const channel = await client?.channels.fetch(environment.channel_id);
  if (!channel || !channel.isTextBased()) throw new Error("Missing channel");

  const { message_id: after } = db.query(getLastScore).as(Score).get() || {};

  let messages = await channel.messages.fetch({
    limit: 100,
    after,
  });

  while (true) {
    await sleep(500);
    const res = await channel.messages.fetch({
      after: messages.lastKey(),
      limit: 100,
    });
    if (res.size === 0) break;
    messages = messages.concat(res.reverse());
    console.log(messages.size, res.size);
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

export function backfillRanks() {
  const scores = db.query(getMissingRank).as(Score).all();
  const scoresByDate = Map.groupBy(scores, (score) => score.played_at);

  const update = db.prepare(updateRank);
  const updateMany = db.transaction((values) => {
    for (const value of values) update.run(value);
  });

  scoresByDate.forEach((scores) => {
    const rankedScores = scores
      .sort((a, b) => b.final_score - a.final_score)
      .map((s, i) => {
        s.rank = i + 1;
        return s;
      });
    updateMany(rankedScores);
  });
}
