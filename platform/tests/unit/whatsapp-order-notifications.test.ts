import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { OrderStatus } from "@prisma/client";

import {
  normalizeWhatsAppPhone,
  resolveOrderWhatsAppPhone,
} from "@/lib/whatsapp/phone";

vi.mock("server-only", () => ({}));

describe("normalizeWhatsAppPhone", () => {
  it("converts Nigerian local 0-prefixed numbers to 234…", () => {
    expect(normalizeWhatsAppPhone("0803 123 4567")).toBe("2348031234567");
    expect(normalizeWhatsAppPhone("+234 803 123 4567")).toBe("2348031234567");
    expect(normalizeWhatsAppPhone("2348031234567")).toBe("2348031234567");
  });

  it("accepts bare 10-digit NG mobiles", () => {
    expect(normalizeWhatsAppPhone("8031234567")).toBe("2348031234567");
  });

  it("returns null for empty or invalid", () => {
    expect(normalizeWhatsAppPhone("")).toBeNull();
    expect(normalizeWhatsAppPhone("123")).toBeNull();
    expect(normalizeWhatsAppPhone(null)).toBeNull();
  });
});

describe("resolveOrderWhatsAppPhone", () => {
  it("prefers shipping address phone", () => {
    expect(
      resolveOrderWhatsAppPhone({
        shippingAddress: { phone: "08085183747" },
        customer: { user: { phone: "08031234567" } },
      }),
    ).toBe("2348085183747");
  });

  it("falls back to user phone", () => {
    expect(
      resolveOrderWhatsAppPhone({
        shippingAddress: {},
        customer: { user: { phone: "+2348031234567" } },
      }),
    ).toBe("2348031234567");
  });
});

describe("WhatsApp order template mapping", () => {
  beforeEach(() => {
    vi.stubEnv("TWILIO_CONTENT_SID_ORDER_PAID", "HXpaid");
    vi.stubEnv("TWILIO_CONTENT_SID_ORDER_SHIPPED", "HXshipped");
    vi.stubEnv("TWILIO_CONTENT_SID_ORDER_OUT_FOR_DELIVERY", "HXofd");
    vi.stubEnv("TWILIO_CONTENT_SID_ORDER_DELIVERED", "HXdelivered");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("maps statuses to Content SIDs and builds numbered variables", async () => {
    const {
      buildWhatsAppTemplateData,
      isWhatsAppOrderStatus,
      resolveWhatsAppContentSid,
    } = await import("@/lib/whatsapp/order-notifications");

    expect(isWhatsAppOrderStatus(OrderStatus.PAID)).toBe(true);
    expect(isWhatsAppOrderStatus(OrderStatus.PROCESSING)).toBe(false);

    expect(resolveWhatsAppContentSid(OrderStatus.PAID)).toBe("HXpaid");
    expect(resolveWhatsAppContentSid(OrderStatus.SHIPPED)).toBe("HXshipped");
    expect(resolveWhatsAppContentSid(OrderStatus.OUT_FOR_DELIVERY)).toBe("HXofd");
    expect(resolveWhatsAppContentSid(OrderStatus.DELIVERED)).toBe("HXdelivered");
    expect(resolveWhatsAppContentSid(OrderStatus.PROCESSING)).toBeNull();

    expect(
      buildWhatsAppTemplateData(OrderStatus.PAID, {
        recipientName: "Camille",
        orderNumber: "VM-2026-0001",
        orderTotalLabel: "₦88,500",
        trackingUrl: "https://www.veronicamark.com/track-order",
      }),
    ).toEqual({
      "1": "Camille",
      "2": "VM-2026-0001",
      "3": "₦88,500",
      "4": "https://www.veronicamark.com/track-order",
    });

    expect(
      buildWhatsAppTemplateData(OrderStatus.SHIPPED, {
        recipientName: "Camille",
        orderNumber: "VM-2026-0001",
        trackingUrl: "https://www.veronicamark.com/track-order",
      }),
    ).toEqual({
      "1": "Camille",
      "2": "VM-2026-0001",
      "3": "https://www.veronicamark.com/track-order",
    });

    expect(
      buildWhatsAppTemplateData(OrderStatus.DELIVERED, {
        orderNumber: "VM-2026-0001",
      }),
    ).toEqual({
      "1": "there",
      "2": "VM-2026-0001",
    });
  });
});

describe("sendTwilioWhatsAppTemplate payload", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("POSTs Twilio Messages API with ContentSid and ContentVariables", async () => {
    vi.stubEnv("TWILIO_ACCOUNT_SID", "ACtest123");
    vi.stubEnv("TWILIO_AUTH_TOKEN", "auth_test_token");
    vi.stubEnv("TWILIO_WHATSAPP_FROM", "whatsapp:+2348085183747");

    const fetchMock = vi.fn(
      async (_url: string, _init?: RequestInit): Promise<Response> =>
        new Response(
          JSON.stringify({
            sid: "SMtestmessage",
            status: "queued",
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { sendTwilioWhatsAppTemplate, toTwilioWhatsAppAddress } = await import(
      "@/lib/whatsapp/twilio"
    );

    expect(toTwilioWhatsAppAddress("2348031234567")).toBe("whatsapp:+2348031234567");

    const result = await sendTwilioWhatsAppTemplate({
      phoneNumber: "2348031234567",
      contentSid: "HXpaid",
      variables: { "1": "Camille", "2": "VM-1" },
      context: { orderNumber: "VM-1" },
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.messageId).toBe("SMtestmessage");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.twilio.com/2010-04-01/Accounts/ACtest123/Messages.json");
    expect(init?.method).toBe("POST");
    expect(String(init?.headers && (init.headers as Record<string, string>).Authorization)).toMatch(
      /^Basic /,
    );
    const params = new URLSearchParams(String(init?.body));
    expect(params.get("To")).toBe("whatsapp:+2348031234567");
    expect(params.get("From")).toBe("whatsapp:+2348085183747");
    expect(params.get("ContentSid")).toBe("HXpaid");
    expect(params.get("ContentVariables")).toBe(JSON.stringify({ "1": "Camille", "2": "VM-1" }));
  });

  it("skips when Twilio is not configured", async () => {
    vi.stubEnv("TWILIO_ACCOUNT_SID", "");
    vi.stubEnv("TWILIO_AUTH_TOKEN", "");
    vi.stubEnv("TWILIO_WHATSAPP_FROM", "");

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { sendTwilioWhatsAppTemplate } = await import("@/lib/whatsapp/twilio");
    const result = await sendTwilioWhatsAppTemplate({
      phoneNumber: "2348031234567",
      contentSid: "HXpaid",
      variables: { "1": "Camille" },
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.skipped).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("notifyCustomerOrderWhatsApp", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it("skips when phone is missing", async () => {
    vi.stubEnv("TWILIO_ACCOUNT_SID", "ACtest123");
    vi.stubEnv("TWILIO_AUTH_TOKEN", "auth_test_token");
    vi.stubEnv("TWILIO_WHATSAPP_FROM", "whatsapp:+2348085183747");
    vi.stubEnv("TWILIO_CONTENT_SID_ORDER_PAID", "HXpaid");

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { notifyCustomerOrderWhatsApp } = await import("@/lib/whatsapp/order-notifications");
    await notifyCustomerOrderWhatsApp(
      {
        orderNumber: "VM-2026-0001",
        shippingAddress: {},
        customer: { user: { phone: null, email: "a@b.com", firstName: "A", lastName: "B" } },
        currency: "NGN",
        total: 1000,
        items: [],
        shipments: [],
      } as never,
      OrderStatus.PAID,
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
