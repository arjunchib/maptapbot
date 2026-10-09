import {
  Container,
  MediaGallery,
  MediaGalleryItem,
  Message,
  TextDisplay,
} from "mango";
import type { Score } from "../models/score";
import { AttachmentBuilder } from "discord.js";
import { buildChart } from "../lib/build_chart";

export class DailySummary {
  constructor(private props: { scores: Score[]; date: Temporal.PlainDate }) {}

  render() {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(this.props.date);
    const leaderboard = this.props.scores
      .sort((a, b) => b.final_score - a.final_score)
      .map(
        (s, i) =>
          `${i + 1}. ${s.final_score} • ${s.gold} • ${s.silver} • ${s.bronze} • <@${s.author_id}>`,
      )
      .join("\n");
    const filename = `chart-${this.props.date}.png`;
    const ab = new AttachmentBuilder(buildChart(), { name: filename });
    return (
      <Message allowedMentions={{ parse: [] }} files={[ab]}>
        <Container>
          <TextDisplay>
            # {formattedDate} Results 🥇🥈🥉
            {"\n"}
            {leaderboard}
          </TextDisplay>
          <MediaGallery>
            <MediaGalleryItem
              media={{ url: `attachment://${filename}` }}
            ></MediaGalleryItem>
          </MediaGallery>
        </Container>
      </Message>
    );
  }
}
