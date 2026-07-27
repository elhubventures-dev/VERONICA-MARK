import type { Meta, StoryObj } from "@storybook/react";

import { Dropzone } from "./dropzone";

const meta = {
  title: "Design System/Media/Dropzone",
  component: Dropzone,
  tags: ["autodocs"],
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
        "onFiles": () => undefined
  },
};
