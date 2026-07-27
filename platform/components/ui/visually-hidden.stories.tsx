import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import { VisuallyHidden } from "./visually-hidden";

const meta: Meta = {
  title: "Design System/UI/VisuallyHidden",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Button variant="outline">
      <VisuallyHidden>Close dialog</VisuallyHidden>
      ×
    </Button>
  ),
};

export const WithVisibleLabel: Story = {
  render: () => (
    <button className="rounded-xl border border-[var(--color-border)] px-4 py-2">
      Save
      <VisuallyHidden> — saves your brand settings</VisuallyHidden>
    </button>
  ),
};