"use client";

import Link from "next/link";
import * as React from "react";

import { CartItem } from "@/components/commerce/cart-item";
import { CartSummary } from "@/components/commerce/cart-summary";
import { CouponInput } from "@/components/commerce/coupon-input";
import { EmptyCart } from "@/components/commerce/empty-cart";
import { Reveal } from "@/components/storefront/reveal";
import { TrustSignals } from "@/components/storefront/trust-signals";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { useProceedToCheckout } from "@/hooks/use-proceed-to-checkout";
import { demoCoupons } from "@/lib/storefront/demo-catalog";
import { computeStorefrontTotals } from "@/lib/storefront/cart-totals";
import { toast } from "sonner";

export function CartPageContent() {
  const { proceedToCheckout, isReady } = useProceedToCheckout();
  const { lines, subtotal, updateQuantity, removeItem, couponCode, setCouponCode } = useCart();
  const [couponError, setCouponError] = React.useState<string>();
  const [couponLoading, setCouponLoading] = React.useState(false);

  const couponDiscount = React.useMemo(() => {
    if (!couponCode) return 0;
    const promo = demoCoupons[couponCode];
    if (!promo) return 0;
    if (promo.type === "PERCENTAGE") return Math.round(subtotal * (promo.value / 100) * 100) / 100;
    return Math.min(subtotal, promo.value);
  }, [couponCode, subtotal]);

  const totals = React.useMemo(() => {
    return computeStorefrontTotals({
      items: lines.map((line) => ({
        quantity: line.quantity,
        unitPrice: line.product.price,
      })),
      taxRatePercent: 0,
      shippingFee: 0,
      couponDiscount,
    });
  }, [lines, couponDiscount]);

  const handleApplyCoupon = async (code: string) => {
    setCouponLoading(true);
    setCouponError(undefined);
    await new Promise((r) => setTimeout(r, 400));
    const promo = demoCoupons[code.toUpperCase()];
    if (promo) {
      setCouponCode(code.toUpperCase());
    } else {
      setCouponError("This code is invalid or has expired. Try VMA5AUG for 20% off.");
    }
    setCouponLoading(false);
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <EmptyCart ctaHref="/shop" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
      <Reveal>
        <h1 className="font-display text-3xl sm:text-4xl">Your Bag</h1>
        <p className="mt-2 text-[var(--color-muted-foreground)]">
          {lines.length} {lines.length === 1 ? "item" : "items"} · Sign in to complete your order
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {lines.map((line) => (
            <CartItem
              key={line.variantId}
              id={line.variantId}
              title={line.product.name}
              brand={line.product.brand}
              variant={line.product.variantLabel}
              imageSrc={line.product.image}
              imageAlt={line.product.name}
              price={line.product.price}
              quantity={line.quantity}
              maxQuantity={line.product.stock}
              onQuantityChange={(qty) => {
                const result = updateQuantity(line.variantId, qty);
                if (result.limited) {
                  toast.message("Stock limit reached", {
                    description: `Only ${line.product.stock} available for ${line.product.name}.`,
                  });
                }
              }}
              onRemove={() => removeItem(line.variantId)}
            />
          ))}
        </div>

        <Reveal className="space-y-4 lg:sticky lg:top-24 lg:self-start" delay={0.06}>
          <CouponInput
            appliedCode={couponCode ?? undefined}
            onApply={handleApplyCoupon}
            onRemove={() => {
              setCouponCode(null);
              setCouponError(undefined);
            }}
            loading={couponLoading}
            error={couponError}
          />
          <CartSummary
            subtotal={totals.subtotal}
            discount={totals.discount}
            total={totals.total}
          />
          <Button className="w-full" size="lg" disabled={!isReady} onClick={proceedToCheckout}>
            Proceed to secure checkout
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/shop">Continue shopping</Link>
          </Button>
          <TrustSignals variant="compact" />
        </Reveal>
      </div>
    </div>
  );
}
