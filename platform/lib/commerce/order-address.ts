/**
 * Normalize order shipping/billing address JSON for staff edit UIs.
 */

export type OrderAddressFields = {
  name: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export function mapOrderAddress(raw: unknown): OrderAddressFields {
  const addr = (raw ?? {}) as Record<string, string | undefined>;
  return {
    name: addr.name ?? addr.fullName ?? "",
    phone: addr.phone ?? "",
    email: addr.email ?? "",
    line1: addr.line1 ?? addr.address1 ?? "",
    line2: addr.line2 ?? addr.address2 ?? "",
    city: addr.city ?? "",
    state: addr.state ?? "",
    postalCode: addr.postalCode ?? "",
    country: addr.country ?? "",
  };
}

export function toAddressJson(address: OrderAddressFields) {
  return {
    name: address.name.trim(),
    phone: address.phone.trim() || undefined,
    email: address.email.trim() || undefined,
    line1: address.line1.trim(),
    line2: address.line2.trim() || undefined,
    city: address.city.trim(),
    state: address.state.trim() || undefined,
    postalCode: address.postalCode.trim() || undefined,
    country: address.country.trim(),
  };
}
