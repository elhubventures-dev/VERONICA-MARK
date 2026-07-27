import { greet, resolveAppUrl } from "@/emails/layout";
import type {
  AdminEventVars,
  BrandOpsEmailVars,
  ContactEmailVars,
  EmailContent,
  MarketingEmailVars,
} from "@/emails/types";

export function buildNewsletterWelcome(vars: MarketingEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: "Welcome to the VERONICA MARK private list",
    previewText: "Curated arrivals and house notes — never spam.",
    eyebrow: "Private list",
    heading: "You are on the list",
    paragraphs: [
      greet(vars.recipientName),
      "Thank you for joining the VERONICA MARK private list.",
      "Expect curated arrivals, fragrance notes and considered edits — never spam.",
      "You can update preferences or leave the list anytime from your account settings.",
    ],
    cta: {
      label: vars.ctaLabel || "Browse the edit",
      href: vars.ctaUrl || appUrl,
    },
    unsubscribeUrl: vars.unsubscribeUrl || `${appUrl}/account/settings`,
  };
}

export function buildMarketingFlashSale(vars: MarketingEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: vars.campaignName || vars.headline || "A limited opening edit awaits",
    previewText: vars.offerLabel || "A timed selection from VERONICA MARK.",
    eyebrow: "Opening edit",
    heading: vars.headline || "A limited opening edit",
    paragraphs: [
      greet(vars.recipientName),
      vars.body ||
        "A carefully selected opening edit is available for a limited window. Discover exceptional pieces before the moment passes.",
      vars.endsAtLabel ? `Available until ${vars.endsAtLabel}.` : "",
    ].filter(Boolean),
    details: [
      ...(vars.offerLabel ? [{ label: "Highlight", value: vars.offerLabel }] : []),
      ...(vars.endsAtLabel ? [{ label: "Ends", value: vars.endsAtLabel }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Shop the edit",
      href: vars.ctaUrl || `${appUrl}/flash-sale`,
    },
    unsubscribeUrl: vars.unsubscribeUrl || `${appUrl}/account/settings`,
  };
}

export function buildMarketingPromotion(vars: MarketingEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: vars.campaignName || vars.headline || "A new arrival from VERONICA MARK",
    previewText: vars.offerLabel || "Discover what is new in the curated edit.",
    eyebrow: "From the house",
    heading: vars.headline || "Something new for you",
    paragraphs: [
      greet(vars.recipientName),
      vars.body ||
        "A new selection has joined the VERONICA MARK edit. Explore trusted brands and exceptional pieces chosen with care.",
      vars.offerLabel ? vars.offerLabel : "",
    ].filter(Boolean),
    cta: {
      label: vars.ctaLabel || "Discover now",
      href: vars.ctaUrl || appUrl,
    },
    unsubscribeUrl: vars.unsubscribeUrl || `${appUrl}/account/settings`,
  };
}

export function buildMarketingNewsletter(vars: MarketingEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: vars.campaignName || vars.headline || "Notes from VERONICA MARK",
    previewText: vars.body?.slice(0, 90) || "Curated notes from the house.",
    eyebrow: "Journal",
    heading: vars.headline || "Notes from the house",
    paragraphs: [
      greet(vars.recipientName),
      vars.body ||
        "This edition brings curated arrivals, fragrance stories and a quiet look at what is next in the edit.",
    ],
    cta: {
      label: vars.ctaLabel || "Read more",
      href: vars.ctaUrl || appUrl,
    },
    unsubscribeUrl: vars.unsubscribeUrl || `${appUrl}/account/settings`,
  };
}

