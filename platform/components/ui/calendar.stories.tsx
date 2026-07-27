import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "Design System/UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function CalendarDefault() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} />;
  },
};

export const Range: Story = {
  render: () => <Calendar mode="range" />,
};