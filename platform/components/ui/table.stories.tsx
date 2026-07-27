import type { Meta, StoryObj } from "@storybook/react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta: Meta = {
  title: "Design System/UI/Table",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent brand orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>#1042</TableCell>
          <TableCell>Maison Noir</TableCell>
          <TableCell>Shipped</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>#1041</TableCell>
          <TableCell>Velvet & Co</TableCell>
          <TableCell>Processing</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Silk Scarf</TableCell>
          <TableCell className="text-right">₦360,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};