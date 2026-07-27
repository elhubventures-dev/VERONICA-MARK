import type { Meta, StoryObj } from "@storybook/react";

import { ConversionFunnel } from "./conversion-funnel";

const meta = {
  title: "Design System/Dashboard/ConversionFunnel",
  component: ConversionFunnel,
  tags: ["autodocs"],
} satisfies Meta<typeof ConversionFunnel>;

export default meta;
type Story = StoryObj<typeof ConversionFunnel>;

export const Default: Story = {
  args: {
        "steps": [
        {
            "label": "Visits",
            "value": 12000
        },
        {
            "label": "Add to bag",
            "value": 3200,
            "total": 12000
        },
        {
            "label": "Checkout",
            "value": 890,
            "total": 3200
        }
    ]
  },
};
