import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { db } from "./database";
import { $ } from "bun";
import { backup } from "./cli";

// 1. Create a tracking table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS __migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// 2. Read all migration files
const migrationsDir = join(import.meta.dir, "migrations");
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

// 2a. Backup
console.log(`Backing up`);
await backup();

// 3. Run pending migrations in a transaction
db.transaction(() => {
  for (const file of files) {
    const isExecuted = db
      .prepare("SELECT 1 FROM __migrations WHERE name = ?")
      .get(file);

    if (!isExecuted) {
      console.log(`Applying migration: ${file}`);
      const sql = readFileSync(join(migrationsDir, file), "utf8");

      db.run(sql); // Run the migration SQL
      db.prepare("INSERT INTO __migrations (name) VALUES (?)").run(file); // Track execution
    }
  }
})();

console.log("Database is up to date.");

// Update schema
await $`sqlite3 ./db/maptapbot.sqlite .schema > schema.sql`;

console.log("Saved schema to schema.sql.");
