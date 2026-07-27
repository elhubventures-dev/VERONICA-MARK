import type { Meta, StoryObj } from "@storybook/react";

import { AreaChart } from "./area-chart";

const sampleData = [
  { week: "W1", visits: 8200, conversions: 410 },
  { week: "W2", visits: 9100, conversions: 455 },
  { week: "W3", visits: 8800, conversions: 430 },
  { week: "W4", visits: 10200, conversions: 520 },
];

const meta = {
  title: "Design System/Charts/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof AreaChart>;

export const Default: Story = {
  args: {
    data: sampleData,
    xKey: "week",
    series: [{ dataKey: "visits", name: "Visits" }],
    title: "Store visits",
    description: "Weekly traffic volume",
  },
};
