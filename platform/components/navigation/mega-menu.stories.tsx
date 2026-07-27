import type { Meta, StoryObj } from "@storybook/react";

import { MegaMenu } from "./mega-menu";

const meta = {
  title: "Design System/Navigation/MegaMenu",
  component: MegaMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof MegaMenu>;

export default meta;
type Story = StoryObj<typeof MegaMenu>;

export const Default: Story = {
  args: {
    label: "Shop",
    columns: [
      {
        title: "Collections",
        links: [
          { label: "New Arrivals", href: "/shop/new" },
          { label: "Best Sellers", href: "/shop/bestsellers" },
          { label: "Limited Edition", href: "/shop/limited" },
        ],
      },
      {
        title: "Notes",
        links: [
          { label: "Oud", href: "/shop/oud" },
          { label: "Floral", href: "/shop/floral" },
          { label: "Citrus", href: "/shop/citrus" },
        ],
      },
      {
        title: "Format",
        links: [
          { label: "Eau de Parfum", href: "/shop/edp" },
          { label: "Extrait", href: "/shop/extrait" },
          { label: "Travel Size", href: "/shop/travel" },
        ],
      },
    ],
    featured: {
      title: "Maison Noir",
      description: "Smoky oud with velvet rose — the season's signature.",
      href: "/shop/maison-noir",
    },
  },
};
