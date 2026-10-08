import * as sql from "../app/sql";
import { dbReadonly } from "../db/database";

const args = Bun.argv.slice(2);

const query = args.at(0);
if (!query) throw new Error("Missing query");

console.log(dbReadonly.query(sql[query as keyof typeof sql]).all());
