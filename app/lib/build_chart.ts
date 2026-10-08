import { createCanvas } from "canvas";
import * as echarts from "echarts";
import { dbReadonly } from "../../db/database";
import { getDailyAverages } from "../../app/sql";

class AverageScore {
  played_at!: string;
  score1!: number;
  score2!: number;
  score3!: number;
  score4!: number;
  score5!: number;
}

export function buildChart() {
  const canvas = createCanvas(400, 300);
  const chart = echarts.init(canvas, null, { devicePixelRatio: 3 });

  const averages = dbReadonly.query(getDailyAverages).as(AverageScore).all();

  const range = [1, 2, 3, 4, 5] as const;

  const series = range.map((i) => {
    return {
      name: `Score ${i}`,
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: averages.map((avg) => avg[`score${i}`]),
    };
  });

  chart.setOption({
    animation: false,
    xAxis: {
      data: averages.map((avg) => avg.played_at),
    },
    yAxis: {},
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    series,
  });

  const png = canvas.toBuffer("image/png");
  chart.dispose();
  return png;
}
