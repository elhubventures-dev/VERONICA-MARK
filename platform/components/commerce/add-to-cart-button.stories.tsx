import type { Meta, StoryObj } from "@storybook/react";

import { AddToCartButton } from "./add-to-cart-button";

const meta = {
  title: "Design System/Commerce/AddToCartButton",
  component: AddToCartButton,
  tags: ["autodocs"],
} satisfies Meta<typeof AddToCartButton>;

export default meta;
type Story = StoryObj<typeof AddToCartButton>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const SoldOut: Story = {
  args: { soldOut: true },
};
