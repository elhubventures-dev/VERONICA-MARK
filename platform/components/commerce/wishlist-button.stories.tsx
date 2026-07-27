import type { Meta, StoryObj } from "@storybook/react";

import { WishlistButton } from "./wishlist-button";

const meta = {
  title: "Design System/Commerce/WishlistButton",
  component: WishlistButton,
  tags: ["autodocs"],
} satisfies Meta<typeof WishlistButton>;

export default meta;
type Story = StoryObj<typeof WishlistButton>;

export const Default: Story = {
  args: { onToggle: () => undefined },
};

export const Active: Story = {
  args: { active: true, onToggle: () => undefined },
};
