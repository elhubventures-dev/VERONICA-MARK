/**
 * @file OrderCard — summary card for order history listings in account dashboard.
 * Shows order number, date, status, item preview, and total.
 */

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { OrderStatusBadge, type OrderStatus } from "@/components/commerce/order-status-badge";
import { Price } from "@/components/commerce/price";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OrderCardItemPreview {
  imageSrc: string;
  imageAlt: string;
}

export interface OrderCardProps extends React.HTMLAttributes<HTMLElement> {
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  itemCount: number;
  total: number;
  currency?: string;
  previews?: OrderCardItemPreview[];
  href?: string;
  onViewDetails?: () => void;
}

export function OrderCard({
  className,
  orderNumber,
  placedAt,
  status,
  itemCount,
  total,
  currency = "NGN",
  previews = [],
  href,
  onViewDetails,
  ...props
}: OrderCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow hover:shadow-[var(--shadow-subtle)]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.1em] text-[var(--color-muted-foreground)] uppercase">
            Order {orderNumber}
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Placed {placedAt}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      {previews.length > 0 ? (
        <div className="mt-4 flex -space-x-2">
          {previews.slice(0, 4).map((preview, index) => (
            <div
              key={`${preview.imageSrc}-${index}`}
              className="relative size-12 overflow-hidden rounded-xl border-2 border-[var(--color-surface)] bg-[var(--color-muted)]"
            >
              <Image src={preview.imageSrc} alt={preview.imageAlt} fill sizes="48px" className="object-cover" />
            </div>
          ))}
          {itemCount > previews.length ? (
            <span className="inline-flex size-12 items-center justify-center rounded-xl border-2 border-[var(--color-surface)] bg-[var(--color-muted)] text-xs font-medium">
              +{itemCount - previews.length}
            </span>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
        <Price amount={total} currency={currency} size="md" />
        {href ? (
          <Button asChild variant="outline" size="sm">
            <Link href={href}>View Details</Link>
          </Button>
        ) : onViewDetails ? (
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        ) : null}
      </div>
    </article>
  );
}
