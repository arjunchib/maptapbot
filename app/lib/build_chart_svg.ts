import * as echarts from "echarts";
import { Score } from "../models/score";
import { Image as CanvasImage, createCanvas } from "@napi-rs/canvas";
import { Resvg } from "@resvg/resvg-js";
import type { SeriesOption } from "echarts";

function makeBadge(num: number | string, bgColor: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="${bgColor}" stroke="white" stroke-width="0"/><text x="16" y="16" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="bold">${num}</text></svg>`;

  const img = new CanvasImage();
  img.src = new Resvg(Buffer.from(svg), {
    fitTo: { mode: "width", value: 96 },
  })
    .render()
    .asPng();

  return img;
}

echarts.setPlatformAPI({
  createCanvas: () => createCanvas(800, 600) as any,
  loadImage(src, onload) {
    const img = makeBadge(...(src.split("-") as [number, string]));
    if (onload) queueMicrotask(() => onload.call(img as any));
    return img as any;
  },
});

class AverageScore {
  played_at!: string;
  score1!: number;
  score2!: number;
  score3!: number;
  score4!: number;
  score5!: number;
}

function getColor(id: string | number): string {
  const hash = Number(BigInt(Bun.hash(id.toString())) & 0xffffffffn);
  const hue = Math.abs(hash) % 360;

  // Keep saturation (70%) and lightness (55%) fixed so colors stay readable
  return `hsl(${hue}, 70%, 55%)`;
}

export function buildChart(scores: Score[]) {
  const canvas = createCanvas(400, 300);
  const chart = echarts.init(canvas, null, { devicePixelRatio: 3 });

  const range = [1, 2, 3, 4, 5] as const;

  chart.setOption({
    animation: false,
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    xAxis: {
      type: "category",
      jitter: 50,
      data: range.map((r) => `City ${r}`),
    },
    yAxis: {
      type: "value",
      name: "Scores",
      nameLocation: "middle",
      max: 100,
      min: 0,
    },
    series: scores.reverse().map(
      (s) =>
        ({
          name: s.author_id,
          type: "scatter",
          data: [
            [0, s.score1],
            [1, s.score2],
            [2, s.score3],
            [3, s.score4],
            [4, s.score5],
          ],
          // symbol: makeBadge(s.rank!, getRankColor(s.rank! - 1, scores.length)!),
          // symbol: (value, params) =>
          //   `image://${s.rank}-${getRankColor(s.rank! - 1, scores.length, DISTINCT_HUES[params.dataIndex]?.hue)}`,
          z: s.rank, // Lower drawing order
          label: {
            show: true,
            position: "inside",
            formatter: () => s.rank?.toString() || "0",
            color: "#e0e0e0",
            fontSize: 8,
          },
          symbolSize: 12,
          itemStyle: {
            opacity: 1,
          },
        }) satisfies SeriesOption,
    ),
  });

  const png = canvas.toBuffer("image/png");
  chart.dispose();
  return png;
}

const DISTINCT_HUES = [
  { name: "Crimson", hue: 350 },
  { name: "Rust", hue: 22 },
  { name: "Emerald", hue: 152 },
  { name: "Cobalt", hue: 215 },
  { name: "Indigo", hue: 260 },
];

function getRankColor(rank: number, maxRank = 10, hue = 250) {
  const clamped = Math.max(1, Math.min(maxRank, rank));
  const t = maxRank === 1 ? 1 : 1 - (clamped - 1) / (maxRank - 1);

  const lightness = 26 + t * 44; // Rank 1 = 70% -> maxRank = 26%
  const saturation = 70 + t * 25; // Rank 1 = 95% -> maxRank = 70%
  return `hsl(${hue}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
}
