import type { Meta, StoryObj } from "@storybook/react";

import { MediaBlock } from "./media-block";

const meta = {
  title: "Design System/Cms/MediaBlock",
  component: MediaBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof MediaBlock>;

export default meta;
type Story = StoryObj<typeof MediaBlock>;

export const Default: Story = {
  args: {
        "src": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=960&h=400&fit=crop",
    "alt": "Fragrance editorial",
    "caption": "Maison Noir campaign imagery"
  },
};
