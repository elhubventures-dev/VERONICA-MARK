import type { Meta, StoryObj } from "@storybook/react";

import { PhoneInput } from "./phone-input";

const meta = {
  title: "Design System/Forms/PhoneInput",
  component: PhoneInput,
  tags: ["autodocs"],
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  args: {
        "value": "7700900123"
  },
};
