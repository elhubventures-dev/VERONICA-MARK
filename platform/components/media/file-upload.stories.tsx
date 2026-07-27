import type { Meta, StoryObj } from "@storybook/react";

import { FileUpload } from "./file-upload";

const meta = {
  title: "Design System/Media/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
        "label": "Brand asset"
  },
};
