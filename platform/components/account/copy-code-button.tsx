"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

type CopyCodeButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
  successMessage?: string;
  className?: string;
} & Pick<ButtonProps, "variant" | "size">;

export function CopyCodeButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  successMessage,
  className,
  variant = "outline",
  size = "sm",
}: CopyCodeButtonProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(successMessage ?? "Copied to clipboard");
    } catch {
      toast.error("Could not copy right now. Please try again.");
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("shrink-0", className)}
      onClick={handleCopy}
      aria-live="polite"
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
