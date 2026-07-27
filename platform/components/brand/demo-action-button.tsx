"use client";

import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type DemoActionButtonProps = Omit<ButtonProps, "children" | "onClick"> & {
  label: string;
  pendingLabel?: string;
  successMessage: string;
  description?: string;
};

export function DemoActionButton({
  label,
  pendingLabel = "Working...",
  successMessage,
  description,
  disabled,
  ...props
}: DemoActionButtonProps) {
  const [isPending, setIsPending] = React.useState(false);

  async function handleClick() {
    setIsPending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    toast.success(successMessage, { description });
    setIsPending(false);
  }

  return (
    <Button {...props} disabled={disabled || isPending} onClick={handleClick}>
      {isPending ? pendingLabel : label}
    </Button>
  );
}
