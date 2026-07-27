import type { Meta, StoryObj } from "@storybook/react";

import { ResponsiveGrid } from "./responsive-grid";

const meta = {
  title: "Design System/Layout/ResponsiveGrid",
  component: ResponsiveGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof ResponsiveGrid>;

export default meta;
type Story = StoryObj<typeof ResponsiveGrid>;

export const ProductTiles: Story = {
  render: () => (
    <ResponsiveGrid minColumnWidth="sm">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          Product {i + 1}
        </div>
      ))}
    </ResponsiveGrid>
  ),
};
