import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta: Meta = {
  title: "Design System/UI/Card",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Maison Collection</CardTitle>
        <CardDescription>Premium seasonal catalog for Q3.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-muted-foreground)]">12 products · 3 collections</p>
      </CardContent>
      <CardFooter>
        <Button>View catalog</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader className="grid grid-cols-[1fr_auto]">
        <CardTitle>Revenue</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm">Export</Button>
        </CardAction>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>€128,450</CardContent>
    </Card>
  ),
};