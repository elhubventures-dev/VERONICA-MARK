/**
 * VERONICA MARK Drawer.
 *
 * Purpose: Bottom drawer alias wrapping Vaul for mobile-first panels.
 * A11y: Same as Sheet; swipe-to-dismiss with keyboard Escape support.
 * Usage: `<Drawer><DrawerTrigger /><DrawerContent /></Drawer>`.
 */
"use client";

import * as React from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Drawer = Sheet;
const DrawerPortal = SheetPortal;
const DrawerOverlay = SheetOverlay;
const DrawerTrigger = SheetTrigger;
const DrawerClose = SheetClose;
const DrawerHeader = SheetHeader;
const DrawerFooter = SheetFooter;
const DrawerTitle = SheetTitle;
const DrawerDescription = SheetDescription;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  React.ComponentPropsWithoutRef<typeof SheetContent>
>(({ side = "bottom", ...props }, ref) => (
  <SheetContent ref={ref} side={side} {...props} />
));
DrawerContent.displayName = "DrawerContent";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
