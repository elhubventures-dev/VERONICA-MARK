import type { Meta, StoryObj } from "@storybook/react";

import { CartItem } from "./cart-item";

const meta = {
  title: "Design System/Commerce/CartItem",
  component: CartItem,
  tags: ["autodocs"],
} satisfies Meta<typeof CartItem>;

export default meta;
type Story = StoryObj<typeof CartItem>;

export const Default: Story = {
  args: {
    id: "1",
    title: "Maison Noir Eau de Parfum",
    brand: "Atelier Lumière",
    variant: "100ml EDP",
    imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
    imageAlt: "Maison Noir bottle",
    price: 185,
    quantity: 1,
    onQuantityChange: () => undefined,
    onRemove: () => undefined,
  },
};
