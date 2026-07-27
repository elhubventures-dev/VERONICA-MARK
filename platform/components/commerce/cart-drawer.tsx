/**
 * @file CartDrawer — slide-over shopping bag panel with items and checkout CTA.
 * Minimal sheet overlay implementation (no external Sheet dependency).
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";

import { CartItem, type CartItemProps } from "@/components/commerce/cart-item";
import { CartSummary } from "@/components/commerce/cart-summary";
import { EmptyCart } from "@/components/commerce/empty-cart";
import { Button } from "@/components/ui/button";
import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItemProps[];
  subtotal: number;
  total: number;
  onCheckout?: () => void;
}

export function CartDrawer({
  open,
  onOpenChange,
  items,
  subtotal,
  total,
  onCheckout,
}: CartDrawerProps) {
  const reduceMotion = useReducedMotion();
  const panelId = React.useId();

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close bag"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={motionTransition(reduceMotion, 0.15)}
            className="fixed inset-0 z-[70] bg-[color-mix(in_srgb,var(--color-neutral)_45%,transparent)]"
            onClick={() => onOpenChange(false)}
          />
          <motion.aside
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: "100%" }}
            transition={motionTransition(reduceMotion, 0.3)}
            className="fixed top-0 right-0 z-[80] flex h-full w-[min(100%,420px)] flex-col border-l border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-subtle)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="font-display text-xl">Your Bag</h2>
              <button
                type="button"
                aria-label="Close bag"
                onClick={() => onOpenChange(false)}
                className={cn("rounded-xl p-2 hover:bg-[var(--color-muted)]", focusRingClass)}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <EmptyCart onContinueShopping={() => onOpenChange(false)} />
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id}>
                      <CartItem {...item} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 ? (
              <div className="space-y-4 border-t border-[var(--color-border)] p-5">
                <CartSummary subtotal={subtotal} total={total} shipping={0} shippingLabel="Complimentary shipping" />
                <Button className="w-full" size="lg" onClick={onCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
