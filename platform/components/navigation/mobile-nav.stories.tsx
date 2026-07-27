import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

import { MobileNav } from "./mobile-nav";

const meta = {
  title: "Design System/Navigation/MobileNav",
  component: MobileNav,
  tags: ["autodocs"],
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof MobileNav>;

export const Default: Story = {
  args: {
    items: [
      { label: "Shop", href: "/shop" },
      { label: "Maison", href: "/maison" },
      { label: "Journal", href: "/journal" },
      { label: "Account", href: "/account" },
    ],
    footer: <Button className="w-full">Sign In</Button>,
  },
};
