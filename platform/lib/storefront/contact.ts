/** Public client-services contact details for the storefront. */
export const storefrontContact = {
  email: "sales@veronicamark.com",
  /** Display format for storefront copy and tel: links. */
  phone: "+234 808 518 3747",
  /** Digits-only E.164 without leading + — used for WhatsApp / wa.me. */
  phoneE164: "2348085183747",
  telUrl: "tel:+2348085183747",
  whatsappUrl: "https://wa.me/2348085183747",
  address: {
    line1: "88 Woji Road, GRA Phase 3",
    line2: "Port Harcourt 500001",
    line3: "Rivers, Nigeria",
  },
  /** Single-line address for legal/FAQ/email copy. */
  addressLine:
    "88 Woji Road, GRA Phase 3, Port Harcourt 500001, Rivers, Nigeria",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=88+Woji+Road+GRA+Phase+3+Port+Harcourt+500001+Rivers+Nigeria",
  websiteLabel: "www.veronicamark.com",
  websiteUrl: "https://www.veronicamark.com",
  responseNote: "We aim to respond within one business day.",
} as const;

/** Compact multi-channel line for emails and recovery messages. */
export function storefrontContactChannelsLine(): string {
  return `Phone / WhatsApp ${storefrontContact.phone} · ${storefrontContact.email} · ${storefrontContact.addressLine}`;
}
