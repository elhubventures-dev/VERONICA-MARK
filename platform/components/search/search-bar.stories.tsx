import type { Meta, StoryObj } from "@storybook/react";

import { SearchBar } from "./search-bar";

const meta = {
  title: "Design System/Search/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
        "placeholder": "Search fragrances, brands…"
  },
};
