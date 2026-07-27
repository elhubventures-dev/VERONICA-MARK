import type { Meta, StoryObj } from "@storybook/react";

import { FacetedFilter } from "./faceted-filter";

const meta = {
  title: "Design System/Search/FacetedFilter",
  component: FacetedFilter,
  tags: ["autodocs"],
} satisfies Meta<typeof FacetedFilter>;

export default meta;
type Story = StoryObj<typeof FacetedFilter>;

export const Default: Story = {
  args: {
        "title": "Brand",
    "options": [
        {
            "value": "atelier",
            "label": "Atelier Lumière",
            "count": 12
        }
    ],
    "selected": [],
    "onChange": () => undefined
  },
};
