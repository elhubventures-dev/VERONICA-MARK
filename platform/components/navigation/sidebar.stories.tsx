import type { Meta, StoryObj } from "@storybook/react";

import { Sidebar } from "./sidebar";

const meta = {
  title: "Design System/Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Account: Story = {
  render: () => (
    <div className="h-[420px]">
      <Sidebar
        collapsible
        header={<p className="font-display text-lg">Account</p>}
        sections={[
          {
            title: "Shopping",
            items: [
              { label: "Orders", href: "/account/orders", active: true },
              { label: "Wishlist", href: "/account/wishlist" },
              { label: "Addresses", href: "/account/addresses" },
            ],
          },
          {
            title: "Preferences",
            items: [
              { label: "Profile", href: "/account/profile" },
              { label: "Notifications", href: "/account/notifications" },
            ],
          },
        ]}
      />
    </div>
  ),
};
