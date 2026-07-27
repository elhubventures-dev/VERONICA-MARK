/**
 * @file AddToCartButton — primary commerce CTA with loading and sold-out states.
 * Used on PDP and quick-add surfaces across the catalog.
 */

"use client";

import { Loader2, ShoppingBag } from "lucide-react";
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
  return (
    <Button
      size={size}
      className={cn("w-full sm:w-auto", className)}
      disabled={disabled || loading || soldOut}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <ShoppingBag className="size-4" aria-hidden />
      )}
      {soldOut ? "Out of Stock" : loading ? "Adding…" : label}
    </Button>
  );
}
