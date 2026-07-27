import type { Meta, StoryObj } from "@storybook/react";

import { Grid } from "./grid";

const meta = {
  title: "Design System/Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof Grid>;

export const ThreeColumn: Story = {
  render: () => (
    <Grid columns={3} gap="md">
      {["Eau de Parfum", "Extrait", "Discovery Set"].map((item) => (
        <div
          key={item}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
        >
          {item}
        </div>
      ))}
    </Grid>
  ),
};
