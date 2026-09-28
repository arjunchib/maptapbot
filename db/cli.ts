import { $ } from "bun";
import { readdir, rm } from "node:fs/promises";
import { basename } from "node:path";
import { styleText } from "node:util";

if (Bun.main === import.meta.path) {
  const args = Bun.argv.slice(2);

  if (args.at(0) === "backup") {
    await backup();
  } else if (args.at(0) === "restore") {
    await restore(args.at(1));
  } else {
    console.log(`backup - Backup the current database.
restore <path> - Restore a backup file or most recent backup if omitted.`);
  }
}

export async function backup() {
  const file = timestamp();
  await $`sqlite3 maptapbot.sqlite ".backup './db/backups/${file}.sqlite.bak'"`;

  const files = await readdir("./db/backups");
  const allBackups = files
    .map((f) => {
      const timestamp = basename(f, ".sqlite.bak");
      return {
        datetime: parseTimestamp(timestamp),
        path: f,
      };
    })
    .sort((a, b) => Temporal.PlainDateTime.compare(a.datetime, b.datetime));
  const toDelete = allBackups.slice(0, -5);

  allBackups.forEach((f) => {
    if (toDelete.some((f2) => f.path === f2.path)) {
      console.log(styleText("red", f.path));
    } else if (f.path === `${file}.sqlite.bak`) {
      console.log(styleText("green", f.path));
    } else {
      console.log(f.path);
    }
  });

  for (const f of toDelete) {
    await rm(`./db/backups/${f.path}`);
  }
}

export async function restore(path?: string) {
  if (!path) {
    const files = await readdir("./db/backups");
    const mostRecent = files
      .map((f) => {
        const timestamp = basename(f, ".sqlite.bak");
        return {
          datetime: parseTimestamp(timestamp),
          path: f,
        };
      })
      .sort((a, b) => Temporal.PlainDate.compare(a.datetime, b.datetime))
      .at(-1);
    path = `./db/backups/${mostRecent?.path}`;
  }

  await $`sqlite3 maptapbot.sqlite ".restore '${path}'"`;
}

function timestamp() {
  const dt = Temporal.Now.plainDateTimeISO();
  const date = [dt.year, dt.month, dt.day]
    .map((x) => x.toString().padStart(2, "0"))
    .join("");
  const time = [dt.hour, dt.minute, dt.second]
    .map((x) => x.toString().padStart(2, "0"))
    .join("");
  return `${date}_${time}`;
}

async function getBackups() {}

function parseTimestamp(str: string) {
  // Extract segments using slice
  const year = Number(str.slice(0, 4));
  const month = Number(str.slice(4, 6)); // 01 is January (1-indexed!)
  const day = Number(str.slice(6, 8));
  const hour = Number(str.slice(9, 11));
  const minute = Number(str.slice(11, 13));
  const second = Number(str.slice(13, 15));

  // Create a time-zone-unaware PlainDateTime
  return Temporal.PlainDateTime.from({
    year,
    month,
    day,
    hour,
    minute,
    second,
  });
}
