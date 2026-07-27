import type { Meta, StoryObj } from "@storybook/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta = {
  title: "Design System/UI/Select",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Select defaultValue="purple">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="purple">Royal Purple</SelectItem>
        <SelectItem value="gold">Accent Gold</SelectItem>
        <SelectItem value="cream">Secondary Cream</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
      </SelectContent>
    </Select>
  ),
};