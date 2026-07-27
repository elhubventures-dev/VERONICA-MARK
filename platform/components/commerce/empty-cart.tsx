/**
 * @file EmptyCart — empty bag state with editorial messaging and CTA.
 * Shown in cart drawer, bag page, and checkout guard rails.
 */

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { siteMedia } from "@/lib/storefront/site-media";
import { cn } from "@/lib/utils";

export interface EmptyCartProps extends React.HTMLAttributes<HTMLDivElement> {
  onContinueShopping?: () => void;
  ctaHref?: string;
}

export function EmptyCart({
  className,
  onContinueShopping,
  ctaHref = "/shop",
  ...props
}: EmptyCartProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)] text-center",
        className,
      )}
      {...props}
    >
      <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden">
        <Image
          src={siteMedia.emptyCartIllustration}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 28rem"
          className="object-cover"
        />
      </div>
      <div className="px-6 py-8">
        <h3 className="font-display text-xl">Your bag awaits its signature scent</h3>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-muted-foreground)]">
          Explore curated compositions from the world&apos;s finest maisons — each bottle authenticated
          and managed by VERONICA MARK.
        </p>
        {onContinueShopping ? (
          <Button className="mt-6" onClick={onContinueShopping}>
            Continue Shopping
          </Button>
        ) : (
          <Button asChild className="mt-6">
            <Link href={ctaHref}>Discover Fragrances</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
