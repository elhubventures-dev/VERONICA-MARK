import type { Meta, StoryObj } from "@storybook/react";

import { OrderStatusBadge } from "./order-status-badge";

const meta = {
  title: "Design System/Commerce/OrderStatusBadge",
  component: OrderStatusBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof OrderStatusBadge>;

export default meta;
type Story = StoryObj<typeof OrderStatusBadge>;

export const Default: Story = {
  args: { status: "processing" },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <OrderStatusBadge status="pending" />
      <OrderStatusBadge status="confirmed" />
      <OrderStatusBadge status="paid" />
      <OrderStatusBadge status="processing" />
      <OrderStatusBadge status="packed" />
      <OrderStatusBadge status="shipped" />
      <OrderStatusBadge status="out_for_delivery" />
      <OrderStatusBadge status="delivered" />
      <OrderStatusBadge status="completed" />
      <OrderStatusBadge status="cancelled" />
      <OrderStatusBadge status="refund_requested" />
      <OrderStatusBadge status="refunded" />
    </div>
  ),
};
