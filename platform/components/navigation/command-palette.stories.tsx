import type { Meta, StoryObj } from "@storybook/react";

import { CommandPalette } from "./command-palette";

const meta = {
  title: "Design System/Navigation/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  args: {
    commands: [
      { id: "1", label: "Maison Noir EDP", description: "Product · 100ml", group: "Products" },
      { id: "2", label: "Velvet Rose Extrait", description: "Product · 50ml", group: "Products" },
      { id: "3", label: "Atelier Lumière", description: "Brand profile", group: "Brands" },
      { id: "4", label: "Gift Concierge", description: "Page", group: "Pages" },
    ],
  },
};
