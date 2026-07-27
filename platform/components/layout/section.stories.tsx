import type { Meta, StoryObj } from "@storybook/react";

import { Container } from "./container";
import { Section } from "./section";

const meta = {
  title: "Design System/Layout/Section",
  component: Section,
  tags: ["autodocs"],
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  render: () => (
    <Section tone="muted" animate>
      <Container>
        <h2 className="font-display text-3xl">Curated for connoisseurs</h2>
        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Discover rare compositions from the world&apos;s finest maisons.
        </p>
      </Container>
    </Section>
  ),
};
