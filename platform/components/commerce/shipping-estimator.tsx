/**
 * @file ShippingEstimator — destination shipping quote form for bag page.
 * Nigeria: intra-city / interstate / express (NGN). Outside NG: international (USD).
 */

"use client";

import { Loader2, Truck } from "lucide-react";
import * as React from "react";

import { Price } from "@/components/commerce/price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  defaultShippingMethodId,
  getAvailableShippingMethods,
  isNigeriaCountry,
  NIGERIA_STATES,
  quoteShipping,
  type ShippingMethodId,
  type ShippingQuote as RateQuote,
} from "@/lib/commerce/shipping-rates";
import { useRegion } from "@/features/storefront/region-context";
import { cn } from "@/lib/utils";

export interface ShippingQuote {
  cost: number;
  currency?: string;
  estimatedDelivery: string;
  method: string;
  methodId?: ShippingMethodId;
}

export interface ShippingEstimatorProps {
  onEstimate?: (input: {
    postalCode: string;
    country: string;
    state?: string;
    methodId: ShippingMethodId;
    quote: ShippingQuote;
  }) => void | Promise<ShippingQuote | null>;
  quote?: ShippingQuote | null;
  loading?: boolean;
  error?: string;
  className?: string;
}

function toUiQuote(rate: RateQuote): ShippingQuote {
  return {
    cost: rate.fee,
    currency: rate.currency,
    estimatedDelivery: rate.estimatedDelivery,
    method: rate.label,
    methodId: rate.methodId,
  };
}

export function ShippingEstimator({
  onEstimate,
  quote,
  loading = false,
  error,
  className,
}: ShippingEstimatorProps) {
  const { checkoutCountry, isInternationalBrowser } = useRegion();
  const [postalCode, setPostalCode] = React.useState("");
  const [country, setCountry] = React.useState(checkoutCountry);
  const [state, setState] = React.useState(
    isNigeriaCountry(checkoutCountry) ? "Rivers" : "",
  );
  const [methodId, setMethodId] = React.useState<ShippingMethodId>(() =>
    defaultShippingMethodId({
      country: checkoutCountry,
      state: isNigeriaCountry(checkoutCountry) ? "Rivers" : undefined,
    }),
  );

  React.useEffect(() => {
    setCountry(checkoutCountry);
    setState(isNigeriaCountry(checkoutCountry) ? "Rivers" : "");
    setMethodId(
      defaultShippingMethodId({
        country: checkoutCountry,
        state: isNigeriaCountry(checkoutCountry) ? "Rivers" : undefined,
      }),
    );
  }, [checkoutCountry]);

  const nigeria = isNigeriaCountry(country);
  const methods = getAvailableShippingMethods({ country, state });

  React.useEffect(() => {
    const next = defaultShippingMethodId({ country, state });
    if (!methods.some((method) => method.methodId === methodId)) {
      setMethodId(next);
    }
  }, [country, state, methods, methodId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const rate = quoteShipping({ country, state, methodId });
    const uiQuote = toUiQuote(rate);
    void onEstimate?.({
      postalCode: postalCode.trim(),
      country,
      state: nigeria ? state : undefined,
      methodId: rate.methodId,
      quote: uiQuote,
    });
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <Truck className="size-4 text-[var(--color-accent)]" aria-hidden />
        <h3 className="font-display text-lg">Estimate Shipping</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              value={country}
              onChange={(e) => {
                const next = e.target.value;
                setCountry(next);
                if (isNigeriaCountry(next)) {
                  if (!state) setState("Rivers");
                  setPostalCode("");
                }
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
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
              >
                {NIGERIA_STATES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="postal-code">Postal code</Label>
              <Input
                id="postal-code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal / ZIP"
                required
              />
            </div>
          )}
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Method</legend>
          {!nigeria ? (
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {isInternationalBrowser
                ? "Outside Nigeria — international shipping in USD."
                : "Outside Nigeria, shipping is shown in USD only."}
            </p>
          ) : null}
          {methods.map((method) => (
            <label
              key={method.methodId}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 py-2"
            >
              <input
                type="radio"
                name="estimate-shipping-method"
                checked={methodId === method.methodId}
                onChange={() => setMethodId(method.methodId)}
              />
              <span className="flex-1 text-sm">{method.label}</span>
              <Price amount={method.fee} currency={method.currency} size="sm" taxInclusive={false} />
            </label>
          ))}
        </fieldset>

        <Button type="submit" variant="outline" disabled={loading || (!nigeria && !postalCode.trim())}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Calculating…
            </>
          ) : (
            "Get Estimate"
          )}
        </Button>
      </form>

      {error ? (
        <p className="mt-3 text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {quote ? (
        <div className="mt-4 rounded-xl bg-[var(--color-muted)] p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[var(--color-muted-foreground)]">{quote.method}</span>
            <Price amount={quote.cost} currency={quote.currency ?? "NGN"} size="sm" taxInclusive={false} />
          </div>
          <p className="mt-1 text-[var(--color-foreground)]">
            Estimated delivery: {quote.estimatedDelivery}
          </p>
        </div>
      ) : null}
    </div>
  );
}
