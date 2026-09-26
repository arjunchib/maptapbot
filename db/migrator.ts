import { Database } from "bun:sqlite";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { db } from "./database";

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
