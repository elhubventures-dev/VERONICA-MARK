import type { Meta, StoryObj } from "@storybook/react";

import { ChartWidget } from "./chart-widget";

const meta = {
  title: "Design System/Dashboard/ChartWidget",
  component: ChartWidget,
  tags: ["autodocs"],
} satisfies Meta<typeof ChartWidget>;

export default meta;
type Story = StoryObj<typeof ChartWidget>;

export const Default: Story = {
  args: {
        "data": [
        {
            "month": "Jan",
            "revenue": 4200
        },
        {
            "month": "Feb",
            "revenue": 5100
        }
    ],
    "xKey": "month",
    "seriesKey": "revenue",
    "seriesName": "Revenue"
  },
};
