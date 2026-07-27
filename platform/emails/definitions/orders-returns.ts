import { greet, resolveAppUrl } from "@/emails/layout";
import type { EmailContent, OrderEmailVars, RefundEmailVars, ReturnEmailVars } from "@/emails/types";

function orderDetails(vars: OrderEmailVars) {
  const rows = [{ label: "Order", value: vars.orderNumber }];
  if (vars.orderTotalLabel) rows.push({ label: "Total", value: vars.orderTotalLabel });
  if (vars.shippingMethod) rows.push({ label: "Shipping", value: vars.shippingMethod });
  if (vars.estimatedDelivery) rows.push({ label: "Estimate", value: vars.estimatedDelivery });
  if (vars.trackingNumber) rows.push({ label: "Tracking", value: vars.trackingNumber });
  if (vars.shippingAddress) rows.push({ label: "Deliver to", value: vars.shippingAddress });
  if (vars.currencyNote) rows.push({ label: "Note", value: vars.currencyNote });
  return rows;
}

function orderCta(vars: OrderEmailVars, fallbackLabel: string, fallbackPath: string) {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    label: vars.ctaLabel || fallbackLabel,
    href: vars.ctaUrl || `${appUrl}${fallbackPath}`,
  };
}

export function buildOrderConfirmation(vars: OrderEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  const invoiceUrl = vars.invoiceUrl || `${appUrl}/invoices/${vars.orderNumber}`;
  return {
    subject: `Order confirmed · ${vars.orderNumber}`,
    previewText: `Thank you — your order ${vars.orderNumber} is confirmed.`,
    eyebrow: "Order confirmation",
    heading: "Thank you for your order",
    paragraphs: [
      greet(vars.recipientName),
      `Your VERONICA MARK order ${vars.orderNumber} is confirmed. Keep this reference for tracking, invoices and any follow-up with client services.`,
      "All product prices include tax. You can open your invoice from the link below or from your account when signed in.",
    ],
    details: orderDetails(vars),
    items: vars.items,
    cta: {
      label: vars.ctaLabel || "View invoice",
      href: vars.ctaUrl || invoiceUrl,
    },
    secondaryNote: `Track anytime with your order reference and email at ${appUrl}/track-order.`,
  };
}

export function buildOrderPaymentFailed(vars: OrderEmailVars): EmailContent {
  return {
    subject: `Payment unsuccessful · ${vars.orderNumber}`,
    previewText: "Your payment could not be completed. You may try again.",
    eyebrow: "Payment",
    heading: "Payment was not completed",
    paragraphs: [
      greet(vars.recipientName),
      `We could not complete payment for order ${vars.orderNumber}. No charge has been finalised for this attempt.`,
      "You may return to checkout and try again with the same or another payment method. If funds were reserved by your bank, they typically release automatically.",
    ],
    details: orderDetails(vars),
    items: vars.items,
    cta: orderCta(vars, "Return to checkout", "/checkout"),
    tone: "warning",
  };
}

export function buildOrderProcessing(vars: OrderEmailVars): EmailContent {
  return {
    subject: `Preparing your order · ${vars.orderNumber}`,
    previewText: "Your order is being prepared with care.",
    eyebrow: "Order update",
    heading: "Your order is being prepared",
    paragraphs: [
      greet(vars.recipientName),
      `Order ${vars.orderNumber} is now in preparation. Our team is carefully assembling your selection.`,
      "You will receive another message when your order is packed and ready for dispatch.",
    ],
    details: orderDetails(vars),
    items: vars.items,
    cta: orderCta(vars, "View order", `/account/orders/${vars.orderNumber}`),
  };
}

export function buildOrderPacked(vars: OrderEmailVars): EmailContent {
  return {
    subject: `Order packed · ${vars.orderNumber}`,
    previewText: "Your order is packed and nearly on its way.",
    eyebrow: "Order update",
    heading: "Your order is packed",
    paragraphs: [
      greet(vars.recipientName),
      `Order ${vars.orderNumber} has been packed and is ready for dispatch.`,
      "You will receive tracking details as soon as the courier collects your parcel.",
    ],
    details: orderDetails(vars),
    items: vars.items,
    cta: orderCta(vars, "View order", `/account/orders/${vars.orderNumber}`),
  };
}

export function buildOrderShipped(vars: OrderEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `Your order is on its way · ${vars.orderNumber}`,
    previewText: "Dispatch confirmation with tracking details.",
    eyebrow: "Dispatch",
    heading: "Your order has shipped",
    paragraphs: [
      greet(vars.recipientName),
      `Order ${vars.orderNumber} has left our care and is on its way to you.`,
      vars.estimatedDelivery
        ? `Estimated delivery: ${vars.estimatedDelivery}.`
        : "Estimated delivery timing was shown at checkout for your selected method.",
    ],
    details: orderDetails(vars),
    items: vars.items,
    cta: {
      label: vars.ctaLabel || "Track shipment",
      href: vars.ctaUrl || vars.trackingUrl || `${appUrl}/track-order`,
    },
  };
}

export function buildOrderOutForDelivery(vars: OrderEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `Out for delivery · ${vars.orderNumber}`,
    previewText: "Your parcel is out for delivery today.",
    eyebrow: "Delivery",
    heading: "Out for delivery",
    paragraphs: [
      greet(vars.recipientName),
      `Good news — order ${vars.orderNumber} is out for delivery.`,
      "Please ensure someone is available to receive the parcel where possible.",
    ],
    details: orderDetails(vars),
    cta: {
      label: vars.ctaLabel || "Track shipment",
      href: vars.ctaUrl || vars.trackingUrl || `${appUrl}/track-order`,
    },
  };
}

