import { Container, Message, Section, TextDisplay, Thumbnail } from "mango";
import { Score } from "../models/score";
import { AttachmentBuilder, inlineCode, time } from "discord.js";
import { buildChart } from "../lib/build_chart";
import { dbReadonly } from "../../db/database";
import { getLeaderboard, getMedalCount, getScoresByDay } from "../sql";

class MedalCountEntry {
  author_id!: string;
  gold!: number;
  silver!: number;
  bronze!: number;
}

export class DailySummary {
  private dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  private dateFormatter2 = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  private scores: Score[];

  constructor(private props: { date: Temporal.PlainDate }) {
    this.scores = dbReadonly
      .query(getScoresByDay)
      .as(Score)
      .all({ played_at: this.props.date.toString() });
  }

  private formattedDate() {
    return this.dateFormatter.format(this.props.date);
  }

  private formatMedal(count: number) {
    return inlineCode(count.toString().padStart(2));
  }

  private dailyScores() {
    return this.scores
      .map(
        (s, i) =>
          `${i + 1}. ${inlineCode(s.final_score.toString())} <@${s.author_id}>`,
      )
      .join("\n");
  }

  private leaderboard() {
    return dbReadonly
      .query(getLeaderboard)
      .as(Score)
      .all()
      .map(
        (s, i) =>
          `${i + 1}. ${inlineCode(s.final_score.toString())} ${inlineCode(
            this.dateFormatter2.format(s.playedAt),
          )} <@${s.author_id}>${s.playedAt.equals(this.props.date) ? " 🆕" : ""}`,
      )
      .join("\n");
  }

  private medalCount() {
    return dbReadonly
      .query(getMedalCount)
      .as(MedalCountEntry)
      .all()
      .map(
        (s, i) =>
          `${i + 1}. 🥇${this.formatMedal(s.gold)} 🥈${this.formatMedal(s.silver)} 🥉${this.formatMedal(s.bronze)} <@${s.author_id}>`,
      )
      .join("\n");
  }

  private copy() {
    return `# ${this.formattedDate()}
### Daily Scores
${this.dailyScores()}
### Medal Count
${this.medalCount()}
### Leaderboard
${this.leaderboard()}
`;
  }

  render() {
    const filename = `chart-${this.props.date}.png`;
    const ab = new AttachmentBuilder(buildChart(this.scores), {
      name: filename,
    });

    return (
      <Message allowedMentions={{ parse: [] }} files={[ab]}>
        <Container>
          <Section
            accessory={
              <Thumbnail
                media={{ url: `attachment://${filename}` }}
              ></Thumbnail>
            }
          >
            <TextDisplay>{this.copy()}</TextDisplay>
          </Section>
        </Container>
      </Message>
    );
  }
}
