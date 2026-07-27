/**
 * @file AddToCartButton — primary commerce CTA with loading and sold-out states.
 * Used on PDP and quick-add surfaces across the catalog.
 */

"use client";

import { Check, Loader2, ShoppingBag } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AddToCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  soldOut?: boolean;
  label?: string;
  size?: "default" | "sm" | "lg";
}

export function AddToCartButton({
  className,
  loading = false,
  soldOut = false,
  label = "Add to Bag",
  size = "default",
  disabled,
  onClick,
  ...props
}: AddToCartButtonProps) {
  const [justAdded, setJustAdded] = React.useState(false);
  const wasLoading = React.useRef(false);

  React.useEffect(() => {
    if (wasLoading.current && !loading && !soldOut) {
      setJustAdded(true);
      const timer = window.setTimeout(() => setJustAdded(false), 1400);
      wasLoading.current = false;
      return () => window.clearTimeout(timer);
    }
    wasLoading.current = loading;
  }, [loading, soldOut]);

  const showSuccess = justAdded && !loading && !soldOut;

  return (
    <Button
      size={size}
      className={cn(
        "w-full transition-[transform,background-color] duration-300 active:scale-[0.98] sm:w-auto",
        showSuccess &&
          "bg-[color-mix(in_srgb,var(--color-success)_92%,black)] hover:bg-[color-mix(in_srgb,var(--color-success)_88%,black)]",
        className,
      )}
      disabled={disabled || loading || soldOut}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : showSuccess ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <ShoppingBag className="size-4" aria-hidden />
      )}
      {soldOut ? "Out of Stock" : loading ? "Adding…" : showSuccess ? "Added" : label}
    </Button>
  );
}
