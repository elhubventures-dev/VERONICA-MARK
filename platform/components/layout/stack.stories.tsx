import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from "./stack";

const meta = {
  title: "Design System/Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  render: () => (
    <Stack gap="md">
      <div className="rounded-xl bg-[var(--color-primary)] p-4 text-white">Maison Noir</div>
      <div className="rounded-xl bg-[var(--color-accent)] p-4">Velvet Rose</div>
      <div className="rounded-xl bg-[var(--color-muted)] p-4">Citrus Atelier</div>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" wrap>
      {["New", "Oud", "Floral", "Gift Sets"].map((tag) => (
        <span
          key={tag}
          className="rounded-xl border border-[var(--color-border)] px-3 py-1 text-sm"
        >
          {tag}
        </span>
      ))}
    </Stack>
  ),
};
