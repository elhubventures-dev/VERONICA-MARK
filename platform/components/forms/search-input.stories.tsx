import type { Meta, StoryObj } from "@storybook/react";

import { SearchInput } from "./search-input";

const meta = {
  title: "Design System/Forms/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
        "placeholder": "Search…"
  },
};
