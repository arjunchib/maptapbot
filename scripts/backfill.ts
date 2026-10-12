import { client } from "../app/client";
import { backfillMessages } from "../app/lib/backfill_messages";
import { updateRank } from "../app/sql";
import { db } from "../db/database";

await backfillMessages(client);

db.run(updateRank);

await client.destroy();
