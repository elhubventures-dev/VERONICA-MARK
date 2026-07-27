import type { Meta, StoryObj } from "@storybook/react";

import { PromoBanner } from "./promo-banner";

const meta = {
  title: "Design System/Cms/PromoBanner",
  component: PromoBanner,
  tags: ["autodocs"],
} satisfies Meta<typeof PromoBanner>;

export default meta;
type Story = StoryObj<typeof PromoBanner>;

export const Default: Story = {
  args: {
        "headline": "New brand launch",
    "description": "Atelier Lumière debuts Maison Noir",
    "ctaLabel": "Shop now",
    "ctaHref": "/shop/atelier-lumiere"
  },
};
