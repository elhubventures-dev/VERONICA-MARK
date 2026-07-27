import type { Meta, StoryObj } from "@storybook/react";

import { AvatarUpload } from "./avatar-upload";

const meta = {
  title: "Design System/Media/AvatarUpload",
  component: AvatarUpload,
  tags: ["autodocs"],
} satisfies Meta<typeof AvatarUpload>;

export default meta;
type Story = StoryObj<typeof AvatarUpload>;

export const Default: Story = {
  args: {
        "alt": "Veronica Mark",
    "initials": "VM",
    "onUpload": () => undefined
  },
};
