import type { Meta, StoryObj } from "@storybook/react";

import { ProductCard } from "./product-card";

const meta = {
  title: "Design System/Commerce/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    href: "/shop/maison-noir-edp",
    title: "Maison Noir Eau de Parfum",
    brand: "Atelier Lumière",
    price: 185,
    compareAt: 210,
    imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
    imageAlt: "Maison Noir fragrance bottle",
    badge: "new",
    onAddToWishlist: () => undefined,
  },
};
