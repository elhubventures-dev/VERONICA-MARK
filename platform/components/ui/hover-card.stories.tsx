import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta: Meta = {
  title: "Design System/UI/HoverCard",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@veronicamark</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <p className="font-display font-semibold">Veronica Mark</p>
          <p className="text-sm text-[var(--color-muted-foreground)]">Luxury managed-brand marketplace.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const OpenDelay: Story = {
  render: () => (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="outline">Preview brand</Button>
      </HoverCardTrigger>
      <HoverCardContent>Quick brand preview card.</HoverCardContent>
    </HoverCard>
  ),
};