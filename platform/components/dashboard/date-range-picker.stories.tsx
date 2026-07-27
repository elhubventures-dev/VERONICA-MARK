import type { Meta, StoryObj } from "@storybook/react";

import { DateRangePicker } from "./date-range-picker";

const meta = {
  title: "Design System/Dashboard/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  args: {
    
  },
};
