import type { Meta, StoryObj } from "@storybook/react";

import { PasswordInput } from "./password-input";

const meta = {
  title: "Design System/Forms/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
        "label": "Password",
    "value": ""
  },
};
