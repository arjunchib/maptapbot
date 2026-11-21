import * as echarts from "echarts";
import { Score } from "../models/score";
import type { SeriesOption } from "echarts";
import { createCanvas } from "canvas";

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
      name: "Points",
      nameLocation: "middle",
      max: 300,
      min: 0,
    },
    series: scores.map(
      (s) =>
        ({
          name: s.author_id,
          type: "scatter",
          data: [
            [0, s.score1],
            [1, s.score2],
            [2, s.score3 * 2],
            [3, s.score4 * 3],
            [4, s.score5 * 3],
          ],
          z: scores.length - s.rank, // Lower drawing order
          label: {
            show: true,
            position: "inside",
            formatter: () => s.rank.toString() || "0",
            color: "#e0e0e0",
            fontSize: 8,
          },
          // symbol: () => {
          //   switch (s.rank) {
          //     case 1:
          //       return "rectangle";
          //     // case 2:
          //     //   return "triangle";
          //     // case 3:
          //     //   return "diamond";
          //     default:
          //       return "circle";
          //   }
          // },
          symbolSize: 12,
          itemStyle: {
            opacity: 0.9,
            color: (params) =>
              getRankColor(
                s.rank,
                CALIBRATED_HUES[params.dataIndex]!,
                scores.length,
              ),
          },
        }) satisfies SeriesOption,
    ),
  });

  const png = canvas.toBuffer("image/png");
  chart.dispose();
  return png;
}

const CALIBRATED_HUES = [
  { name: "Crimson", hue: 350, maxL: 45 }, // Rich red-rose (5.2:1 contrast with white)
  { name: "Rust", hue: 18, maxL: 40 }, // Deep terracotta-orange (5.3:1 contrast with white)
  { name: "Forest", hue: 150, maxL: 34 }, // Deep emerald-pine (5.4:1 contrast with white)
  { name: "Cobalt", hue: 215, maxL: 45 }, // Rich ocean blue (5.8:1 contrast with white)
  { name: "Indigo", hue: 255, maxL: 52 }, // Vivid violet-indigo (6.2:1 contrast with white)
];

function getRankColor(
  rank: number,
  hueConfig: (typeof CALIBRATED_HUES)[number],
  maxRank = 10,
) {
  const { hue, maxL } = hueConfig;
  const minL = 18; // Still distinct from a dark (#121212 - #1e293b) canvas

  const clamped = Math.max(1, Math.min(maxRank, rank));
  const t = maxRank === 1 ? 1 : 1 - (clamped - 1) / (maxRank - 1);

  const lightness = minL + t * (maxL - minL);
  const saturation = 75 + t * 20; // 75% -> 95% keeps colors rich even at lower lightness

  return `hsl(${hue}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`;
}
