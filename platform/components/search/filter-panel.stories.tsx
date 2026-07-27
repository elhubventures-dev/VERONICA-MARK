import type { Meta, StoryObj } from "@storybook/react";

import { FilterPanel } from "./filter-panel";

const meta = {
  title: "Design System/Search/FilterPanel",
  component: FilterPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof FilterPanel>;

export const Default: Story = {
  render: (args) => (
    <FilterPanel {...args}>
      <p className="text-sm text-[var(--color-muted-foreground)]">Filter groups go here</p>
    </FilterPanel>
  ),
  args: {
        "title": "Filters"
  },
};
