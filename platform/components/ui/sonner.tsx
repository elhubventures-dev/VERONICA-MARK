/**
 * VERONICA MARK Sonner toast wrapper.
 *
 * Purpose: Global toast notifications styled with brand tokens.
 * A11y: Live region announcements; dismissible with keyboard.
 * Usage: Mount `<Toaster />` in layout; call `toast("Saved")` from anywhere.
 */
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ className, ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:border-[var(--color-border)] group-[.toaster]:bg-[var(--color-surface)] group-[.toaster]:text-[var(--color-foreground)] group-[.toaster]:shadow-[var(--shadow-subtle)]",
          description: "group-[.toast]:text-[var(--color-muted-foreground)]",
          actionButton:
            "group-[.toast]:rounded-lg group-[.toast]:bg-[var(--color-primary)] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:rounded-lg group-[.toast]:bg-[var(--color-muted)] group-[.toast]:text-[var(--color-foreground)]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
