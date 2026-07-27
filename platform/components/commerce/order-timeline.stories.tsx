import type { Meta, StoryObj } from "@storybook/react";

import { OrderTimeline } from "./order-timeline";

const meta = {
  title: "Design System/Commerce/OrderTimeline",
  component: OrderTimeline,
  tags: ["autodocs"],
} satisfies Meta<typeof OrderTimeline>;

export default meta;
type Story = StoryObj<typeof OrderTimeline>;

export const InTransit: Story = {
  args: {
    events: [
      {
        id: "1",
        title: "Order confirmed",
        description: "Your order has been received.",
        timestamp: "Jul 20, 2026 · 10:42",
        status: "complete",
      },
      {
        id: "2",
        title: "Prepared with care",
        description: "Items packed at our Paris atelier.",
        timestamp: "Jul 21, 2026 · 14:15",
        status: "complete",
      },
      {
        id: "3",
        title: "Shipped",
        description: "Tracking: VM-482910-EU",
        timestamp: "Jul 22, 2026 · 09:30",
        status: "current",
      },
      {
        id: "4",
        title: "Delivered",
        description: "Signature required upon delivery.",
        status: "upcoming",
      },
    ],
  },
};
