import type { Meta, StoryObj } from "@storybook/react";

import { SecuritySettings } from "./security-settings";

const meta = {
  title: "Design System/Profile/SecuritySettings",
  component: SecuritySettings,
  tags: ["autodocs"],
} satisfies Meta<typeof SecuritySettings>;

export default meta;
type Story = StoryObj<typeof SecuritySettings>;

export const Default: Story = {
  args: {
        "twoFactorEnabled": false,
    "onChangePassword": () => undefined,
    "onEnableTwoFactor": () => undefined
  },
};
