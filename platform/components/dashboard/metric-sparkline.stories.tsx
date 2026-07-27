import type { Meta, StoryObj } from "@storybook/react";

import { MetricSparkline } from "./metric-sparkline";

const meta = {
  title: "Design System/Dashboard/MetricSparkline",
  component: MetricSparkline,
  tags: ["autodocs"],
} satisfies Meta<typeof MetricSparkline>;

export default meta;
type Story = StoryObj<typeof MetricSparkline>;

export const Default: Story = {
  args: {
        "data": [
        12,
        18,
        14,
        22,
        28,
        24,
        32
    ]
  },
};
