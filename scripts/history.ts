import { client } from "../app/client";
import { db } from "../db/database";
import createScore from "../app/sql/create_score.sql" with { type: "text" };
import type { Score } from "../app/models/score";
import type { Message } from "discord.js";
import { sleep } from "bun";

const channel = await client?.channels.fetch(Bun.env.CHANNEL_ID!);

if (!channel) throw new Error("Missing channel");

if (channel.isTextBased()) {
  let messages = await channel.messages.fetch();
  while (true) {
    await sleep(500);
    const res = await channel.messages.fetch({ before: messages.lastKey() });
    messages = messages.concat(res);
    if (res.size === 0) break;
  }
  const scores = messages
    .map((m) => {
      const result = parseMessage(m);
      if (!result) return;
      const score: Score = {
        ...result,
        author_id: m.author.id,
        message_id: m.id,
        message_text: m.content,
        message_at: m.createdAt.toISOString(),
      };
      console.log(score);
      return score;
    })
    .filter((s) => s != null);

  console.log("query", createScore);
  const insert = db.prepare(createScore);
  const insertMany = db.transaction((values) => {
    for (const value of values) insert.run(value);
  });
  console.log(scores[0]);
  console.log(scores.length);
  console.log(insertMany(scores));
}

await client.destroy();

function parseMessage(message: Message) {
  const { content, createdAt } = message;
  const matches = content.match(
    /www\.maptap\.gg (.*) (\d+)\n(.*)\nFinal score: (\d*)/,
  );
  const [_, monthStr, dayStr, scoresStr, totalStr] = matches || [];
  if (!monthStr || !dayStr || !scoresStr || !totalStr) return null;

  // date
  const monthDay = Temporal.PlainMonthDay.from({
    month: monthNameToNumber(monthStr),
    day: Number(dayStr),
  });
  const currentYear = createdAt.getUTCFullYear();
  const plainDate = monthDay.toPlainDate({ year: currentYear });
  const played_at = plainDate.toString();

  // scores
  const scoreMatches = [...scoresStr.matchAll(/\d+/g)].map((m) => Number(m[0]));
  const [score1, score2, score3, score4, score5] = scoreMatches;
  if (
    score1 == null ||
    score2 == null ||
    score3 == null ||
    score4 == null ||
    score5 == null
  )
    return null;

  // total
  const total = Number(totalStr);

  return { played_at, score1, score2, score3, score4, score5, total };
}

function monthNameToNumber(name: string) {
  const months: Record<string, number> = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };
  return months[name.toLowerCase()];
}
