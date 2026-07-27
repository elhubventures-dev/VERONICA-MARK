import type { Meta, StoryObj } from "@storybook/react";

import { PreferenceToggles } from "./preference-toggles";

const meta = {
  title: "Design System/Profile/PreferenceToggles",
  component: PreferenceToggles,
  tags: ["autodocs"],
} satisfies Meta<typeof PreferenceToggles>;

export default meta;
type Story = StoryObj<typeof PreferenceToggles>;

export const Default: Story = {
  args: {
        "items": [
        {
            "id": "newsletter",
            "label": "Newsletter",
            "description": "Weekly fragrance journal",
            "checked": true
        }
    ],
    "onChange": () => undefined
  },
};
