import type { Meta, StoryObj } from "@storybook/react";

import { CmsBlock } from "./cms-block";

const meta = {
  title: "Design System/Cms/CmsBlock",
  component: CmsBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof CmsBlock>;

export default meta;
type Story = StoryObj<typeof CmsBlock>;

export const Default: Story = {
  render: (args) => (
    <CmsBlock {...args}>
      <p className="text-[var(--color-foreground)]">Editable CMS block content</p>
    </CmsBlock>
  ),
  args: {
        "label": "Content block",
    "children": ""
  },
};
