import type { Meta, StoryObj } from "@storybook/react";

import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "Design System/UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="default" />
      <Spinner size="lg" />
    </div>
  ),
};