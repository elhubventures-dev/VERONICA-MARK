"use client";

import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type DemoToastButtonProps = {
  label: string;
  message: string;
  description?: string;
  icon?: ReactNode;
} & Pick<ButtonProps, "variant" | "size" | "className">;

export function DemoToastButton({
  label,
  message,
  description,
  icon,
  variant = "default",
  size = "default",
  className,
}: DemoToastButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => toast.success(message, { description })}
    >
      {icon}
      {label}
    </Button>
  );
}
