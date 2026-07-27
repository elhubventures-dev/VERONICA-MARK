import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta: Meta = {
  title: "Design System/UI/Popover",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">Manage brand settings and marketplace visibility.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignedStart: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Aligned start</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <p className="text-sm">Popover aligned to start edge.</p>
      </PopoverContent>
    </Popover>
  ),
};