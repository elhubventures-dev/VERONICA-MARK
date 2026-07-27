import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Design System/UI/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Continue" } };

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};