import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./label";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Design System/UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-md gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Write your message..." rows={4} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled textarea" },
};