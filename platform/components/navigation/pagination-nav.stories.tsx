import type { Meta, StoryObj } from "@storybook/react";

import { PaginationNav } from "./pagination-nav";

const meta = {
  title: "Design System/Navigation/PaginationNav",
  component: PaginationNav,
  tags: ["autodocs"],
} satisfies Meta<typeof PaginationNav>;

export default meta;
type Story = StoryObj<typeof PaginationNav>;

export const MiddlePage: Story = {
  args: {
    page: 4,
    totalPages: 12,
    hrefForPage: (p: number) => `/shop?page=${p}`,
  },
};

export const FirstPage: Story = {
  args: {
    page: 1,
    totalPages: 5,
    hrefForPage: (p: number) => `/shop?page=${p}`,
  },
};
