import type { Meta, StoryObj } from "@storybook/react";
import { Bold } from "lucide-react";

import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  title: "Design System/UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Toggle bold", children: <Bold /> },
};

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle bold">
      <Bold />
    </Toggle>
  ),
};