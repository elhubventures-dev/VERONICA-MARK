import type { Meta, StoryObj } from "@storybook/react";

import { Container } from "./container";

const meta = {
  title: "Design System/Layout/Container",
  component: Container,
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: () => (
    <Container className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
      <p className="text-[var(--color-muted-foreground)]">
        Centered content within the VERONICA MARK max-width grid.
      </p>
    </Container>
  ),
};

export const Narrow: Story = {
  render: () => (
    <Container width="narrow" className="rounded-xl bg-[var(--color-muted)] p-6">
      <p className="font-display text-xl">Editorial narrow column</p>
    </Container>
  ),
};
