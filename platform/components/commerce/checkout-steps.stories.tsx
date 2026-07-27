import type { Meta, StoryObj } from "@storybook/react";

import { CheckoutSteps } from "./checkout-steps";

const meta = {
  title: "Design System/Commerce/CheckoutSteps",
  component: CheckoutSteps,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckoutSteps>;

export default meta;
type Story = StoryObj<typeof CheckoutSteps>;

export const Shipping: Story = {
  args: { current: "shipping" },
};

export const Payment: Story = {
  args: { current: "payment", orientation: "vertical" },
};
