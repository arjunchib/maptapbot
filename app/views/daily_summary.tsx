import { Container, Message, TextDisplay } from "mango";
import type { Score } from "../models/score";

export class DailySummary {
  constructor(private props: { scores: Score[]; date: Temporal.PlainDate }) {}

  render() {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(this.props.date);
    const leaderboard = this.props.scores
      .sort((a, b) => b.total - a.total)
      .map((s, i) => `${i + 1}. <@${s.author_id}> ${s.total}`)
      .join("\n");
    return (
      <Message allowedMentions={{ parse: [] }}>
        <Container>
          <TextDisplay>
            # {formattedDate} Summary
            {"\n"}
            {leaderboard}
          </TextDisplay>
        </Container>
      </Message>
    );
  }
}
