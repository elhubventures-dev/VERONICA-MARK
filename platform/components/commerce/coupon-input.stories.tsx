import type { Meta, StoryObj } from "@storybook/react";

import { CouponInput } from "./coupon-input";

const meta = {
  title: "Design System/Commerce/CouponInput",
  component: CouponInput,
  tags: ["autodocs"],
} satisfies Meta<typeof CouponInput>;

export default meta;
type Story = StoryObj<typeof CouponInput>;

export const Default: Story = {
  args: { onApply: () => undefined },
};

export const Applied: Story = {
  args: { appliedCode: "LUMIERE20", onRemove: () => undefined },
};

export const Error: Story = {
  args: { value: "INVALID", error: "This code is not valid or has expired.", onApply: () => undefined },
};
