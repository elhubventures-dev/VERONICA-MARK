import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta: Meta = {
  title: "Design System/UI/Alert",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-md">
      <AlertCircle className="size-4" />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Your brand profile is 80% complete.</AlertDescription>
    </Alert>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <Alert variant="success"><AlertTitle>Success</AlertTitle><AlertDescription>Payment captured.</AlertDescription></Alert>
      <Alert variant="warning"><AlertTitle>Warning</AlertTitle><AlertDescription>Inventory is low.</AlertDescription></Alert>
      <Alert variant="error"><AlertTitle>Error</AlertTitle><AlertDescription>Checkout failed.</AlertDescription></Alert>
      <Alert variant="info"><AlertTitle>Info</AlertTitle><AlertDescription>New feature available.</AlertDescription></Alert>
    </div>
  ),
};