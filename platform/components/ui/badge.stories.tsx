import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Design System/UI/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "New" } };

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </div>
  ),
};