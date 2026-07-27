import type { Meta, StoryObj } from "@storybook/react";

import { ProductGallery } from "./product-gallery";

const meta = {
  title: "Design System/Commerce/ProductGallery",
  component: ProductGallery,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductGallery>;

export default meta;
type Story = StoryObj<typeof ProductGallery>;

const images = [
  {
    src: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=1000&fit=crop",
    alt: "Front view of fragrance bottle",
  },
  {
    src: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=1000&fit=crop",
    alt: "Detail of bottle cap",
  },
  {
    src: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&h=1000&fit=crop",
    alt: "Packaging box",
  },
];

export const Default: Story = {
  args: { images },
};
