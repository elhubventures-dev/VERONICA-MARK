import type { Meta, StoryObj } from "@storybook/react";

import { RichText } from "./rich-text";

const meta = {
  title: "Design System/Cms/RichText",
  component: RichText,
  tags: ["autodocs"],
} satisfies Meta<typeof RichText>;

export default meta;
type Story = StoryObj<typeof RichText>;

export const Default: Story = {
  args: {
        "html": "<h2>Our story</h2><p>VERONICA MARK partners with the world's finest fragrance brands.</p>"
  },
};
