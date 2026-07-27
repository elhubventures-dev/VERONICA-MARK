import type { Meta, StoryObj } from "@storybook/react";

import { AspectRatio } from "./aspect-ratio";

const meta: Meta = {
  title: "Design System/UI/AspectRatio",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl bg-[var(--color-muted)]">
        <div className="flex size-full items-center justify-center text-sm text-[var(--color-muted-foreground)]">
          16:9 media placeholder
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={1} className="overflow-hidden rounded-xl bg-[var(--color-muted)]">
        <div className="flex size-full items-center justify-center text-sm">1:1</div>
      </AspectRatio>
    </div>
  ),
};