export function buildBrandLowStock(vars: BrandOpsEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `Low stock · ${vars.productName || vars.sku || vars.brandName}`,
    previewText: "A variant has fallen below its reorder threshold.",
    eyebrow: "Brand operations",
    heading: "Low stock alert",
    paragraphs: [
      greet(vars.recipientName),
      `Inventory for ${vars.brandName} needs attention.`,
      vars.productName
        ? `${vars.productName}${vars.sku ? ` (${vars.sku})` : ""} is below the reorder threshold.`
        : "A variant has fallen below its defined reorder threshold.",
    ],
    details: [
      { label: "Brand", value: vars.brandName },
      ...(vars.productName ? [{ label: "Product", value: vars.productName }] : []),
      ...(vars.sku ? [{ label: "SKU", value: vars.sku }] : []),
      ...(vars.stockLevel != null ? [{ label: "Stock", value: String(vars.stockLevel) }] : []),
      ...(vars.threshold != null ? [{ label: "Threshold", value: String(vars.threshold) }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Open inventory",
      href: vars.ctaUrl || `${appUrl}/brand/inventory`,
    },
    tone: "warning",
  };
}

export function buildBrandNewOrder(vars: BrandOpsEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: vars.orderNumber
      ? `New order · ${vars.orderNumber}`
      : `New order · ${vars.brandName}`,
    previewText: "A new order has entered your fulfillment queue.",
    eyebrow: "Brand operations",
    heading: "New order received",
    paragraphs: [
      greet(vars.recipientName),
      `A new order for ${vars.brandName} is ready in your fulfillment queue.`,
      "Please review line items and advance packing when ready.",
    ],
    details: [
      { label: "Brand", value: vars.brandName },
      ...(vars.orderNumber ? [{ label: "Order", value: vars.orderNumber }] : []),
      ...(vars.orderTotalLabel ? [{ label: "Total", value: vars.orderTotalLabel }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Open orders",
      href:
        vars.ctaUrl ||
        (vars.orderNumber
          ? `${appUrl}/brand/orders/${vars.orderNumber}`
          : `${appUrl}/brand/orders`),
    },
  };
}

export function buildBrandFlashSaleAlert(vars: BrandOpsEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: vars.flashSaleName
      ? `Flash sale update · ${vars.flashSaleName}`
      : `Flash sale update · ${vars.brandName}`,
    previewText: "A material change during your live flash sale.",
    eyebrow: "Brand operations",
    heading: "Flash sale performance alert",
    paragraphs: [
      greet(vars.recipientName),
      `A notable update occurred during a live flash sale for ${vars.brandName}.`,
      vars.flashSaleName
        ? `Campaign: ${vars.flashSaleName}.`
        : "Review performance in your brand dashboard.",
    ],
    details: [
      { label: "Brand", value: vars.brandName },
      ...(vars.flashSaleName ? [{ label: "Sale", value: vars.flashSaleName }] : []),
      ...(vars.metricLabel && vars.metricValue
        ? [{ label: vars.metricLabel, value: vars.metricValue }]
        : []),
    ],
    cta: {
      label: vars.ctaLabel || "View flash sales",
      href: vars.ctaUrl || `${appUrl}/brand/flash-sales`,
    },
  };
}

export function buildContactAutoReply(
  vars: ContactEmailVars & { ctaUrl?: string; ctaLabel?: string },
): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `We received your message · ${vars.subject}`,
    previewText: "Thank you — client services will respond shortly.",
    eyebrow: "Client services",
    heading: "We have received your message",
    paragraphs: [
      greet(vars.senderName || vars.recipientName),
      "Thank you for contacting VERONICA MARK. Your message has been received by client services.",
      "We aim to respond within one business day. For order questions, please include your order reference.",
    ],
    details: [
      { label: "Subject", value: vars.subject },
      ...(vars.topic ? [{ label: "Topic", value: vars.topic }] : []),
      ...(vars.orderNumber ? [{ label: "Order", value: vars.orderNumber }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Visit VERONICA MARK",
      href: vars.ctaUrl || appUrl,
    },
  };
}

export function buildContactInternalNotify(vars: ContactEmailVars): EmailContent {
  return {
    subject: `[Contact] ${vars.subject}`,
    previewText: `New contact message from ${vars.senderName}.`,
    eyebrow: "Internal",
    heading: "New contact form message",
    paragraphs: [
      "Dear Client services,",
      "A new message was submitted via the VERONICA MARK contact form. Full details are below.",
      vars.message,
    ],
    details: [
      { label: "From", value: vars.senderName },
      { label: "Email", value: vars.senderEmail },
      { label: "Subject", value: vars.subject },
      ...(vars.topic ? [{ label: "Topic", value: vars.topic }] : []),
      ...(vars.orderNumber ? [{ label: "Order", value: vars.orderNumber }] : []),
    ],
  };
}

export function buildAdminEvent(vars: AdminEventVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `[Admin] ${vars.eventTitle}`,
    previewText: vars.summary,
    eyebrow: "Admin notification",
    heading: vars.eventTitle,
    paragraphs: [
      greet(vars.recipientName || "Client services"),
      vars.summary,
      ...(vars.messageBody ? [vars.messageBody] : []),
    ],
    details: vars.details,
    items: vars.items,
    cta: vars.ctaUrl
      ? {
          label: vars.ctaLabel || "Open admin",
          href: vars.ctaUrl,
        }
      : {
          label: "Open admin",
          href: `${appUrl}/admin`,
        },
  };
}
