import type { Meta, StoryObj } from "@storybook/react";

import { ErrorState } from "./error-state";

const meta = {
  title: "Design System/Data/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
        "onRetry": () => undefined
  },
};
