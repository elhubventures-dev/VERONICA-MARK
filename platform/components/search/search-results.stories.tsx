import type { Meta, StoryObj } from "@storybook/react";

import { SearchResults } from "./search-results";

const meta = {
  title: "Design System/Search/SearchResults",
  component: SearchResults,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchResults>;

export default meta;
type Story = StoryObj<typeof SearchResults>;

export const Default: Story = {
  args: {
        "query": "noir",
    "total": 1,
    "results": [
        {
            "id": "1",
            "title": "Maison Noir EDP",
            "brand": "Atelier Lumière",
            "href": "/shop/maison-noir",
            "price": "€185"
        }
    ]
  },
};
