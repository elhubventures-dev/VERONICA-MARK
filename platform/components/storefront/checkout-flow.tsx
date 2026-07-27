"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { CheckoutSteps, type CheckoutPhase } from "@/components/commerce/checkout-steps";
import { CheckoutSummary } from "@/components/commerce/checkout-summary";
import { CouponInput } from "@/components/commerce/coupon-input";
import { Price } from "@/components/commerce/price";
import { CheckoutPaymentOption } from "@/components/storefront/checkout-payment-option";
import { CheckoutPolicyLinks, TrustSignals } from "@/components/storefront/trust-signals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/features/cart/cart-context";
import { useRegion } from "@/features/storefront/region-context";
import { convertCatalogAmount } from "@/lib/commerce/fx";
import {
  defaultShippingMethodId,
  getAvailableShippingMethods,
  isNigeriaCountry,
  NIGERIA_STATES,
  quoteShipping,
  shippingFeeNgn,
  type ShippingMethodId,
} from "@/lib/commerce/shipping-rates";
import { demoCoupons } from "@/lib/storefront/demo-catalog";
import { computeStorefrontTotals } from "@/lib/storefront/cart-totals";

type ShippingForm = {
  email: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

function buildInitialShipping(checkoutCountry: string): ShippingForm {
  const nigeria = isNigeriaCountry(checkoutCountry);
  return {
    email: "",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: nigeria ? "Rivers" : "",
    postalCode: "",
    country: checkoutCountry,
  };
}

export function CheckoutFlow({ hideTitle = false }: { hideTitle?: boolean }) {
  const router = useRouter();
  const { lines, subtotal, couponCode, setCouponCode } = useCart();
  const { checkoutCountry, isInternationalBrowser, displayCurrency, usdNgnRate } = useRegion();
  const [phase, setPhase] = React.useState<CheckoutPhase>("shipping");
  const [shipping, setShipping] = React.useState<ShippingForm>(() =>
    buildInitialShipping(checkoutCountry),
  );
  const [geoApplied, setGeoApplied] = React.useState(false);
  const [shippingMethod, setShippingMethod] = React.useState<ShippingMethodId>(() =>
    defaultShippingMethodId({
      country: checkoutCountry,
      state: isNigeriaCountry(checkoutCountry) ? "Rivers" : undefined,
    }),
  );
  const [paymentMethod] = React.useState<"paystack">("paystack");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ShippingForm, string>>>({});
  const [couponError, setCouponError] = React.useState<string>();
  const [submitError, setSubmitError] = React.useState<string>();
  const [orderNotes, setOrderNotes] = React.useState("");

  React.useEffect(() => {
    if (geoApplied) return;
    setShipping(buildInitialShipping(checkoutCountry));
    setShippingMethod(
      defaultShippingMethodId({
        country: checkoutCountry,
        state: isNigeriaCountry(checkoutCountry) ? "Rivers" : undefined,
      }),
    );
    setGeoApplied(true);
  }, [checkoutCountry, geoApplied]);

  const nigeria = isNigeriaCountry(shipping.country);
  const availableMethods = React.useMemo(
    () => getAvailableShippingMethods({ country: shipping.country, state: shipping.state }),
    [shipping.country, shipping.state],
  );

  React.useEffect(() => {
    if (lines.length === 0) {
      router.replace("/cart");
    }
  }, [lines.length, router]);

  React.useEffect(() => {
    const nextDefault = defaultShippingMethodId({
      country: shipping.country,
      state: shipping.state,
    });
    const stillValid = availableMethods.some((method) => method.methodId === shippingMethod);
    if (!stillValid) {
      setShippingMethod(nextDefault);
    }
  }, [availableMethods, shipping.country, shipping.state, shippingMethod]);

  const shippingQuote = React.useMemo(
    () =>
      quoteShipping({
        country: shipping.country,
        state: shipping.state,
        methodId: shippingMethod,
      }),
    [shipping.country, shipping.state, shippingMethod],
  );

  const shippingFee = shippingFeeNgn({
    country: shipping.country,
    state: shipping.state,
    methodId: shippingMethod,
  });

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
      shippingFee,
      couponDiscount,
    });
  }, [lines, shippingFee, couponDiscount]);

  const validateShipping = () => {
    const next: Partial<Record<keyof ShippingForm, string>> = {};
    if (!shipping.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      next.email = "Enter a valid email address";
    }
    if (!shipping.name.trim()) next.name = "Full name is required";
    if (!shipping.line1.trim()) next.line1 = "Address is required";
    if (!shipping.city.trim()) next.city = "City is required";
    if (nigeria && !shipping.state.trim()) next.state = "State is required";
    if (!shipping.postalCode.trim()) next.postalCode = "Postal code is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      const response = await fetch("/api/checkout/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping,
          shippingMethod,
          lines,
          couponCode,
          couponDiscount,
          notes: orderNotes.trim() || undefined,
        }),
      });
      const payload = (await response.json()) as {
        data?: { authorizationUrl: string; orderNumber: string; reference: string };
        error?: { message?: string };
      };

      if (!response.ok || !payload.data?.authorizationUrl) {
        throw new Error(payload.error?.message || "Unable to start Paystack payment");
      }

      sessionStorage.setItem(
        "vm-last-order",
        JSON.stringify({
          orderNumber: payload.data.orderNumber,
          reference: payload.data.reference,
          email: shipping.email,
          total: totals.total,
        }),
      );

      window.location.href = payload.data.authorizationUrl;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Payment could not be started");
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
      {!hideTitle ? (
        <>
          <h1 className="font-display text-3xl sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            Guest checkout · Secure payment · Clear delivery updates
          </p>
        </>
      ) : null}

      <TrustSignals variant="checkout" className={hideTitle ? "mt-0" : "mt-8"} />

      <CheckoutSteps current={phase} className="mt-8" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {phase === "shipping" ? (
            <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="font-display text-xl">Contact &amp; shipping</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="checkout-email">Email</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    autoComplete="email"
                    value={shipping.email}
                    onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? (
                    <p className="text-xs text-[var(--color-error)]">{errors.email}</p>
                  ) : null}
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="checkout-name">Full name</Label>
                  <Input
                    id="checkout-name"
                    autoComplete="name"
                    value={shipping.name}
                    onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? (
                    <p className="text-xs text-[var(--color-error)]">{errors.name}</p>
                  ) : null}
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="checkout-line1">Address</Label>
                  <Input
                    id="checkout-line1"
                    autoComplete="address-line1"
                    value={shipping.line1}
                    onChange={(e) => setShipping((s) => ({ ...s, line1: e.target.value }))}
                    aria-invalid={Boolean(errors.line1)}
                  />
                  {errors.line1 ? (
                    <p className="text-xs text-[var(--color-error)]">{errors.line1}</p>
                  ) : null}
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="checkout-line2">Apartment, suite (optional)</Label>
                  <Input
                    id="checkout-line2"
                    autoComplete="address-line2"
                    value={shipping.line2}
                    onChange={(e) => setShipping((s) => ({ ...s, line2: e.target.value }))}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="checkout-country">Country</Label>
                  <select
                    id="checkout-country"
                    value={shipping.country}
                    onChange={(e) => {
                      const country = e.target.value;
                      setShipping((s) => ({
                        ...s,
                        country,
                        state: isNigeriaCountry(country) ? s.state || "Rivers" : "",
                      }));
                    }}
                    className="flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
                  >
                    {!isInternationalBrowser ? <option value="NG">Nigeria</option> : null}
                    <option value="GH">Ghana</option>
                    <option value="KE">Kenya</option>
                    <option value="ZA">South Africa</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="FR">France</option>
                  </select>
                </div>
                {nigeria ? (
                  <div className="space-y-1">
                    <Label htmlFor="checkout-state">State</Label>
                    <select
                      id="checkout-state"
                      value={shipping.state}
                      onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                      className="flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
                      aria-invalid={Boolean(errors.state)}
                    >
                      {NIGERIA_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state ? (
                      <p className="text-xs text-[var(--color-error)]">{errors.state}</p>
                    ) : null}
                  </div>
                ) : null}
                <div className={`space-y-1 ${nigeria ? "" : "sm:col-span-2"}`}>
                  <Label htmlFor="checkout-city">City</Label>
                  <Input
                    id="checkout-city"
                    autoComplete="address-level2"
                    value={shipping.city}
                    onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                    aria-invalid={Boolean(errors.city)}
                  />
                  {errors.city ? (
                    <p className="text-xs text-[var(--color-error)]">{errors.city}</p>
                  ) : null}
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="checkout-postal">Postal code</Label>
                  <Input
                    id="checkout-postal"
                    autoComplete="postal-code"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))}
                    aria-invalid={Boolean(errors.postalCode)}
                  />
                  {errors.postalCode ? (
                    <p className="text-xs text-[var(--color-error)]">{errors.postalCode}</p>
                  ) : null}
                </div>
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">Shipping method</legend>
                {!nigeria ? (
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {isInternationalBrowser
                      ? "Based on your location, only international shipping is available. Prices are shown in USD."
                      : "International destinations use USD for shipping only."}
                  </p>
                ) : null}
                {availableMethods.map((method) => (
                  <label
                    key={method.methodId}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] p-4"
                  >
                    <input
                      type="radio"
                      name="shipping-method"
                      checked={shippingMethod === method.methodId}
                      onChange={() => setShippingMethod(method.methodId)}
                    />
                    <span className="flex-1 text-sm">
                      {method.label} · {method.estimatedDelivery}
                      <span className="block text-[var(--color-muted-foreground)]">
                        {method.description}
                      </span>
                    </span>
                    <Price amount={method.fee} currency={method.currency} size="sm" taxInclusive={false} />
                  </label>
                ))}
              </fieldset>

              <Button
                type="button"
                onClick={() => {
                  if (validateShipping()) setPhase("payment");
                }}
              >
                Continue to payment
              </Button>
            </section>
          ) : null}

          {phase === "payment" ? (
            <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="font-display text-xl">Secure payment</h2>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                You will complete payment on Paystack&apos;s encrypted page — card details are never
                entered on VERONICA MARK. Charges are processed in NGN via Paystack
                {shippingQuote.currency === "USD"
                  ? " (international shipping converted from USD)."
                  : "."}
              </p>
              <div className="space-y-3" role="radiogroup" aria-label="Payment provider">
                <CheckoutPaymentOption
                  provider="paystack"
                  selected={paymentMethod === "paystack"}
                  onSelect={() => undefined}
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setPhase("shipping")}>
                  Back
                </Button>
                <Button type="button" onClick={() => setPhase("review")}>
                  Review order
                </Button>
              </div>
            </section>
          ) : null}

          {phase === "review" ? (
            <section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="font-display text-xl">Review &amp; place order</h2>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-[var(--color-muted-foreground)]">Email</dt>
                  <dd>{shipping.email}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-muted-foreground)]">Ship to</dt>
                  <dd>
                    {shipping.name}, {shipping.line1}, {shipping.city}
                    {shipping.state ? `, ${shipping.state}` : ""} {shipping.postalCode}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--color-muted-foreground)]">Shipping</dt>
                  <dd>
                    {shippingQuote.label} ·{" "}
                    <Price amount={shippingQuote.fee} currency={shippingQuote.currency} size="sm" taxInclusive={false} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--color-muted-foreground)]">Payment</dt>
                  <dd>Paystack (NGN)</dd>
                </div>
              </dl>
              <Label htmlFor="order-notes">Order notes (optional)</Label>
              <Textarea
                id="order-notes"
                placeholder="Gift message or delivery instructions"
                rows={3}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
              {submitError ? (
                <p className="text-sm text-[var(--color-error)]" role="alert">
                  {submitError}
                </p>
              ) : null}
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setPhase("payment")}>
                    Back
                  </Button>
                  <Button type="button" disabled={submitting} onClick={handleSubmit}>
                    {submitting
                      ? "Redirecting to Paystack…"
                      : displayCurrency === "USD"
                        ? `Pay $${convertCatalogAmount(totals.total, "USD", usdNgnRate).toFixed(2)} (charged in NGN via Paystack)`
                        : `Pay ₦${totals.total.toLocaleString("en-NG")} with Paystack`}
                  </Button>
                </div>
                <CheckoutPolicyLinks />
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <CouponInput
            appliedCode={couponCode ?? undefined}
            onApply={async (code) => {
              const promo = demoCoupons[code.toUpperCase()];
              if (promo) {
                setCouponCode(code.toUpperCase());
                setCouponError(undefined);
              } else {
                setCouponError("Invalid code. Try VM5AUG-20 for 20% off.");
              }
            }}
            onRemove={() => setCouponCode(null)}
            error={couponError}
          />
          <CheckoutSummary
            items={lines.map((line) => ({
              id: line.variantId,
              title: line.product.name,
              variant: line.product.variantLabel,
              imageSrc: line.product.image,
              imageAlt: line.product.name,
              price: line.product.price,
              quantity: line.quantity,
            }))}
            subtotal={totals.subtotal}
            shipping={
              shippingQuote.currency === "USD" ? shippingQuote.fee : totals.shipping
            }
            shippingLabel={shippingQuote.label}
            shippingCurrency={shippingQuote.currency === "USD" ? "USD" : undefined}
            discount={totals.discount}
            total={totals.total}
          />
        </aside>
      </div>
    </div>
  );
}
