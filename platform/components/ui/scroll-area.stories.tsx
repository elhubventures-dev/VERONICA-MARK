import type { Meta, StoryObj } from "@storybook/react";

import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

const meta: Meta = {
  title: "Design System/UI/ScrollArea",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const items = Array.from({ length: 20 }, (_, i) => `Brand item ${i + 1}`);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-xl border border-[var(--color-border)] p-4">
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item}>
            <p className="text-sm">{item}</p>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const TallContent: Story = {
  render: () => (
    <ScrollArea className="h-32 w-48 rounded-xl border border-[var(--color-border)] p-4">
      <p className="text-sm">Long scrollable content for compact panels and sidebars in admin views.</p>
    </ScrollArea>
  ),
};