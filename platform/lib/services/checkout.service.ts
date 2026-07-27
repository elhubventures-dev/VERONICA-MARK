import { Decimal } from "@prisma/client/runtime/library";

import { assertPositiveMoney, sumDecimals } from "@/lib/db/query-helpers";

export type CheckoutLineItem = {
  variantId: string;
  quantity: number;
  unitPrice: Decimal | number | string;
};

export type CheckoutPromotion = {
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: Decimal | number | string;
};

export type RecomputeTotalsInput = {
  items: CheckoutLineItem[];
  /**
   * Exclusive tax rate only. Catalog prices are tax-inclusive — leave at 0
   * (or omit) so tax is not added on top of displayed amounts.
   */
  taxRatePercent?: Decimal | number | string;
  shippingFee?: Decimal | number | string;
  promotion?: CheckoutPromotion;
  couponDiscount?: Decimal | number | string;
};

export type CheckoutTotals = {
  subtotal: Decimal;
  tax: Decimal;
  shipping: Decimal;
  discount: Decimal;
  total: Decimal;
};

function toDecimal(value: Decimal | number | string): Decimal {
  return value instanceof Decimal ? value : new Decimal(value.toString());
}

function lineSubtotal(item: CheckoutLineItem): Decimal {
  const unitPrice = toDecimal(item.unitPrice);
  assertPositiveMoney(unitPrice, "unitPrice");
  return unitPrice.mul(item.quantity);
}

function calculatePromotionDiscount(
  subtotal: Decimal,
  promotion?: CheckoutPromotion,
): Decimal {
  if (!promotion) {
    return new Decimal(0);
  }

  const value = toDecimal(promotion.value);

  switch (promotion.type) {
    case "PERCENTAGE": {
      const rate = value.div(100);
      return subtotal.mul(rate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    }
    case "FIXED_AMOUNT":
      return Decimal.min(subtotal, value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    case "FREE_SHIPPING":
      return new Decimal(0);
    default:
      return new Decimal(0);
  }
}

/**
 * Server-side checkout total recomputation using Decimal-safe math.
 * Product prices are tax-inclusive — do not pass a non-zero `taxRatePercent`
 * unless exclusive tax is deliberately reintroduced.
 * All monetary outputs are rounded to 2 decimal places (banker's rounding via HALF_UP).
 */
export function recomputeTotals(input: RecomputeTotalsInput): CheckoutTotals {
  if (input.items.length === 0) {
    return {
      subtotal: new Decimal(0),
      tax: new Decimal(0),
      shipping: new Decimal(0),
      discount: new Decimal(0),
      total: new Decimal(0),
    };
  }

  for (const item of input.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Each line item quantity must be a positive integer");
    }
  }

  const subtotal = sumDecimals(input.items.map(lineSubtotal)).toDecimalPlaces(
    2,
    Decimal.ROUND_HALF_UP,
  );

  const promotionDiscount = calculatePromotionDiscount(subtotal, input.promotion);
  const couponDiscount = toDecimal(input.couponDiscount ?? 0).toDecimalPlaces(
    2,
    Decimal.ROUND_HALF_UP,
  );

  let discount = promotionDiscount.add(couponDiscount);
  if (discount.greaterThan(subtotal)) {
    discount = subtotal;
  }

  const taxableBase = subtotal.sub(discount);
  const taxRate = toDecimal(input.taxRatePercent ?? 0);
  const tax = taxableBase
    .mul(taxRate.div(100))
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  let shipping = toDecimal(input.shippingFee ?? 0).toDecimalPlaces(
    2,
    Decimal.ROUND_HALF_UP,
  );

  if (input.promotion?.type === "FREE_SHIPPING") {
    shipping = new Decimal(0);
  }

  const total = sumDecimals([taxableBase, tax, shipping]).toDecimalPlaces(
    2,
    Decimal.ROUND_HALF_UP,
  );

  return {
    subtotal,
    tax,
    shipping,
    discount,
    total,
  };
}
