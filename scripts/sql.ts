import { db } from "../db/database";

const args = Bun.argv.slice(2);

const name = args.at(0);
if (!name) throw new Error("Missing query name");

const file = Bun.file(`./app/sql/${name}.sql`);
const query = await file.text();

console.log(db.query(query).all());
