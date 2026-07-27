import type { Meta, StoryObj } from "@storybook/react";

import { ThemeProvider } from "@/components/providers/theme-provider";

import { ThemeToggle } from "./theme-toggle";

const meta = {
  title: "Design System/Layout/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Compact: Story = {
  args: { compact: true },
};

export const WithLabel: Story = {
  args: { compact: false },
};
