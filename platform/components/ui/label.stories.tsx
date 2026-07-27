import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "Design System/UI/Label",
  component: Label,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Brand name" } };

export const Required: Story = {
  render: () => (
    <Label>
      Brand name <span className="text-[var(--color-error)]">*</span>
    </Label>
  ),
};