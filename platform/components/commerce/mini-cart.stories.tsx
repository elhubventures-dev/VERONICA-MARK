import type { Meta, StoryObj } from "@storybook/react";

import { MiniCart } from "./mini-cart";

const meta = {
  title: "Design System/Commerce/MiniCart",
  component: MiniCart,
  tags: ["autodocs"],
} satisfies Meta<typeof MiniCart>;

export default meta;
type Story = StoryObj<typeof MiniCart>;

export const WithItems: Story = {
  args: {
    itemCount: 2,
    subtotal: 370,
    total: 370,
    items: [
      {
        id: "1",
        title: "Maison Noir Eau de Parfum",
        brand: "Atelier Lumière",
        variant: "100ml",
        imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
        imageAlt: "Maison Noir",
        price: 185,
        quantity: 2,
      },
    ],
  },
};

export const Empty: Story = {
  args: { itemCount: 0 },
};
