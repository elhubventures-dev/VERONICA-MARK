import type { Meta, StoryObj } from "@storybook/react";

import { StatWidget } from "./stat-widget";

const meta = {
  title: "Design System/Dashboard/StatWidget",
  component: StatWidget,
  tags: ["autodocs"],
} satisfies Meta<typeof StatWidget>;

export default meta;
type Story = StoryObj<typeof StatWidget>;

export const Default: Story = {
  args: {
        "label": "Avg. order value",
    "value": "₦213,000",
    "hint": "Across all brands"
  },
};
