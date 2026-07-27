import type { Meta, StoryObj } from "@storybook/react";
import { Heart } from "lucide-react";

import { IconButton } from "./icon-button";

const meta: Meta<typeof IconButton> = {
  title: "Design System/UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Favorite", children: <Heart /> },
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <IconButton aria-label="Favorite" variant="ghost"><Heart /></IconButton>
      <IconButton aria-label="Favorite" variant="outline"><Heart /></IconButton>
      <IconButton aria-label="Favorite" variant="default"><Heart /></IconButton>
    </div>
  ),
};