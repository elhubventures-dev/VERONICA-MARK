import type { Meta, StoryObj } from "@storybook/react";

import { AnalyticsCard } from "./analytics-card";

const meta = {
  title: "Design System/Dashboard/AnalyticsCard",
  component: AnalyticsCard,
  tags: ["autodocs"],
} satisfies Meta<typeof AnalyticsCard>;

export default meta;
type Story = StoryObj<typeof AnalyticsCard>;

export const Default: Story = {
  args: {
    title: "Brand engagement",
    description: "Weekly metrics across storefronts",
    children: (
      <p className="text-sm text-[var(--color-muted-foreground)]">Sample analytics content</p>
    ),
  },
};
