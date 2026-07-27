import type { Meta, StoryObj } from "@storybook/react";

import { NotificationPreferences } from "./notification-preferences";

const meta = {
  title: "Design System/Profile/NotificationPreferences",
  component: NotificationPreferences,
  tags: ["autodocs"],
} satisfies Meta<typeof NotificationPreferences>;

export default meta;
type Story = StoryObj<typeof NotificationPreferences>;

export const Default: Story = {
  args: {
        "values": {
        "orders": true,
        "promotions": false,
        "newsletter": true
    },
    "onChange": () => undefined
  },
};
