import type { Meta, StoryObj } from "@storybook/react";

import { NavLink } from "./nav-link";

const meta = {
  title: "Design System/Navigation/NavLink",
  component: NavLink,
  tags: ["autodocs"],
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof NavLink>;

export const Default: Story = {
  args: { href: "/shop", children: "Shop" },
};

export const Active: Story = {
  args: { href: "/shop", children: "Shop", active: true },
};

export const Sidebar: Story = {
  args: { href: "/account/orders", children: "Orders", variant: "sidebar", active: true },
};
