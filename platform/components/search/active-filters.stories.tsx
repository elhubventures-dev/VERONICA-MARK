import type { Meta, StoryObj } from "@storybook/react";

import { ActiveFilters } from "./active-filters";

const meta = {
  title: "Design System/Search/ActiveFilters",
  component: ActiveFilters,
  tags: ["autodocs"],
} satisfies Meta<typeof ActiveFilters>;

export default meta;
type Story = StoryObj<typeof ActiveFilters>;

export const Default: Story = {
  args: {
        "filters": [
        {
            "id": "1",
            "label": "Brand: Atelier Lumière"
        }
    ],
    "onRemove": () => undefined,
    "onClearAll": () => undefined
  },
};
