import type { Meta, StoryObj } from "@storybook/react";

import { TrafficWidget } from "./traffic-widget";

const meta = {
  title: "Design System/Dashboard/TrafficWidget",
  component: TrafficWidget,
  tags: ["autodocs"],
} satisfies Meta<typeof TrafficWidget>;

export default meta;
type Story = StoryObj<typeof TrafficWidget>;

export const Default: Story = {
  args: {
        "sources": [
        {
            "label": "Organic search",
            "sessions": 4200,
            "share": 42
        },
        {
            "label": "Direct",
            "sessions": 2800,
            "share": 28
        }
    ]
  },
};
