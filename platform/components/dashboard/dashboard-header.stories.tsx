import type { Meta, StoryObj } from "@storybook/react";

import { DashboardHeader } from "./dashboard-header";

const meta = {
  title: "Design System/Dashboard/DashboardHeader",
  component: DashboardHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardHeader>;

export default meta;
type Story = StoryObj<typeof DashboardHeader>;

export const Default: Story = {
  args: {
        "title": "Brand dashboard",
    "subtitle": "Performance overview for managed brands"
  },
};
