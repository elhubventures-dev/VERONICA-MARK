import type { Meta, StoryObj } from "@storybook/react";

import { BannerBlock } from "./banner-block";

const meta = {
  title: "Design System/Cms/BannerBlock",
  component: BannerBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof BannerBlock>;

export default meta;
type Story = StoryObj<typeof BannerBlock>;

export const Default: Story = {
  args: {
        "title": "Complimentary shipping",
    "body": "On orders over €150 from participating brands.",
    "variant": "info"
  },
};
