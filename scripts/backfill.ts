import { client } from "../app/client";
import { backfillRanks, backfillMessages } from "../app/helpers";

await backfillMessages(client);
backfillRanks();
await client.destroy();
