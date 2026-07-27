export type StorefrontCheckoutLine = {
  quantity: number;
  unitPrice: number;
};

export type StorefrontTotalsInput = {
  items: StorefrontCheckoutLine[];
  taxRatePercent?: number;
  shippingFee?: number;
  couponDiscount?: number;
  freeShipping?: boolean;
};

export type StorefrontTotals = {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
};

function money(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * Client-safe cart/checkout totals (number math).
 * Product prices are tax-inclusive — `taxRatePercent` must stay 0 unless exclusive tax is reintroduced.
 * Server order persistence should continue to use Decimal `recomputeTotals`.
 */
export function computeStorefrontTotals(input: StorefrontTotalsInput): StorefrontTotals {
  if (input.items.length === 0) {
    return { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 };
  }

  const subtotal = money(
    input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  const discount = money(Math.min(subtotal, Math.max(0, input.couponDiscount ?? 0)));
  const taxableBase = money(subtotal - discount);
  // Tax-inclusive catalog: never add tax on top of displayed prices.
  const tax = 0;
  void input.taxRatePercent;
  const shipping = input.freeShipping ? 0 : money(Math.max(0, input.shippingFee ?? 0));
  const total = money(taxableBase + tax + shipping);

  return { subtotal, tax, shipping, discount, total };
}
