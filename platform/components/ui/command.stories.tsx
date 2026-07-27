import type { Meta, StoryObj } from "@storybook/react";
import { Calculator, Calendar, Settings } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";

const meta: Meta = {
  title: "Design System/UI/Command",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Command className="max-w-md rounded-xl border border-[var(--color-border)]">
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem><Calendar />Calendar</CommandItem>
          <CommandItem><Calculator />Calculator</CommandItem>
          <CommandItem><Settings />Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Brands">
          <CommandItem>Maison Noir</CommandItem>
          <CommandItem>Velvet & Co</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Empty: Story = {
  render: () => (
    <Command className="max-w-md rounded-xl border border-[var(--color-border)]">
      <CommandInput placeholder="Type to search..." defaultValue="xyz" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </Command>
  ),
};