import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "Design System/UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="standard">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="standard" id="standard" />
        <Label htmlFor="standard">Standard shipping</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="express" id="express" />
        <Label htmlFor="express">Express shipping</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="standard" disabled>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="standard" id="d-standard" />
        <Label htmlFor="d-standard">Disabled option</Label>
      </div>
    </RadioGroup>
  ),
};