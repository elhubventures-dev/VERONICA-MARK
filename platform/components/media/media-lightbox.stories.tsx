import type { Meta, StoryObj } from "@storybook/react";

import { MediaLightbox } from "./media-lightbox";

const meta = {
  title: "Design System/Media/MediaLightbox",
  component: MediaLightbox,
  tags: ["autodocs"],
} satisfies Meta<typeof MediaLightbox>;

export default meta;
type Story = StoryObj<typeof MediaLightbox>;

export const Default: Story = {
  args: {
        "open": true,
    "onOpenChange": () => undefined,
    "src": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&h=800&fit=crop",
    "alt": "Full size product",
    "caption": "Maison Noir"
  },
};
