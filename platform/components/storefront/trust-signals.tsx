"use client";

import { BadgeCheck, Lock, PackageCheck, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { useRegion } from "@/features/storefront/region-context";
import {
  DOMESTIC_SHIPPING_RATES,
  INTERNATIONAL_SHIPPING_RATE,
} from "@/lib/commerce/shipping-rates";
import {
  OPENING_COUPON_CODE,
  OPENING_DISCOUNT_PERCENT,
} from "@/lib/storefront/demo-catalog";
import { cn } from "@/lib/utils";

type TrustSignalsProps = {
  /** pdp = authenticity + delivery; checkout = secure pay; compact = footer/cart strip */
  variant?: "pdp" | "checkout" | "compact";
  className?: string;
};

type TrustItem = {
  icon: LucideIcon;
  title: string;
  body: string;
};

function formatNgn(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function deliveryBody(isInternationalBrowser: boolean) {
  if (isInternationalBrowser) {
    return `International shipping ${formatUsd(INTERNATIONAL_SHIPPING_RATE.fee)}. Track every stage.`;
  }

  return `Intra-city ${formatNgn(DOMESTIC_SHIPPING_RATES.intra_city.fee)} · Interstate ${formatNgn(DOMESTIC_SHIPPING_RATES.interstate.fee)} · Express ${formatNgn(DOMESTIC_SHIPPING_RATES.express.fee)} · International ${formatUsd(INTERNATIONAL_SHIPPING_RATE.fee)} (outside Nigeria). Track every stage.`;
}

function buildItems(
  variant: NonNullable<TrustSignalsProps["variant"]>,
  isInternationalBrowser: boolean,
): TrustItem[] {
  if (variant === "compact") {
    return [
      {
        icon: ShieldCheck,
        title: "Authenticity assured",
        body: "Managed-brand verified",
      },
      {
        icon: Lock,
        title: "Secure payment",
        body: "Paystack",
      },
      {
        icon: PackageCheck,
        title: "Tracked delivery",
        body: "Updates to your email",
      },
    ];
  }

  if (variant === "checkout") {
    return [
      {
        icon: Lock,
        title: "Secure checkout",
        body: "Encrypted connection. Pay via Paystack — you are never asked for card details on our pages.",
      },
      {
        icon: ShieldCheck,
        title: "Member checkout",
        body: "Sign in or create an account to place your order and track delivery in one place.",
      },
      {
        icon: PackageCheck,
        title: "Transparent policies",
        body: `Clear privacy terms and delivery updates with every confirmation. Opening offer: ${OPENING_DISCOUNT_PERCENT}% off with code ${OPENING_COUPON_CODE}.`,
      },
    ];
  }

  return [
    {
      icon: ShieldCheck,
      title: "Authenticity assured",
      body: "Every piece is sourced through VERONICA MARK’s managed-brand partnerships — never grey-market listings.",
    },
    {
      icon: PackageCheck,
      title: "Delivery with care",
      body: deliveryBody(isInternationalBrowser),
    },
    {
      icon: BadgeCheck,
      title: "Verified client reviews",
      body: `Impressions from customers who purchased through VERONICA MARK. Use code ${OPENING_COUPON_CODE} for ${OPENING_DISCOUNT_PERCENT}% off the opening edit.`,
    },
  ];
}

export function TrustSignals({ variant = "compact", className }: TrustSignalsProps) {
  const { isInternationalBrowser } = useRegion();
  const list = buildItems(variant, isInternationalBrowser);

  return (
    <ul className={cn("grid grid-cols-1 gap-3", className)}>
      {list.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className={cn(
            "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]",
            variant === "compact" ? "p-3" : "p-5",
          )}
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))] text-[var(--color-primary)]">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{title}</p>
              <p
                className={cn(
                  "mt-1 text-[var(--color-muted-foreground)]",
                  variant === "compact" ? "text-xs leading-snug" : "text-sm leading-relaxed",
                )}
              >
                {body}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CheckoutPolicyLinks({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-[var(--color-muted-foreground)]", className)}>
      By placing your order you agree to our{" "}
      <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--color-primary)]">
        Terms
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-primary)]">
        Privacy Policy
      </Link>
      . Your payment is processed securely by the selected provider.
    </p>
  );
}
