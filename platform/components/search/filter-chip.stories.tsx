import type { Meta, StoryObj } from "@storybook/react";

import { FilterChip } from "./filter-chip";

const meta = {
  title: "Design System/Search/FilterChip",
  component: FilterChip,
  tags: ["autodocs"],
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
  args: {
        "label": "Eau de Parfum",
    "onRemove": () => undefined
  },
};
