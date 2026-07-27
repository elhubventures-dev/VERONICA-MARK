import { Package } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react";

import { ActivityFeed } from "./activity-feed";

const meta = {
  title: "Design System/Dashboard/ActivityFeed",
  component: ActivityFeed,
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityFeed>;

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const Default: Story = {
  args: {
        "items": [
        {
            "id": "1",
            "title": "New order placed",
            "description": "Maison Noir EDP — Atelier Lumière",
            "timestamp": "2 min ago",
            "icon": Package
        }
    ]
  },
};
