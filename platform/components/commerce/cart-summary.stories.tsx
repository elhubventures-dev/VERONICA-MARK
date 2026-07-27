import type { Meta, StoryObj } from "@storybook/react";

import { CartSummary } from "./cart-summary";

const meta = {
  title: "Design System/Commerce/CartSummary",
  component: CartSummary,
  tags: ["autodocs"],
} satisfies Meta<typeof CartSummary>;

export default meta;
type Story = StoryObj<typeof CartSummary>;

export const Default: Story = {
  args: {
    subtotal: 370,
    shipping: 0,
    shippingLabel: "Complimentary shipping",
    tax: 74,
    discount: 20,
    total: 424,
  },
};
