// @jsxImportSource mango

import { db } from "../db/database";
import { client } from "../app/client";
import { DailySummary } from "../app/views/daily_summary";
import { updateRank } from "../app/sql";
import { environment } from "../app/env";
import { backfillMessages } from "../app/lib/backfill_messages";

await backfillMessages(client);

db.run(updateRank);

const sendChannel = await client.channels.fetch(environment.send_channel_id);

if (!sendChannel || !sendChannel.isSendable())
  throw new Error("Missing send channel");

const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });

await sendChannel.send(<DailySummary date={yesterday} />);

await client.destroy();
