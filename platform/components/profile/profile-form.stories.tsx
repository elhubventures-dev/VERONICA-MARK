import type { Meta, StoryObj } from "@storybook/react";

import { ProfileForm } from "./profile-form";

const meta = {
  title: "Design System/Profile/ProfileForm",
  component: ProfileForm,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileForm>;

export default meta;
type Story = StoryObj<typeof ProfileForm>;

export const Default: Story = {
  args: {
        "defaultValues": {
        "firstName": "Veronica",
        "lastName": "Mark",
        "email": "veronica@example.com"
    }
  },
};
