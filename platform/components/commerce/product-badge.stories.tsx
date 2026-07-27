import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from "@/components/layout/stack";

import { ProductBadge } from "./product-badge";

const meta = {
  title: "Design System/Commerce/ProductBadge",
  component: ProductBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductBadge>;

export default meta;
type Story = StoryObj<typeof ProductBadge>;

export const Variants: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap>
      <ProductBadge variant="new" />
      <ProductBadge variant="limited" />
      <ProductBadge variant="bestseller" />
      <ProductBadge variant="exclusive" />
      <ProductBadge variant="back-in-stock" />
      <ProductBadge variant="sold-out" />
    </Stack>
  ),
};
