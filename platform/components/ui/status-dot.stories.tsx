import type { Meta, StoryObj } from "@storybook/react";

import { StatusDot } from "./status-dot";

const meta: Meta<typeof StatusDot> = {
  title: "Design System/UI/StatusDot",
  component: StatusDot,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <span className="inline-flex items-center gap-2 text-sm">
      <StatusDot status="success" aria-label="Online" /> Online
    </span>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <span className="inline-flex items-center gap-2 text-sm"><StatusDot status="success" /> Success</span>
      <span className="inline-flex items-center gap-2 text-sm"><StatusDot status="warning" /> Warning</span>
      <span className="inline-flex items-center gap-2 text-sm"><StatusDot status="error" /> Error</span>
      <span className="inline-flex items-center gap-2 text-sm"><StatusDot status="info" /> Info</span>
      <span className="inline-flex items-center gap-2 text-sm"><StatusDot status="primary" pulse /> Primary</span>
    </div>
  ),
};