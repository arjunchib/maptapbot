import { client } from "../client";
import { db } from "../../db/database";
import { messageParser } from "../message_parser";
import createScore from "../sql/create_score.sql" with { type: "text" };

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channelId !== Bun.env.TEST_CHANNEL_ID!) return;

  const result = messageParser.parse(message);
  if (!result) return;

  console.log(result);

  db.prepare(createScore).run(result);
});
