import type { Message } from "discord.js";

export class MessageParser {
  parse(message: Message) {
    const { content, createdAt } = message;
    const matches = content.match(
      /www\.maptap\.gg (.*) (\d+)\n(.*)\nFinal score: (\d*)/,
    );
    const [_, monthStr, dayStr, scoresStr, totalStr] = matches || [];
    if (!monthStr || !dayStr || !scoresStr || !totalStr) return null;

    // date
    const monthDay = Temporal.PlainMonthDay.from({
      month: this.monthNameToNumber(monthStr),
      day: Number(dayStr),
    });
    const currentYear = createdAt.getUTCFullYear();
    const plainDate = monthDay.toPlainDate({ year: currentYear });
    const played_at = plainDate.toString();

    // scores
    const scoreMatches = [...scoresStr.matchAll(/\d+/g)].map((m) =>
      Number(m[0]),
    );
    const [score1, score2, score3, score4, score5] = scoreMatches;
    if (
      score1 == null ||
      score2 == null ||
      score3 == null ||
      score4 == null ||
      score5 == null
    )
      return null;

    // total
    const total = Number(totalStr);

    return {
      played_at,
      score1,
      score2,
      score3,
      score4,
      score5,
      total,
      author_id: message.author.id,
      message_id: message.id,
      message_text: message.content,
      message_at: message.createdAt.toISOString(),
    };
  }

  private monthNameToNumber(name: string) {
    const months: Record<string, number> = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };
    return months[name.toLowerCase()];
  }
}

export const messageParser = new MessageParser();
