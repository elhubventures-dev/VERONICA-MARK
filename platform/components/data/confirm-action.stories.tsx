import type { Meta, StoryObj } from "@storybook/react";

import { ConfirmAction } from "./confirm-action";

const meta = {
  title: "Design System/Data/ConfirmAction",
  component: ConfirmAction,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmAction>;

export default meta;
type Story = StoryObj<typeof ConfirmAction>;

export const Default: Story = {
  args: {
        "triggerLabel": "Delete item",
    "title": "Delete this item?",
    "description": "This action cannot be undone.",
    "onConfirm": () => undefined,
    "variant": "destructive"
  },
};
