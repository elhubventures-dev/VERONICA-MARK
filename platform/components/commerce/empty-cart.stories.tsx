import type { Meta, StoryObj } from "@storybook/react";

import { EmptyCart } from "./empty-cart";

const meta = {
  title: "Design System/Commerce/EmptyCart",
  component: EmptyCart,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyCart>;

export default meta;
type Story = StoryObj<typeof EmptyCart>;

export const Default: Story = {};
