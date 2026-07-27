import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./label";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Design System/UI/Switch",
  component: Switch,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
};

export const Checked: Story = {
  args: { defaultChecked: true, "aria-label": "Dark mode" },
};