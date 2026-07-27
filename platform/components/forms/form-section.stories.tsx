import type { Meta, StoryObj } from "@storybook/react";

import { FormSection } from "./form-section";

const meta = {
  title: "Design System/Forms/FormSection",
  component: FormSection,
  tags: ["autodocs"],
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof FormSection>;

export const Default: Story = {
  args: {
    title: "Account details",
    description: "Update your profile information",
    children: (
      <p className="text-sm text-[var(--color-muted-foreground)]">Form fields go here</p>
    ),
  },
};
