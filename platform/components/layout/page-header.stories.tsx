import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";

import { PageHeader } from "./page-header";

const meta = {
  title: "Design System/Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    eyebrow: "Maison Collection",
    title: "Signature Fragrances",
    description: "Explore limited releases from our managed brand partners.",
    actions: <Button variant="outline">Filter</Button>,
  },
};
