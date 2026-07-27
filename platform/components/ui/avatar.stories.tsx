import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Design System/UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
      <AvatarFallback>VM</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>VM</AvatarFallback>
    </Avatar>
  ),
};