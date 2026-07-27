import type { Meta, StoryObj } from "@storybook/react";

import { CurrencyInput } from "./currency-input";

const meta = {
  title: "Design System/Forms/CurrencyInput",
  component: CurrencyInput,
  tags: ["autodocs"],
} satisfies Meta<typeof CurrencyInput>;

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  args: {
        "label": "Price",
    "value": 185
  },
};
