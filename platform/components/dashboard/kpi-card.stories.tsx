import { ShoppingBag } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react";

import { KpiCard } from "./kpi-card";

const meta = {
  title: "Design System/Dashboard/KpiCard",
  component: KpiCard,
  tags: ["autodocs"],
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: {
        "label": "Orders",
    "value": "1,284",
    "change": 12.4,
    "icon": ShoppingBag
  },
};
