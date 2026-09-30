import { client } from "../app/client";
import { db } from "../db/database";
import createScore from "../app/sql/create_score.sql" with { type: "text" };
import { sleep } from "bun";
import { messageParser } from "../app/message_parser";
import { environment } from "../app/env";

const channel = await client?.channels.fetch(environment.channel_id);

if (!channel) throw new Error("Missing channel");

if (channel.isTextBased()) {
  let messages = await channel.messages.fetch({ limit: 100 });
  while (true) {
    await sleep(500);
    const res = await channel.messages.fetch({
      before: messages.lastKey(),
      limit: 100,
    });
    messages = messages.concat(res);
    if (res.size === 0) break;
  }
  const scores = messages
    .map((m) => messageParser.parse(m))
    .filter((m) => m != null);

  const insert = db.prepare(createScore);
  const insertMany = db.transaction((values) => {
    for (const value of values) insert.run(value);
  });
  insertMany(scores);
}

await client.destroy();
