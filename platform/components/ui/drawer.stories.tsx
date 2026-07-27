import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const meta: Meta = {
  title: "Design System/UI/Drawer",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Filter products</DrawerTitle>
          <DrawerDescription>Refine your catalog search.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};

export const BottomDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Mobile menu</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Swipe down to dismiss.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};