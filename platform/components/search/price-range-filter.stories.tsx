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
    min: 2_850,
    max: 240_000,
    value: [2_850, 240_000],
    onChange: () => undefined,
  },
};
