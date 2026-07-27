import type { Meta, StoryObj } from "@storybook/react";

import { MediaGallery } from "./media-gallery";

const meta = {
  title: "Design System/Media/MediaGallery",
  component: MediaGallery,
  tags: ["autodocs"],
} satisfies Meta<typeof MediaGallery>;

export default meta;
type Story = StoryObj<typeof MediaGallery>;

export const Default: Story = {
  args: {
        "items": [
        {
            "id": "1",
            "src": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
            "alt": "Product shot"
        }
    ]
  },
};
