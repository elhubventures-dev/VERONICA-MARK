import type { Meta, StoryObj } from "@storybook/react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "./button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

const meta: Meta = {
  title: "Design System/UI/Collapsible",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Order #1042</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="size-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <p className="text-sm text-[var(--color-muted-foreground)]">3 items · Shipped via DHL Express</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[350px]">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 text-sm">Expanded by default.</CollapsibleContent>
    </Collapsible>
  ),
};