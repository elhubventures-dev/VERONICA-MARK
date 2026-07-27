/**
 * Lazy-loaded storefront chart/widgets can import through this barrel
 * to avoid bundling Recharts on first paint of marketing pages.
 */
export { LineChart } from "@/components/charts/line-chart";
export { DonutChart } from "@/components/charts/donut-chart";
export { BarChart } from "@/components/charts/bar-chart";
