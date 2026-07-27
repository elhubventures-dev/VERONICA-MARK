import type { Meta, StoryObj } from "@storybook/react";

import { OrderCard } from "./order-card";

const meta = {
  title: "Design System/Commerce/OrderCard",
  component: OrderCard,
  tags: ["autodocs"],
} satisfies Meta<typeof OrderCard>;

export default meta;
type Story = StoryObj<typeof OrderCard>;

export const Default: Story = {
  args: {
    orderNumber: "VM-10482",
    placedAt: "Jul 20, 2026",
    status: "shipped",
    itemCount: 2,
    total: 370,
    href: "/account/orders/vm-10482",
    previews: [
      {
        imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&h=100&fit=crop",
        imageAlt: "Maison Noir",
      },
    ],
  },
};
