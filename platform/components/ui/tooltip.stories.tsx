import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta: Meta = {
  title: "Design System/UI/Tooltip",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Luxury brand insights</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost">Delayed tooltip</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Appears after 300ms</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};