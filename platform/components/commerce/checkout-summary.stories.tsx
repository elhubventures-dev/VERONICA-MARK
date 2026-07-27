import type { Meta, StoryObj } from "@storybook/react";

import { CheckoutSummary } from "./checkout-summary";

const meta = {
  title: "Design System/Commerce/CheckoutSummary",
  component: CheckoutSummary,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckoutSummary>;

export default meta;
type Story = StoryObj<typeof CheckoutSummary>;

export const Default: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Maison Noir Eau de Parfum",
        variant: "100ml EDP",
        imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
        imageAlt: "Maison Noir",
        price: 185,
        quantity: 1,
      },
    ],
    subtotal: 185,
    shipping: 0,
    tax: 37,
    total: 222,
  },
};
