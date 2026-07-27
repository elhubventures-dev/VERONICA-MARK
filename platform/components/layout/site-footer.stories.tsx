import type { Meta, StoryObj } from "@storybook/react";

import { SiteFooter } from "./site-footer";

const meta = {
  title: "Design System/Layout/SiteFooter",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {};
