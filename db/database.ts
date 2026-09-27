import { Database, constants } from "bun:sqlite";

export const db = new Database("./db/maptapbot.sqlite", {
  create: true,
  strict: true,
});

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA busy_timeout = 5000;");
db.fileControl(constants.SQLITE_FCNTL_PERSIST_WAL, 0);

export const dbReadonly = new Database("./db/maptapbot.sqlite", {
  strict: true,
  readonly: true,
});
