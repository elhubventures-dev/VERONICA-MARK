import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/ui/badge";

import { Navbar } from "./navbar";

const meta = {
  title: "Design System/Navigation/Navbar",
  component: Navbar,
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof Navbar>;

const items = [
  { label: "Shop", href: "/shop" },
  { label: "Maison", href: "/maison", matchSubpaths: true },
  { label: "Journal", href: "/journal" },
  { label: "Gift Concierge", href: "/gifts" },
];

export const Default: Story = {
  args: {
    items,
    trailing: (
      <Badge variant="accent" className="hidden xl:inline-flex">
        New Season
      </Badge>
    ),
  },
};
