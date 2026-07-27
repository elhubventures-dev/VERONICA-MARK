import type { Meta, StoryObj } from "@storybook/react";

import { HeroBlock } from "./hero-block";

const meta = {
  title: "Design System/Cms/HeroBlock",
  component: HeroBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof HeroBlock>;

export default meta;
type Story = StoryObj<typeof HeroBlock>;

export const Default: Story = {
  args: {
        "title": "Discover luxury fragrance",
    "subtitle": "Curated brands for discerning collectors",
    "ctaLabel": "Explore collection",
    "ctaHref": "/shop",
    "imageSrc": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=500&fit=crop",
    "imageAlt": "Luxury fragrance hero"
  },
};
