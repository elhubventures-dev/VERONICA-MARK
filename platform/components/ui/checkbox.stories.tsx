import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta: Meta<typeof Checkbox> = {
  title: "Design System/UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Subscribed to updates</Label>
    </div>
  ),
};