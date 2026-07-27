/**
 * @file MiniCart — header bag trigger with item count badge and optional preview dropdown.
 * Opens CartDrawer or navigates to full bag page.
 */

"use client";

import { ShoppingBag } from "lucide-react";
import * as React from "react";

import { CartDrawer } from "@/components/commerce/cart-drawer";
import type { CartItemProps } from "@/components/commerce/cart-item";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface MiniCartProps {
  itemCount: number;
  items?: CartItemProps[];
  subtotal?: number;
  total?: number;
  onCheckout?: () => void;
  className?: string;
}

export function MiniCart({
  itemCount,
  items = [],
  subtotal = 0,
  total = 0,
  onCheckout,
  className,
}: MiniCartProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={`Shopping bag, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        onClick={() => setOpen(true)}
        className={cn(
          "relative inline-flex size-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-muted)]",
          focusRingClass,
          className,
        )}
      >
        <ShoppingBag className="size-4" aria-hidden />
        {itemCount > 0 ? (
          <span className="absolute -top-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-medium text-[var(--color-neutral)]">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        ) : null}
      </button>

      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        items={items}
        subtotal={subtotal}
        total={total}
        onCheckout={onCheckout}
      />
    </>
  );
}
