import type { Meta, StoryObj } from "@storybook/react";

import { SearchEmpty } from "./search-empty";

const meta = {
  title: "Design System/Search/SearchEmpty",
  component: SearchEmpty,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchEmpty>;

export default meta;
type Story = StoryObj<typeof SearchEmpty>;

export const Default: Story = {
  args: {
        "query": "unknown scent",
    "onClear": () => undefined
  },
};
