import type { Meta, StoryObj } from "@storybook/react";

import { DataGrid } from "./data-grid";

const meta = {
  title: "Design System/Data/DataGrid",
  component: DataGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof DataGrid>;

export const Default: Story = {
  args: {
        "items": [
        {
            "id": "1",
            "title": "Atelier Lumière",
            "subtitle": "Managed brand",
            "meta": "24 active SKUs"
        }
    ]
  },
};
