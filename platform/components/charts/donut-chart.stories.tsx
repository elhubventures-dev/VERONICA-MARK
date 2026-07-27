import type { Meta, StoryObj } from "@storybook/react";

import { DonutChart } from "./donut-chart";

const meta = {
  title: "Design System/Charts/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof DonutChart>;

export const Default: Story = {
  args: {
    title: "Fulfillment status",
    centerValue: "94%",
    centerLabel: "On time",
    data: [
      { name: "Shipped", value: 72 },
      { name: "Processing", value: 18 },
      { name: "Delayed", value: 10 },
    ],
  },
};
