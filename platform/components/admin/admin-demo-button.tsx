"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type AdminDemoButtonProps = {
  label: string;
  message: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg";
};

export function AdminDemoButton({
  label,
  message,
  variant = "outline",
  size = "sm",
}: AdminDemoButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => toast.success(message)}
    >
      {label}
    </Button>
  );
}
