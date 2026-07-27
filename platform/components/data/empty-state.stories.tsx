import type { Meta, StoryObj } from "@storybook/react";

import { EmptyState } from "./empty-state";

const meta = {
  title: "Design System/Data/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
        "title": "No orders yet",
    "description": "When you place an order, it will appear here.",
    "actionLabel": "Browse brands",
    "onAction": () => undefined
  },
};
