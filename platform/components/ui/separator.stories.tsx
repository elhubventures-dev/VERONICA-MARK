import type { Meta, StoryObj } from "@storybook/react";

import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Design System/UI/Separator",
  component: Separator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <p>Section one</p>
      <Separator />
      <p>Section two</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-11 items-center gap-4">
      <span>Home</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  ),
};