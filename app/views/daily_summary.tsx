import { Container, Message, Section, TextDisplay, Thumbnail } from "mango";
import { Score } from "../models/score";
import { AttachmentBuilder } from "discord.js";
import { buildChart } from "../lib/build_chart";
import { dbReadonly } from "../../db/database";
import { getAvgScoresByDay, getScoreByDay } from "../sql";

class AvgScores {
  [key: string]: number;
}

export class DailySummary {
  constructor(private props: { date: Temporal.PlainDate }) {}

  render() {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(this.props.date);

    const avgScores = dbReadonly
      .query(getAvgScoresByDay)
      .as(AvgScores)
      .get({ played_at: this.props.date.toString() });
    const avgScoresCopy = Object.entries(avgScores || {})
      .map(([label, value]) => `${label} ${value.toFixed(1)}`)
      .join(" ");

    const scores = dbReadonly
      .query(getScoreByDay)
      .as(Score)
      .all({ played_at: this.props.date.toString() });

    const leaderboard = scores
      .sort((a, b) => b.final_score - a.final_score)
      .map(
        (s, i) =>
          `${i + 1}. ${s.final_score} • ${s.gold} • ${s.silver} • ${s.bronze} • <@${s.author_id}>`,
      )
      .join("\n");

    const filename = `chart-${this.props.date}.png`;
    const ab = new AttachmentBuilder(buildChart(), { name: filename });

    const copy = `# ${formattedDate}
### Scores 🥇🥈🥉
${leaderboard}
### Average
${avgScoresCopy}
`;

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
            <TextDisplay>{copy}</TextDisplay>
          </Section>
          {/* <MediaGallery>
            <MediaGalleryItem
              media={{ url: `attachment://${filename}` }}
            ></MediaGalleryItem>
          </MediaGallery> */}
        </Container>
      </Message>
    );
  }
}
