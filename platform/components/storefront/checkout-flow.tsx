"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { CheckoutSteps, type CheckoutPhase } from "@/components/commerce/checkout-steps";
import { CheckoutSummary } from "@/components/commerce/checkout-summary";
import { CouponInput } from "@/components/commerce/coupon-input";
import { Price } from "@/components/commerce/price";
import { CheckoutPaymentOption } from "@/components/storefront/checkout-payment-option";
import { FulfillmentChoiceDialog } from "@/components/storefront/fulfillment-choice-dialog";
import { Reveal } from "@/components/storefront/reveal";
import { CheckoutPolicyLinks, TrustSignals } from "@/components/storefront/trust-signals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/features/cart/cart-context";
import { useRegion } from "@/features/storefront/region-context";
import {
  checkoutPathForFulfillment,
  FULFILLMENT_STORAGE_KEY,
  fulfillmentFromQuery,
  STORE_PICKUP_LOCATION,
  type FulfillmentMode,
} from "@/lib/commerce/fulfillment";
import { convertCatalogAmount } from "@/lib/commerce/fx";
import {
  defaultShippingMethodId,
  getAvailableShippingMethods,
  isNigeriaCountry,
  NIGERIA_STATES,
  quoteShipping,
  shippingFeeNgn,
  STORE_PICKUP_RATE,
  type ShippingMethodId,
} from "@/lib/commerce/shipping-rates";
import { luxuryCardClass, motionTransition } from "@/lib/motion";
import { demoCoupons } from "@/lib/storefront/demo-catalog";
import { computeStorefrontTotals } from "@/lib/storefront/cart-totals";

type ShippingForm = {
  email: string;
  name: string;
  phone: string;
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
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: nigeria ? "Rivers" : "",
    postalCode: "",
    country: checkoutCountry,
  };
}

function readStoredFulfillment(): FulfillmentMode | null {
  try {
    const stored = sessionStorage.getItem(FULFILLMENT_STORAGE_KEY);
    return stored === "delivery" || stored === "store_pickup" ? stored : null;
  } catch {
    return null;
  }
}

