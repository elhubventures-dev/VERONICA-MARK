import type { Meta, StoryObj } from "@storybook/react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "./data-table";

type BrandRow = { id: string; brand: string; orders: number; revenue: string };

const columns: ColumnDef<BrandRow>[] = [
  { accessorKey: "brand", header: "Brand", enableSorting: true },
  { accessorKey: "orders", header: "Orders", enableSorting: true },
  { accessorKey: "revenue", header: "Revenue", enableSorting: true },
];

const data: BrandRow[] = [
  { id: "1", brand: "Atelier Lumière", orders: 128, revenue: "₦27,630,000" },
  { id: "2", brand: "Maison Velours", orders: 94, revenue: "₦19,320,000" },
  { id: "3", brand: "Nocturne Atelier", orders: 76, revenue: "₦14,460,000" },
];

const meta = {
  title: "Design System/Data/DataTable",
  component: DataTable,
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    columns,
    data,
    caption: "Brand performance table",
  },
};
