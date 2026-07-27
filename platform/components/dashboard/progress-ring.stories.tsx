import type { Meta, StoryObj } from "@storybook/react";

import { ProgressRing } from "./progress-ring";

const meta = {
  title: "Design System/Dashboard/ProgressRing",
  component: ProgressRing,
  tags: ["autodocs"],
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof ProgressRing>;

export const Default: Story = {
  args: {
        "value": 72,
    "label": "Monthly goal"
  },
};
