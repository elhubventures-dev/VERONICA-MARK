import { describe, expect, it, vi } from "vitest";

import { renderEmail } from "@/emails";

vi.mock("server-only", () => ({}));

vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: vi.fn(async () => ({ data: { id: "msg_test" }, error: null })),
    };
  },
}));

describe("shared email dispatch", () => {
  it("sendTemplateEmail renders then dispatches via Resend when configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("EMAIL_FROM", "VERONICA MARK <sales@veronicamark.com>");

    const { sendTemplateEmail } = await import("@/lib/email/send");
    const result = await sendTemplateEmail("order.confirmation", "buyer@example.com", {
      orderNumber: "VM-2026-0001",
      orderTotalLabel: "₦88,500",
      recipientName: "Camille",
    });

    expect(result.ok).toBe(true);
    expect(result.rendered?.subject).toContain("VM-2026-0001");
    expect(result.rendered?.html).toContain("VERONICA MARK");
  });

  it("matches auth template subjects used by Resend sends", () => {
    const verify = renderEmail("auth.email_verification", {
      ctaUrl: "https://www.veronicamark.com/auth/verify-email?token=x",
    });
    expect(verify.subject).toBe("Verify your VERONICA MARK account");
  });
});
