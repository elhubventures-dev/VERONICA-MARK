/**
 * VERONICA MARK Sheet (Vaul drawer).
 *
 * Purpose: Edge-aligned panel for navigation or secondary workflows.
 * A11y: Focus management via vaul; overlay click or swipe to dismiss.
 * Usage: `<Sheet><SheetTrigger /><SheetContent side="right" /></Sheet>`.
 */
"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Sheet.displayName = "Sheet";

const SheetTrigger = DrawerPrimitive.Trigger;
const SheetPortal = DrawerPrimitive.Portal;
const SheetClose = DrawerPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--color-neutral)_40%,transparent)]",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const sheetSideClasses = {
  top: "inset-x-0 top-0 mt-24 max-h-[80vh] rounded-b-xl border-b",
  bottom: "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-xl border-t",
  left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r",
  right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l",
} as const;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    side?: keyof typeof sheetSideClasses;
  }
>(({ className, children, side = "right", ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-subtle)] outline-none",
        sheetSideClasses[side],
        className,
      )}
      {...props}
    >
      {side === "bottom" && (
        <div className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-[var(--color-border)]" />
      )}
      {children}
      <DrawerPrimitive.Close className="absolute top-4 right-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </DrawerPrimitive.Close>
    </DrawerPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("grid gap-1.5 p-6 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-6", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("font-display text-lg font-semibold text-[var(--color-foreground)]", className)}
    {...props}
  />
));
SheetTitle.displayName = DrawerPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--color-muted-foreground)]", className)}
    {...props}
  />
));
SheetDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
