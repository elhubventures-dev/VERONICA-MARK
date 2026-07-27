/**
 * @file ProductBadge — semantic label for product status (new, limited, bestseller).
 * Extends the design system Badge with commerce-specific presets.
 */

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ProductBadgeVariant =
  | "new"
  | "limited"
  | "bestseller"
  | "exclusive"
  | "back-in-stock"
  | "sold-out";

const variantConfig: Record<
  ProductBadgeVariant,
  { label: string; badgeVariant: "default" | "accent" | "secondary" | "outline" | "error" | "success" }
> = {
  new: { label: "New", badgeVariant: "accent" },
  limited: { label: "Limited Edition", badgeVariant: "default" },
  bestseller: { label: "Bestseller", badgeVariant: "secondary" },
  exclusive: { label: "VERONICA MARK Exclusive", badgeVariant: "default" },
  "back-in-stock": { label: "Back in Stock", badgeVariant: "success" },
  "sold-out": { label: "Out of Stock", badgeVariant: "error" },
};

export interface ProductBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: ProductBadgeVariant;
  /** Override default label text. */
  label?: string;
}

export function ProductBadge({ className, variant, label, ...props }: ProductBadgeProps) {
  const config = variantConfig[variant];
  return (
    <Badge variant={config.badgeVariant} className={cn("rounded-lg", className)} {...props}>
      {label ?? config.label}
    </Badge>
  );
}
