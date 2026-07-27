import type { Meta, StoryObj } from "@storybook/react";

import { BarChart } from "./bar-chart";

const sampleData = [
  { brand: "Atelier Lumière", sales: 12400 },
  { brand: "Maison Noir", sales: 9800 },
  { brand: "Velvet Rose", sales: 7600 },
  { brand: "Côte Azure", sales: 6200 },
];

const meta = {
  title: "Design System/Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    data: sampleData,
    xKey: "brand",
    series: [{ dataKey: "sales", name: "Sales" }],
    title: "Top brands",
    description: "Weekly sales by brand",
  },
};
