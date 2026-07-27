import type { Meta, StoryObj } from "@storybook/react";

import { NumberInput } from "./number-input";

const meta = {
  title: "Design System/Forms/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: {
        "value": 1,
    "onChange": () => undefined,
    "label": "Quantity"
  },
};
