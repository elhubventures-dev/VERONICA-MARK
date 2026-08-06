/**
 * Normalize customer phones for WhatsApp providers (international digits, no +).
 * Nigerian local numbers (0XXXXXXXXXX) become 234XXXXXXXXXX.
 */

export function normalizeWhatsAppPhone(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;

  let digits = raw.trim().replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  }
  digits = digits.replace(/\D/g, "");

  if (!digits) return null;

  // Local Nigerian mobile: 0803… → 234803…
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `234${digits.slice(1)}`;
  }

  // Bare 10-digit NG mobile without leading 0 (e.g. 803…)
  if (digits.length === 10 && /^[789]/.test(digits)) {
    digits = `234${digits}`;
  }

  // E.164 without +: 10–15 digits; Nigeria WhatsApp typically 13 (234 + 10)
  if (digits.length < 10 || digits.length > 15) return null;

  return digits;
}

type ShippingAddressPhone = {
  phone?: string | null;
};

function asShippingPhone(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const phone = (value as ShippingAddressPhone).phone;
  return typeof phone === "string" ? phone : null;
}

/**
 * Prefer checkout shipping phone; fall back to account User.phone.
 */
export function resolveOrderWhatsAppPhone(order: {
  shippingAddress: unknown;
  customer?: { user?: { phone?: string | null } | null } | null;
}): string | null {
  const fromShipping = normalizeWhatsAppPhone(asShippingPhone(order.shippingAddress));
  if (fromShipping) return fromShipping;
  return normalizeWhatsAppPhone(order.customer?.user?.phone ?? null);
}
