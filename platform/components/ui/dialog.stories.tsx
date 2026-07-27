import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta: Meta = {
  title: "Design System/UI/Dialog",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm changes</DialogTitle>
          <DialogDescription>Review your brand settings before saving.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Info dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Brand guidelines</DialogTitle>
          <DialogDescription>Use approved typography and color tokens only.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};