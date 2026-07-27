import { describe, expect, it } from "vitest";

import { EMAIL_TEMPLATE_KEYS, listEmailTemplates, renderEmail } from "@/emails";
import { escapeHtml } from "@/emails/layout";
import { emailPreviewSamples } from "@/emails/preview-samples";

describe("email templates catalog", () => {
  it("registers all 40 approved template keys", () => {
    expect(EMAIL_TEMPLATE_KEYS).toHaveLength(40);
    expect(listEmailTemplates()).toHaveLength(40);
  });

  it("renders every template from preview samples without throwing", () => {
    for (const key of EMAIL_TEMPLATE_KEYS) {
      const rendered = renderEmail(key, emailPreviewSamples[key]);
      expect(rendered.key).toBe(key);
      expect(rendered.subject.length).toBeGreaterThan(0);
      expect(rendered.html).toContain("VERONICA MARK");
      expect(rendered.text).toContain("VERONICA MARK");
    }
  });

  it("renders auth verification with escaped HTML and CTA", () => {
    const rendered = renderEmail("auth.email_verification", {
      recipientName: `Ada <script>`,
      ctaUrl: "https://www.veronicamark.com/auth/verify-email?token=abc",
      expiresIn: "one hour",
    });

    expect(rendered.subject).toContain("Verify");
    expect(rendered.html).toContain("VERONICA MARK");
    expect(rendered.html).toContain(escapeHtml("Ada <script>"));
    expect(rendered.html).not.toContain("<script>");
    expect(rendered.html).toContain("https://www.veronicamark.com/auth/verify-email?token=abc");
    expect(rendered.text).toContain("Verify email:");
  });

  it("renders order confirmation with invoice path and line items", () => {
    const rendered = renderEmail("order.confirmation", {
      recipientName: "Camille",
      orderNumber: "VM-2026-0001",
      orderTotalLabel: "₦85,000",
      currencyNote: "All product prices include tax.",
      items: [{ name: "Noir Éclat Eau de Parfum", quantity: 1, priceLabel: "₦85,000" }],
      invoiceUrl: "https://www.veronicamark.com/invoices/VM-2026-0001",
    });

    expect(rendered.subject).toBe("Order confirmed · VM-2026-0001");
    expect(rendered.html).toContain("₦85,000");
    expect(rendered.html).toContain("Noir Éclat Eau de Parfum");
    expect(rendered.text).toContain("Order: VM-2026-0001");
  });

  it("includes unsubscribe footer on marketing templates", () => {
    const rendered = renderEmail("marketing.flash_sale", {
      ctaUrl: "https://www.veronicamark.com/flash-sale",
      headline: "August Grand Opening",
      unsubscribeUrl: "https://www.veronicamark.com/account/settings",
    });

    expect(rendered.html).toContain("Update email preferences");
    expect(rendered.text).toContain("Email preferences:");
  });
});
