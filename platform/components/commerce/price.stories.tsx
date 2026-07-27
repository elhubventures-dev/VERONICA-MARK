import type { Meta, StoryObj } from "@storybook/react";

import { Price } from "./price";

const meta = {
  title: "Design System/Commerce/Price",
  component: Price,
  tags: ["autodocs"],
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof Price>;

export const Default: Story = {
  args: { amount: 185_000, currency: "NGN" },
};

export const OnSale: Story = {
  args: { amount: 149_000, compareAt: 185_000, currency: "NGN" },
};

export const FromPrice: Story = {
  args: { amount: 95_000, from: true, size: "lg", currency: "NGN" },
};

export const ShippingFee: Story = {
  args: { amount: 3500, currency: "NGN", taxInclusive: false },
};
