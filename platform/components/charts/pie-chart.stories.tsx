import type { Meta, StoryObj } from "@storybook/react";

import { PieChart } from "./pie-chart";

const meta = {
  title: "Design System/Charts/PieChart",
  component: PieChart,
  tags: ["autodocs"],
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
  args: {
    title: "Channel mix",
    description: "Order attribution by source",
    data: [
      { name: "Direct", value: 42 },
      { name: "Organic", value: 28 },
      { name: "Paid", value: 18 },
      { name: "Email", value: 12 },
    ],
  },
};
