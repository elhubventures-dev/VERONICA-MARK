import type { Meta, StoryObj } from "@storybook/react";

import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Design System/UI/Progress",
  component: Progress,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Progress value={66} className="w-[300px]" />,
};

export const Empty: Story = {
  render: () => <Progress value={0} className="w-[300px]" />,
};