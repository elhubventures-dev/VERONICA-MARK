import type { Meta, StoryObj } from "@storybook/react";

import { Stepper } from "./stepper";

const meta = {
  title: "Design System/Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof Stepper>;

const checkoutSteps = [
  { id: "bag", label: "Bag", status: "complete" as const },
  { id: "shipping", label: "Shipping", status: "current" as const, description: "Enter delivery details" },
  { id: "payment", label: "Payment", status: "upcoming" as const },
  { id: "review", label: "Review", status: "upcoming" as const },
];

export const Horizontal: Story = {
  args: { steps: checkoutSteps },
};

export const Vertical: Story = {
  args: { steps: checkoutSteps, orientation: "vertical" },
};
