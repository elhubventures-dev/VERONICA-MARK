import type { Meta, StoryObj } from "@storybook/react";

import { ProfileHeader } from "./profile-header";

const meta = {
  title: "Design System/Profile/ProfileHeader",
  component: ProfileHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileHeader>;

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

export const Default: Story = {
  args: {
        "name": "Veronica Mark",
    "email": "veronica@example.com",
    "initials": "VM",
    "memberSince": "2024",
    "tier": "Maison"
  },
};
