import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from "@/components/layout/stack";

import { PaymentMethodCard } from "./payment-method-card";

const meta = {
  title: "Design System/Commerce/PaymentMethodCard",
  component: PaymentMethodCard,
  tags: ["autodocs"],
} satisfies Meta<typeof PaymentMethodCard>;

export default meta;
type Story = StoryObj<typeof PaymentMethodCard>;

export const Selected: Story = {
  args: {
    brand: "Visa",
    last4: "4242",
    expiry: "09/28",
    selected: true,
    isDefault: true,
  },
};

export const Group: Story = {
  render: () => (
    <Stack gap="sm">
      <PaymentMethodCard brand="Visa" last4="4242" expiry="09/28" selected isDefault />
      <PaymentMethodCard brand="Amex" last4="1005" expiry="03/27" />
    </Stack>
  ),
};
