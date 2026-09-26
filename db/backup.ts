import { db } from "./database";

db.run("PRAGMA wal_checkpoint(TRUNCATE);");
db.run("VACUUM INTO './db/backups/database.db'");
