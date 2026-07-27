import type { Meta, StoryObj } from "@storybook/react";

import { Container } from "@/components/layout/container";
import { ThemeProvider } from "@/components/providers/theme-provider";

import { AppShell } from "./app-shell";

const meta = {
  title: "Design System/Layout/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  render: () => (
    <AppShell>
      <Container className="py-16">
        <h1 className="font-display text-4xl">Curated luxury fragrance</h1>
        <p className="mt-4 text-[var(--color-muted-foreground)]">
          App shell with header, main content, and footer.
        </p>
      </Container>
    </AppShell>
  ),
};
