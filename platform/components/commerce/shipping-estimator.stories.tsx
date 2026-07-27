import type { Meta, StoryObj } from "@storybook/react";

import { ShippingEstimator } from "./shipping-estimator";

const meta = {
  title: "Design System/Commerce/ShippingEstimator",
  component: ShippingEstimator,
  tags: ["autodocs"],
} satisfies Meta<typeof ShippingEstimator>;

export default meta;
type Story = StoryObj<typeof ShippingEstimator>;

export const Default: Story = {
  args: { onEstimate: () => undefined },
};

export const WithQuote: Story = {
  args: {
    quote: {
      cost: 0,
      method: "Complimentary Express",
      estimatedDelivery: "2–4 business days",
    },
  },
};
