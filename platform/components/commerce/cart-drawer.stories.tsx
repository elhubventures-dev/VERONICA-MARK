import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { CartDrawer } from "./cart-drawer";

const meta = {
  title: "Design System/Commerce/CartDrawer",
  component: CartDrawer,
  tags: ["autodocs"],
} satisfies Meta<typeof CartDrawer>;

export default meta;
type Story = StoryObj<typeof CartDrawer>;

const sampleItems = [
  {
    id: "1",
    title: "Maison Noir Eau de Parfum",
    brand: "Atelier Lumière",
    variant: "100ml EDP",
    imageSrc: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
    imageAlt: "Maison Noir",
    price: 185,
    quantity: 1,
  },
];

export const WithItems: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Bag</Button>
        <CartDrawer
          open={open}
          onOpenChange={setOpen}
          items={sampleItems}
          subtotal={185}
          total={185}
        />
      </>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <CartDrawer open={open} onOpenChange={setOpen} items={[]} subtotal={0} total={0} />
    );
  },
};
