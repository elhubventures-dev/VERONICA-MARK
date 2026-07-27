import { describe, expect, it } from "vitest";

import { OrderStatus, type Currency } from "@prisma/client";

import {
  buildOrderEmailVars,
  formatOrderMoney,
  resolveOrderRecipient,
} from "@/lib/email/order-email-vars";
import type { OrderWithRelations } from "@/lib/repositories/order.repository";

function mockOrder(overrides: Partial<OrderWithRelations> = {}): OrderWithRelations {
  return {
    id: "ord-1",
    orderNumber: "VM-2026-0001",
    customerId: "cust-1",
    currency: "NGN" as Currency,
    status: OrderStatus.PAID,
    subtotal: 85000 as never,
    tax: 0 as never,
    shippingFee: 3500 as never,
    discount: 0 as never,
    total: 88500 as never,
    notes: "SHIPPING_METHOD:intra_city",
    shippingAddress: {
      name: "Camille Dubois",
      email: "guest@example.com",
      line1: "12 Ada George Rd",
      city: "Port Harcourt",
      state: "Rivers",
      postalCode: "500001",
      country: "NG",
    },
    billingAddress: {},
    couponId: null,
    placedAt: new Date(),
    completedAt: null,
    cancelledAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    items: [
      {
        id: "item-1",
        orderId: "ord-1",
        variantId: "var-1",
        productName: "Noir Éclat Eau de Parfum",
        variantName: "100 ml",
        sku: "VM-NE-100",
        quantity: 1,
        unitPrice: 85000 as never,
        compareAtPrice: null,
        taxAmount: 0 as never,
        discountAmount: 0 as never,
        lineTotal: 85000 as never,
        preorderEstimatedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        variant: null,
      },
    ],
    customer: {
      id: "cust-1",
      userId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      user: {
        id: "user-1",
        email: "customer@example.com",
        firstName: "Camille",
        lastName: "Dubois",
      } as OrderWithRelations["customer"]["user"],
    } as OrderWithRelations["customer"],
    statusHistory: [],
    payments: [],
    shipments: [],
    ...overrides,
  } as OrderWithRelations;
}

describe("order email helpers", () => {
  it("formats NGN amounts for email copy", () => {
    expect(formatOrderMoney(88500, "NGN")).toMatch(/88,?500/);
  });

  it("prefers account email over shipping guest email", () => {
    const recipient = resolveOrderRecipient(mockOrder());
    expect(recipient.email).toBe("customer@example.com");
    expect(recipient.name).toContain("Camille");
  });

  it("falls back to shipping email when account email is missing", () => {
    const recipient = resolveOrderRecipient(
      mockOrder({
        customer: {
          id: "cust-1",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          user: {
            id: "user-1",
            email: "",
            firstName: "",
            lastName: "",
          } as unknown as OrderWithRelations["customer"]["user"],
        } as OrderWithRelations["customer"],
      }),
    );
    expect(recipient.email).toBe("guest@example.com");
  });

  it("builds confirmation vars with invoice and shipping method", () => {
    const vars = buildOrderEmailVars(mockOrder());
    expect(vars.orderNumber).toBe("VM-2026-0001");
    expect(vars.shippingMethod).toContain("Intra-city");
    expect(vars.invoiceUrl).toContain("/invoices/VM-2026-0001");
    expect(vars.items?.[0]?.name).toContain("Noir Éclat");
    expect(vars.currencyNote).toContain("include tax");
  });
});
