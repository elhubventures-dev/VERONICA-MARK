import type { Meta, StoryObj } from "@storybook/react";

import { LineChart } from "./line-chart";

const sampleData = [
  { month: "Jan", revenue: 42000, orders: 312 },
  { month: "Feb", revenue: 48000, orders: 340 },
  { month: "Mar", revenue: 51000, orders: 365 },
  { month: "Apr", revenue: 47000, orders: 328 },
  { month: "May", revenue: 56000, orders: 402 },
  { month: "Jun", revenue: 61000, orders: 438 },
];

const meta = {
  title: "Design System/Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof LineChart>;

export const Default: Story = {
  args: {
    data: sampleData,
    xKey: "month",
    series: [{ dataKey: "revenue", name: "Revenue" }],
    title: "Revenue trend",
    description: "Last 6 months",
  },
};
