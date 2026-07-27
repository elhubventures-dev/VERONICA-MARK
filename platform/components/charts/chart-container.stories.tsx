import type { Meta, StoryObj } from "@storybook/react";

import { ChartContainer } from "./chart-container";

const meta = {
  title: "Design System/Charts/ChartContainer",
  component: ChartContainer,
  tags: ["autodocs"],
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof ChartContainer>;

export const Default: Story = {
  args: {
    title: "Brand revenue",
    description: "Monthly performance across managed brands",
    height: 200,
    children: (
      <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted-foreground)]">
        Chart slot
      </div>
    ),
  },
};
