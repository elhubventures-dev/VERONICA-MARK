import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import { Toaster, toast } from "./sonner";

const meta: Meta = {
  title: "Design System/UI/Sonner",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <>
      <Button onClick={() => toast("Settings saved")}>Show toast</Button>
      <Toaster />
    </>
  ),
};

export const Success: Story = {
  render: () => (
    <>
      <Button onClick={() => toast.success("Brand published successfully")}>Success toast</Button>
      <Toaster />
    </>
  ),
};