export function CheckoutFlow({ hideTitle = false }: { hideTitle?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { lines, subtotal, couponCode, setCouponCode } = useCart();
  const { checkoutCountry, isInternationalBrowser, displayCurrency, usdNgnRate } = useRegion();

  const [fulfillment, setFulfillment] = React.useState<FulfillmentMode | null>(() =>
    fulfillmentFromQuery(searchParams.get("fulfillment")),
  );
  const [choiceOpen, setChoiceOpen] = React.useState(false);
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

  const isPickup = fulfillment === "store_pickup";

  const phaseMotion = {
    initial: reduceMotion ? false : ({ opacity: 0, y: 10 } as const),
    animate: { opacity: 1, y: 0 },
    transition: motionTransition(reduceMotion, 0.35),
  };

  React.useEffect(() => {
    const fromQuery = fulfillmentFromQuery(searchParams.get("fulfillment"));
    if (fromQuery) {
      setFulfillment(fromQuery);
      try {
        sessionStorage.setItem(FULFILLMENT_STORAGE_KEY, fromQuery);
      } catch {
        // ignore
      }
      return;
    }
    const stored = readStoredFulfillment();
    if (stored) {
      setFulfillment(stored);
      router.replace(checkoutPathForFulfillment(stored));
      return;
    }
    setChoiceOpen(true);
  }, [searchParams, router]);

  React.useEffect(() => {
    if (geoApplied || isPickup) return;
    setShipping(buildInitialShipping(checkoutCountry));
    setShippingMethod(
      defaultShippingMethodId({
        country: checkoutCountry,
        state: isNigeriaCountry(checkoutCountry) ? "Rivers" : undefined,
      }),
    );
    setGeoApplied(true);
  }, [checkoutCountry, geoApplied, isPickup]);

  React.useEffect(() => {
    if (isPickup) {
      setShippingMethod("store_pickup");
    }
  }, [isPickup]);

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
    if (isPickup) return;
    const nextDefault = defaultShippingMethodId({
      country: shipping.country,
      state: shipping.state,
    });
    const stillValid = availableMethods.some((method) => method.methodId === shippingMethod);
    if (!stillValid) {
      setShippingMethod(nextDefault);
    }
  }, [availableMethods, shipping.country, shipping.state, shippingMethod, isPickup]);

  const shippingQuote = React.useMemo(() => {
    if (isPickup) return STORE_PICKUP_RATE;
    return quoteShipping({
      country: shipping.country,
      state: shipping.state,
      methodId: shippingMethod,
    });
  }, [isPickup, shipping.country, shipping.state, shippingMethod]);

  const shippingFee = isPickup
    ? 0
    : shippingFeeNgn({
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

  const validateContact = () => {
    const next: Partial<Record<keyof ShippingForm, string>> = {};
    if (!shipping.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      next.email = "Enter a valid email address";
    }
    if (!shipping.name.trim()) next.name = "Full name is required";
    const phoneDigits = shipping.phone.replace(/\D/g, "");
    if (!shipping.phone.trim() || phoneDigits.length < 7 || phoneDigits.length > 15) {
      next.phone = "Enter a valid phone number";
    }
    if (!isPickup && nigeria && !shipping.state.trim()) next.state = "State is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSelectFulfillment = (mode: FulfillmentMode) => {
    setFulfillment(mode);
    setChoiceOpen(false);
    setPhase("shipping");
    try {
      sessionStorage.setItem(FULFILLMENT_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
    router.replace(checkoutPathForFulfillment(mode));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      const response = await fetch("/api/checkout/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping: isPickup
            ? {
                email: shipping.email,
                name: shipping.name,
                phone: shipping.phone,
                country: STORE_PICKUP_LOCATION.country,
                state: STORE_PICKUP_LOCATION.state,
                city: STORE_PICKUP_LOCATION.city,
                line1: STORE_PICKUP_LOCATION.line1,
                line2: STORE_PICKUP_LOCATION.line2,
                postalCode: STORE_PICKUP_LOCATION.postalCode,
              }
            : shipping,
          shippingMethod: isPickup ? "store_pickup" : shippingMethod,
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
          name: shipping.name.trim(),
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
      <FulfillmentChoiceDialog
        open={choiceOpen}
        onOpenChange={(open) => {
          setChoiceOpen(open);
          if (!open && !fulfillment) {
            router.push("/cart");
          }
        }}
        onSelect={handleSelectFulfillment}
      />

      {!hideTitle ? (
        <Reveal>
          <h1 className="font-display text-3xl sm:text-4xl">Checkout</h1>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            {isPickup
              ? "Store pickup · Port Harcourt · Secure Paystack payment"
              : "Secure payment · Clear delivery updates"}
          </p>
        </Reveal>
      ) : null}

      <TrustSignals variant="checkout" className={hideTitle ? "mt-0" : "mt-8"} />

      {fulfillment ? (
        <Reveal className="mt-8" delay={0.04}>
          <CheckoutSteps current={phase} fulfillment={fulfillment} />
        </Reveal>
      ) : null}

      {fulfillment ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {phase === "shipping" ? (
              <motion.section
                key="shipping"
                {...phaseMotion}
                className={`space-y-4 rounded-xl p-6 ${luxuryCardClass}`}
              >
                <h2 className="font-display text-xl">
                  {isPickup ? "Contact details" : "Contact & shipping"}
                </h2>

                {isPickup ? (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4 text-sm">
                    <p className="font-medium">Pickup · {STORE_PICKUP_LOCATION.label}</p>
                    <p className="mt-1 text-[var(--color-muted-foreground)]">
                      {STORE_PICKUP_LOCATION.addressLine}
                    </p>
                    <a
                      href={STORE_PICKUP_LOCATION.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-[var(--color-accent)] underline-offset-4 hover:underline"
                    >
                      View on map
                    </a>
                  </div>
                ) : null}

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
                    <Label htmlFor="checkout-phone">Phone number</Label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+234 801 234 5678"
                      value={shipping.phone}
                      onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    {errors.phone ? (
                      <p className="text-xs text-[var(--color-error)]">{errors.phone}</p>
                    ) : null}
                  </div>

                  {!isPickup ? (
                    <>
                      <div className="space-y-1 sm:col-span-2">
                        <Label htmlFor="checkout-country">Country</Label>
                        <select
                          id="checkout-country"
                          value={shipping.country}
                          onChange={(e) => {
                            const country = e.target.value;
                            const toNigeria = isNigeriaCountry(country);
                            setShipping((s) => ({
                              ...s,
                              country,
                              state: toNigeria ? s.state || "Rivers" : "",
                              line1: "",
                              line2: "",
                              city: "",
                              postalCode: "",
                            }));
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.state;
                              return next;
                            });
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
                        <div className="space-y-1 sm:col-span-2">
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
                    </>
                  ) : null}
                </div>

                {!isPickup ? (
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
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] p-4 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-accent)_45%,var(--color-border))] hover:shadow-[var(--shadow-subtle)]"
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
                        <Price
                          amount={method.fee}
                          currency={method.currency}
                          size="sm"
                          taxInclusive={false}
                        />
                      </label>
                    ))}
                  </fieldset>
                ) : null}

                <Button
                  type="button"
                  onClick={() => {
                    if (validateContact()) setPhase("payment");
                  }}
                >
                  {isPickup ? "Continue to payment" : "Continue to payment"}
                </Button>
              </motion.section>
            ) : null}

            {phase === "payment" ? (
              <motion.section
                key="payment"
                {...phaseMotion}
                className={`space-y-4 rounded-xl p-6 ${luxuryCardClass}`}
              >
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
              </motion.section>
            ) : null}

            {phase === "review" ? (
              <motion.section
                key="review"
                {...phaseMotion}
                className={`space-y-4 rounded-xl p-6 ${luxuryCardClass}`}
              >
                <h2 className="font-display text-xl">Review &amp; place order</h2>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Email</dt>
                    <dd>{shipping.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Full name</dt>
                    <dd>{shipping.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">Phone</dt>
                    <dd>{shipping.phone}</dd>
                  </div>
                  {isPickup ? (
                    <div>
                      <dt className="text-[var(--color-muted-foreground)]">Collect from</dt>
                      <dd>{STORE_PICKUP_LOCATION.addressLine}</dd>
                    </div>
                  ) : (
                    <div>
                      <dt className="text-[var(--color-muted-foreground)]">Ship to</dt>
                      <dd>
                        {shipping.name}
                        {shipping.state ? `, ${shipping.state}` : ""}, {shipping.country}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-[var(--color-muted-foreground)]">
                      {isPickup ? "Fulfillment" : "Shipping"}
                    </dt>
                    <dd>
                      {shippingQuote.label} ·{" "}
                      <Price
                        amount={shippingQuote.fee}
                        currency={shippingQuote.currency}
                        size="sm"
                        taxInclusive={false}
                      />
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
                  placeholder={
                    isPickup
                      ? "Preferred collection time or gift message"
                      : "Delivery address, landmark, or gift message"
                  }
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
              </motion.section>
            ) : null}
          </div>

          <Reveal className="space-y-4 lg:sticky lg:top-24 lg:self-start" delay={0.06}>
            <CouponInput
              appliedCode={couponCode ?? undefined}
              onApply={async (code) => {
                const promo = demoCoupons[code.toUpperCase()];
                if (promo) {
                  setCouponCode(code.toUpperCase());
                  setCouponError(undefined);
                } else {
                  setCouponError("Invalid code. Try VMA5AUG for 20% off.");
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
            <button
              type="button"
              className="text-sm text-[var(--color-muted-foreground)] underline-offset-4 hover:underline"
              onClick={() => setChoiceOpen(true)}
            >
              Change pickup or delivery
            </button>
          </Reveal>
        </div>
      ) : null}
    </div>
  );
}