export function buildOrderDelivered(vars: OrderEmailVars): EmailContent {
  return {
    subject: `Delivered · ${vars.orderNumber}`,
    previewText: "Your VERONICA MARK order has been delivered.",
    eyebrow: "Delivered",
    heading: "Your order has arrived",
    paragraphs: [
      greet(vars.recipientName),
      `Order ${vars.orderNumber} has been marked as delivered. We hope every piece delights you.`,
      "If anything is missing or not as expected, contact client services with your order reference and we will assist promptly.",
    ],
    details: orderDetails(vars),
    items: vars.items,
    cta: orderCta(vars, "View order", `/account/orders/${vars.orderNumber}`),
    tone: "success",
  };
}

export function buildOrderCancelled(vars: OrderEmailVars): EmailContent {
  return {
    subject: `Order cancelled · ${vars.orderNumber}`,
    previewText: "Your order has been cancelled.",
    eyebrow: "Order update",
    heading: "Order cancelled",
    paragraphs: [
      greet(vars.recipientName),
      `Order ${vars.orderNumber} has been cancelled.`,
      vars.cancelReason
        ? `Reason: ${vars.cancelReason}`
        : "If a payment was taken, any refund will follow our standard processing timeline.",
      "We would be pleased to welcome you back whenever you are ready to browse the edit again.",
    ],
    details: orderDetails(vars),
    items: vars.items,
    cta: orderCta(vars, "Continue shopping", "/"),
    tone: "warning",
  };
}

export function buildOrderCompleted(vars: OrderEmailVars): EmailContent {
  return {
    subject: `Thank you · ${vars.orderNumber}`,
    previewText: "Your order is complete — thank you for shopping with us.",
    eyebrow: "Completed",
    heading: "Thank you for shopping with us",
    paragraphs: [
      greet(vars.recipientName),
      `Order ${vars.orderNumber} is now complete. Thank you for choosing VERONICA MARK.`,
      "We hope your selection brings lasting pleasure. When you are ready, we would love to hear your thoughts.",
    ],
    details: orderDetails(vars),
    cta: orderCta(vars, "Browse the edit", "/"),
    tone: "success",
  };
}

export function buildReturnRequested(vars: ReturnEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `Return received · ${vars.returnNumber}`,
    previewText: "We have received your return request.",
    eyebrow: "Returns",
    heading: "Return request received",
    paragraphs: [
      greet(vars.recipientName),
      `We have received return request ${vars.returnNumber} for order ${vars.orderNumber}.`,
      "Our team will review your request and update you shortly. Please do not ship items until your return is approved.",
    ],
    details: [
      { label: "Return", value: vars.returnNumber },
      { label: "Order", value: vars.orderNumber },
      ...(vars.reason ? [{ label: "Reason", value: vars.reason }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "View return",
      href: vars.ctaUrl || `${appUrl}/account/returns/${vars.returnNumber}`,
    },
  };
}

export function buildReturnApproved(vars: ReturnEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `Return approved · ${vars.returnNumber}`,
    previewText: "Your return has been approved — packing instructions inside.",
    eyebrow: "Returns",
    heading: "Return approved",
    paragraphs: [
      greet(vars.recipientName),
      `Return ${vars.returnNumber} for order ${vars.orderNumber} has been approved.`,
      vars.instructions ||
        "Please pack the item securely in its original packaging where possible. Client services will advise the return shipping method for your case.",
    ],
    details: [
      { label: "Return", value: vars.returnNumber },
      { label: "Order", value: vars.orderNumber },
    ],
    cta: {
      label: vars.ctaLabel || "View return instructions",
      href: vars.ctaUrl || `${appUrl}/account/returns/${vars.returnNumber}`,
    },
    tone: "success",
  };
}

export function buildReturnRejected(vars: ReturnEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `Return update · ${vars.returnNumber}`,
    previewText: "An update on your return request.",
    eyebrow: "Returns",
    heading: "Return request update",
    paragraphs: [
      greet(vars.recipientName),
      `After review, return ${vars.returnNumber} for order ${vars.orderNumber} could not be approved.`,
      vars.reason ||
        "If you have questions about this decision, reply via client services with your return and order references.",
    ],
    details: [
      { label: "Return", value: vars.returnNumber },
      { label: "Order", value: vars.orderNumber },
      ...(vars.reason ? [{ label: "Note", value: vars.reason }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Contact client services",
      href: vars.ctaUrl || `${appUrl}/contact`,
    },
    tone: "warning",
  };
}

export function buildRefundProcessed(vars: RefundEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `Refund processed · ${vars.orderNumber}`,
    previewText: `A refund of ${vars.refundAmountLabel} has been issued.`,
    eyebrow: "Refund",
    heading: "Your refund has been processed",
    paragraphs: [
      greet(vars.recipientName),
      `A refund of ${vars.refundAmountLabel} for order ${vars.orderNumber} has been processed.`,
      vars.refundMethod
        ? `Refund method: ${vars.refundMethod}. Bank timelines may vary by provider.`
        : "Refunds to the original payment method may take several business days to appear, depending on your bank.",
    ],
    details: [
      { label: "Order", value: vars.orderNumber },
      { label: "Amount", value: vars.refundAmountLabel },
      ...(vars.refundMethod ? [{ label: "Method", value: vars.refundMethod }] : []),
      ...(vars.refundReference ? [{ label: "Reference", value: vars.refundReference }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "View order",
      href: vars.ctaUrl || `${appUrl}/account/orders/${vars.orderNumber}`,
    },
    tone: "success",
  };
}
