import type { Meta, StoryObj } from "@storybook/react";

import { PriceRangeFilter } from "./price-range-filter";

const meta = {
  title: "Design System/Search/PriceRangeFilter",
  component: PriceRangeFilter,
  tags: ["autodocs"],
} satisfies Meta<typeof PriceRangeFilter>;

export default meta;
type Story = StoryObj<typeof PriceRangeFilter>;

export const Default: Story = {
  args: {
    min: 0,
    max: 500_000,
    value: [50_000, 200_000],
    onChange: () => undefined,
  },
};
