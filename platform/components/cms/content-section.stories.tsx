import type { Meta, StoryObj } from "@storybook/react";

import { ContentSection } from "./content-section";

const meta = {
  title: "Design System/Cms/ContentSection",
  component: ContentSection,
  tags: ["autodocs"],
} satisfies Meta<typeof ContentSection>;

export default meta;
type Story = StoryObj<typeof ContentSection>;

export const Default: Story = {
  args: {
    title: "Featured brands",
    description: "Managed brand partners",
    children: (
      <p className="text-sm text-[var(--color-muted-foreground)]">Brand grid or editorial content</p>
    ),
  },
};
