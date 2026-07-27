import type { Meta, StoryObj } from "@storybook/react";

import { Fieldset } from "./fieldset";

const meta = {
  title: "Design System/Forms/Fieldset",
  component: Fieldset,
  tags: ["autodocs"],
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Default: Story = {
  args: {
    legend: "Delivery options",
    description: "Choose how you'd like to receive your order",
    children: (
      <p className="text-sm text-[var(--color-muted-foreground)]">Grouped inputs go here</p>
    ),
  },
};
