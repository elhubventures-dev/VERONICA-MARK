/**
 * Email-safe brand tokens — aligned with docs/brand/COLORS.md.
 * Prefer inline hex in HTML (email clients ignore CSS variables).
 */
export const emailTokens = {
  primary: "#4B246A",
  primaryForeground: "#FFFFFF",
  cream: "#F8F4EC",
  charcoal: "#1A1A1A",
  muted: "#5C5650",
  border: "#E6DFD2",
  white: "#FFFFFF",
  brandDeep: "#2A002C",
  brandField: "#3A013C",
  accent: "#C7A25A",
  accentBright: "#EFB12E",
  success: "#2F6B4F",
  warning: "#8A5A1E",
  error: "#8B2E2E",
  fontDisplay: `'Playfair Display', Georgia, 'Times New Roman', serif`,
  fontSans: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
} as const;

export const emailDefaults = {
  brandName: "VERONICA MARK",
  tagline: "Curated for the Exceptional.",
  supportEmail: "sales@veronicamark.com",
  websiteUrl: "https://www.veronicamark.com",
  websiteLabel: "www.veronicamark.com",
  appUrl: process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.veronicamark.com",
} as const;
