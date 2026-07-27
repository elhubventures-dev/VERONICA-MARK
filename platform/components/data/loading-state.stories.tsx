import type { Meta, StoryObj } from "@storybook/react";

import { LoadingState } from "./loading-state";

const meta = {
  title: "Design System/Data/LoadingState",
  component: LoadingState,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {
  args: {
    
  },
};
