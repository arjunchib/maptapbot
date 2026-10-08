import { buildChart } from "../app/lib/build_chart";

await Bun.write("chart.png", buildChart());
