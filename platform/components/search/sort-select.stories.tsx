import type { Meta, StoryObj } from "@storybook/react";

import { SortSelect } from "./sort-select";

const meta = {
  title: "Design System/Search/SortSelect",
  component: SortSelect,
  tags: ["autodocs"],
} satisfies Meta<typeof SortSelect>;

export default meta;
type Story = StoryObj<typeof SortSelect>;

export const Default: Story = {
  args: {
        "value": "newest",
    "options": [
        {
            "value": "newest",
            "label": "Newest"
        },
        {
            "value": "price-asc",
            "label": "Price: low to high"
        }
    ]
  },
};
