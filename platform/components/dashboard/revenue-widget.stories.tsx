import type { Meta, StoryObj } from "@storybook/react";

import { RevenueWidget } from "./revenue-widget";

const meta = {
  title: "Design System/Dashboard/RevenueWidget",
  component: RevenueWidget,
  tags: ["autodocs"],
} satisfies Meta<typeof RevenueWidget>;

export default meta;
type Story = StoryObj<typeof RevenueWidget>;

export const Default: Story = {
  args: {
        "amount": "₦72,435,000",
    "change": 8.2
  },
};
