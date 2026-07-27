import { Decimal } from "@prisma/client/runtime/library";

import { ValidationError } from "@/lib/errors";
import type { SortDirection } from "@/lib/db/types";

export function buildOrderBy<TField extends string>(
  field: TField,
  direction: SortDirection = "desc",
): Record<TField, SortDirection> {
  return { [field]: direction } as Record<TField, SortDirection>;
}

export function decimalToNumber(value: Decimal | null | undefined): number {
  if (value == null) {
    return 0;
  }
  return value.toNumber();
}

export function toMoneyCents(value: Decimal | number | string): number {
  const decimal =
    value instanceof Decimal ? value : new Decimal(value.toString());
  return decimal.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
}

export function moneyEquals(
  a: Decimal | number | string,
  b: Decimal | number | string,
): boolean {
  const left = a instanceof Decimal ? a : new Decimal(a.toString());
  const right = b instanceof Decimal ? b : new Decimal(b.toString());
  return left.equals(right);
}

export function assertPositiveMoney(
  value: Decimal | number | string,
  label = "amount",
): void {
  const decimal =
    value instanceof Decimal ? value : new Decimal(value.toString());

  if (decimal.isNegative() || decimal.isZero()) {
    throw new ValidationError(`${label} must be a positive monetary value`);
  }
}

export function sumDecimals(values: Array<Decimal | number | string>): Decimal {
  return values.reduce<Decimal>((acc, value) => {
    const next = value instanceof Decimal ? value : new Decimal(value.toString());
    return acc.add(next);
  }, new Decimal(0));
}
