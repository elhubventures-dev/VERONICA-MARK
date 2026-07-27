import type { Meta, StoryObj } from "@storybook/react";

import { ImageThumbnail } from "./image-thumbnail";

const meta = {
  title: "Design System/Media/ImageThumbnail",
  component: ImageThumbnail,
  tags: ["autodocs"],
} satisfies Meta<typeof ImageThumbnail>;

export default meta;
type Story = StoryObj<typeof ImageThumbnail>;

export const Default: Story = {
  args: {
        "src": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    "alt": "Thumbnail",
    "onClick": () => undefined
  },
};
