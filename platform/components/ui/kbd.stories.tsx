import type { Meta, StoryObj } from "@storybook/react";

import { Kbd } from "./kbd";

const meta: Meta<typeof Kbd> = {
  title: "Design System/UI/Kbd",
  component: Kbd,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Kbd>⌘</Kbd>,
};

export const Shortcut: Story = {
  render: () => (
    <p className="text-sm text-[var(--color-muted-foreground)]">
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open command palette
    </p>
  ),
};