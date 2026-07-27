import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import { ButtonGroup } from "./button-group";

const meta: Meta<typeof ButtonGroup> = {
  title: "Design System/UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup aria-label="Alignment">
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="Actions">
      <Button variant="outline">Edit</Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="destructive">Delete</Button>
    </ButtonGroup>
  ),
};