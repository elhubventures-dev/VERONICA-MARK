import "server-only";

import { Currency, OrderStatus, PaymentProvider, PaymentStatus, UserRole, type Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import {
  isNigeriaCountry,
  isShippingMethodId,
  quoteShipping,
  shippingFeeNgn,
} from "@/lib/commerce/shipping-rates";
import { withTransaction } from "@/lib/db/transactions";
import {
  notifyCustomerOrderStatus,
  notifyCustomerPaymentFailed,
} from "@/lib/email/order-notifications";
import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import {
  createPaystackReference,
  initializePaystackTransaction,
  isPaystackConfigured,
  verifyPaystackTransaction,
} from "@/lib/payments/paystack";
import { prisma } from "@/lib/prisma";
import { InventoryRepository } from "@/lib/repositories/inventory.repository";
import { orderRepository } from "@/lib/repositories/order.repository";
import { paymentRepository } from "@/lib/repositories/payment.repository";
import { recomputeTotals } from "@/lib/services/checkout.service";
import { absoluteUrl } from "@/lib/seo/metadata";

export type CheckoutLinePayload = {
  variantId: string;
  quantity: number;
  product: {
    slug: string;
    name: string;
    brand: string;
    image: string;
    variantLabel: string;
    price: number;
  };
};

export type CheckoutShippingPayload = {
  email: string;
  name: string;
  phone: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
};

export type InitializeCheckoutInput = {
  shipping: CheckoutShippingPayload;
  shippingMethod: "intra_city" | "interstate" | "express" | "international";
  lines: CheckoutLinePayload[];
  couponCode?: string | null;
  couponDiscount?: number;
  notes?: string;
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Guest",
    lastName: parts.slice(1).join(" ") || "Customer",
  };
}

function buildOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `VM-${stamp}-${rand}`;
}

async function ensureGuestCustomer(email: string, fullName: string, phone: string) {
  const normalized = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();
  const { firstName, lastName } = splitName(fullName);

  const existing = await prisma.user.findFirst({
    where: { email: normalized, deletedAt: null },
    include: { customerProfile: true },
  });

  if (existing?.customerProfile) {
    if (normalizedPhone && existing.phone !== normalizedPhone) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { phone: normalizedPhone },
      });
    }
    return existing.customerProfile;
  }

  if (existing && !existing.customerProfile) {
    if (normalizedPhone && existing.phone !== normalizedPhone) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { phone: normalizedPhone },
      });
    }
    return prisma.customerProfile.create({
      data: { userId: existing.id },
    });
  }

  const user = await prisma.user.create({
    data: {
      email: normalized,
      firstName,
      lastName,
      phone: normalizedPhone || undefined,
      role: UserRole.CUSTOMER,
      preferredCurrency: Currency.NGN,
      customerProfile: { create: {} },
    },
    include: { customerProfile: true },
  });

  if (!user.customerProfile) {
    throw new AppError("Failed to create customer profile", { statusCode: 500 });
  }

  return user.customerProfile;
}

function computeCheckoutTotals(input: InitializeCheckoutInput) {
  if (!isShippingMethodId(input.shippingMethod)) {
    throw new ValidationError("Invalid shipping method");
  }

  const quote = quoteShipping({
    country: input.shipping.country,
    state: input.shipping.state,
    methodId: input.shippingMethod,
  });

  if (quote.methodId !== input.shippingMethod) {
    throw new ValidationError("Shipping method is not available for this destination");
  }

  if (!isNigeriaCountry(input.shipping.country) && input.shippingMethod !== "international") {
    throw new ValidationError("International destinations require international shipping");
  }

  if (isNigeriaCountry(input.shipping.country) && input.shippingMethod === "international") {
    throw new ValidationError("International shipping is only available outside Nigeria");
  }

  const shippingFee = shippingFeeNgn({
    country: input.shipping.country,
    state: input.shipping.state,
    methodId: input.shippingMethod,
  });

  return recomputeTotals({
    items: input.lines.map((line) => ({
      variantId: line.variantId,
      quantity: line.quantity,
      unitPrice: line.product.price,
    })),
    taxRatePercent: 0,
    shippingFee,
    couponDiscount: input.couponDiscount ?? 0,
  });
}

function aggregateQuantities(
  items: Array<{ variantId: string; quantity: number }>,
): Map<string, number> {
  const qtyByVariant = new Map<string, number>();
  for (const item of items) {
    qtyByVariant.set(item.variantId, (qtyByVariant.get(item.variantId) ?? 0) + item.quantity);
  }
  return qtyByVariant;
}

/**
 * Create guest order + pending Paystack payment, then return authorization URL.
 * Catalog line items are stored as JSON on the order (demo variants may not exist in Prisma).
 * Charge currency is NGN (Paystack). Amount uses the same major-unit total as the bag.
 */
export async function initializePaystackCheckout(input: InitializeCheckoutInput) {
  if (!isPaystackConfigured()) {
    throw new AppError("Paystack is not configured. Set PAYSTACK_SECRET_KEY in the environment.", {
      code: "PAYSTACK_NOT_CONFIGURED",
      statusCode: 503,
    });
  }

  if (!input.lines.length) {
    throw new ValidationError("Your bag is empty");
  }

  const email = input.shipping.email.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("A valid email is required");
  }
  if (!input.shipping.name.trim()) {
    throw new ValidationError("Full name is required");
  }
  const phone = input.shipping.phone.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone || phoneDigits.length < 7 || phoneDigits.length > 15) {
    throw new ValidationError("A valid phone number is required");
  }
  if (isNigeriaCountry(input.shipping.country) && !input.shipping.state?.trim()) {
    throw new ValidationError("State is required for Nigerian deliveries");
  }

  const totals = computeCheckoutTotals(input);
  const amountMajor = Number(totals.total.toFixed(2));
  if (amountMajor <= 0) {
    throw new ValidationError("Order total must be greater than zero");
  }

  const customer = await ensureGuestCustomer(email, input.shipping.name, phone);
  const orderNumber = buildOrderNumber();
  const reference = createPaystackReference(orderNumber);

  const regionLabel = input.shipping.state?.trim() || input.shipping.country;
  const address = {
    name: input.shipping.name,
    phone,
    line1: input.shipping.line1?.trim() || regionLabel,
    line2: input.shipping.line2 || undefined,
    city: input.shipping.city?.trim() || regionLabel,
    state: input.shipping.state || undefined,
    postalCode: undefined,
    country: input.shipping.country,
    email,
  };

  const cartSnapshot = input.lines.map((line) => ({
    variantId: line.variantId,
    quantity: line.quantity,
    slug: line.product.slug,
    name: line.product.name,
    brand: line.product.brand,
    variantLabel: line.product.variantLabel,
    unitPrice: line.product.price,
    image: line.product.image,
  }));

  const variantIds = [...new Set(input.lines.map((l) => l.variantId))];
  const existingVariants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds }, deletedAt: null, active: true },
    select: {
      id: true,
      sku: true,
      sizeLabel: true,
      colorLabel: true,
      price: true,
      salePrice: true,
      product: { select: { name: true } },
      inventory: { select: { available: true } },
    },
  });
  const variantById = new Map(existingVariants.map((v) => [v.id, v]));

  const orderItems = input.lines
    .map((line) => {
      const variant = variantById.get(line.variantId);
      if (!variant) return null;
      return {
        variantId: variant.id,
        productName: line.product.name || variant.product.name,
        variantName: line.product.variantLabel || variant.sizeLabel || variant.colorLabel || undefined,
        sku: variant.sku,
        quantity: line.quantity,
        unitPrice: line.product.price,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const requestedQty = aggregateQuantities(orderItems);
  for (const [variantId, quantity] of requestedQty) {
    const variant = variantById.get(variantId);
    const available = variant?.inventory?.available ?? 0;
    if (available < quantity) {
      throw new ValidationError(
        `${variant?.product.name ?? "Item"} is out of stock or has insufficient quantity`,
      );
    }
  }

  const order = await orderRepository.createOrderWithItems({
    orderNumber,
    customerId: customer.id,
    currency: Currency.NGN,
    subtotal: totals.subtotal,
    tax: totals.tax,
    shippingFee: totals.shipping,
    discount: totals.discount,
    total: totals.total,
    notes: [
      input.notes?.trim(),
      `CART_SNAPSHOT:${JSON.stringify(cartSnapshot)}`,
      `SHIPPING_METHOD:${input.shippingMethod}`,
      input.shippingMethod === "international" ? "SHIPPING_DISPLAY_CURRENCY:USD" : "SHIPPING_DISPLAY_CURRENCY:NGN",
      input.couponCode ? `COUPON:${input.couponCode}` : null,
      orderItems.length < input.lines.length
        ? `PARTIAL_LINE_ITEMS:${input.lines.length - orderItems.length}_demo_only`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
    status: OrderStatus.PENDING,
    billingAddress: address,
    shippingAddress: address,
    items: orderItems,
  });

  try {
    await withTransaction(async (tx) => {
      const inventoryRepo = new InventoryRepository(tx);
      for (const [variantId, quantity] of requestedQty) {
        await inventoryRepo.reserveStock(variantId, quantity, tx);
      }
    });
  } catch (error) {
    await orderRepository.updateStatus(order.id, OrderStatus.CANCELLED, {
      note: "Cancelled — insufficient stock at checkout",
      fromStatus: OrderStatus.PENDING,
    });
    throw error;
  }

  await paymentRepository.create({
    orderId: order.id,
    provider: PaymentProvider.PAYSTACK,
    reference,
    amount: totals.total,
    currency: Currency.NGN,
    status: PaymentStatus.PENDING,
  });

  const callbackUrl = absoluteUrl(`/checkout/callback?reference=${encodeURIComponent(reference)}`);

  const initialized = await initializePaystackTransaction({
    email,
    amountMajor,
    currency: "NGN",
    reference,
    callbackUrl,
    metadata: {
      orderNumber,
      orderId: order.id,
      customerEmail: email,
      custom_fields: [
        { display_name: "Order", variable_name: "order_number", value: orderNumber },
      ],
    },
  });

  logger.info(
    { orderNumber, reference, amountMajor },
    "Paystack checkout initialized",
  );

  return {
    orderNumber,
    reference: initialized.reference,
    authorizationUrl: initialized.authorizationUrl,
    amount: amountMajor,
    currency: "NGN" as const,
  };
}

export async function finalizePaystackPayment(reference: string) {
  const payment = await paymentRepository.requireByReference(reference);

  if (payment.status === PaymentStatus.PAID) {
    return {
      alreadyPaid: true as const,
      orderNumber: payment.order.orderNumber,
      reference: payment.reference,
    };
  }

  const verified = await verifyPaystackTransaction(reference);
  const expectedMinor = Math.round(Number(payment.amount) * 100);

  if (verified.status !== "success") {
    await paymentRepository.updateStatus(payment.id, PaymentStatus.FAILED, {
      provider: PaymentProvider.PAYSTACK,
      providerEventId: `verify_fail_${reference}_${Date.now()}`,
      eventType: "transaction.verify.failed",
      payload: verified.raw as Prisma.InputJsonValue,
    });

    const failedItems = await prisma.orderItem.findMany({
      where: { orderId: payment.orderId, deletedAt: null },
      select: { variantId: true, quantity: true },
    });
    const releaseQty = aggregateQuantities(
      failedItems.filter((item): item is { variantId: string; quantity: number } => Boolean(item.variantId)),
    );
    await withTransaction(async (tx) => {
      const inventoryRepo = new InventoryRepository(tx);
      for (const [variantId, quantity] of releaseQty) {
        await inventoryRepo.releaseReservedStock(variantId, quantity, tx);
      }
    });

    const failedOrder = await orderRepository.findById(payment.orderId);
    if (failedOrder) {
      await notifyCustomerPaymentFailed(
        failedOrder,
        verified.gatewayResponse || "Payment was not successful",
      );
    }

    throw new AppError(verified.gatewayResponse || "Payment was not successful", {
      code: "PAYMENT_FAILED",
      statusCode: 402,
    });
  }

  /**
   * Bank transfer (and some channels) return `amount` = requested + fees.
   * Match against `requested_amount` when present; only treat as mismatch if that fails too.
   */
  const matchMinor =
    verified.requestedAmountMinor != null && Number.isFinite(verified.requestedAmountMinor)
      ? verified.requestedAmountMinor
      : verified.amountMinor;
  const amountMismatch = matchMinor !== expectedMinor;
  if (amountMismatch) {
    logger.error(
      {
        reference,
        expectedMinor,
        gotAmount: verified.amountMinor,
        gotRequested: verified.requestedAmountMinor,
        fees: verified.feesMinor,
        channel: verified.channel,
        orderNumber: payment.order.orderNumber,
      },
      "Paystack amount mismatch — proceeding with PAID because charge succeeded",
    );
  } else if (
    verified.requestedAmountMinor != null &&
    verified.amountMinor !== verified.requestedAmountMinor
  ) {
    logger.info(
      {
        reference,
        requested: verified.requestedAmountMinor,
        charged: verified.amountMinor,
        fees: verified.feesMinor,
        channel: verified.channel,
      },
      "Paystack channel fee included in charged amount (expected for bank_transfer)",
    );
  }

  await paymentRepository.updateStatus(payment.id, PaymentStatus.PAID, {
    provider: PaymentProvider.PAYSTACK,
    providerEventId: `verify_${reference}_${verified.paidAt ?? Date.now()}`,
    eventType: amountMismatch
      ? "transaction.verify.success_amount_mismatch"
      : "transaction.verify.success",
    payload: {
      ...(verified.raw as object),
      vmExpectedMinor: expectedMinor,
      vmMatchMinor: matchMinor,
      vmReceivedMinor: verified.amountMinor,
      vmRequestedMinor: verified.requestedAmountMinor,
      vmAmountMismatch: amountMismatch,
    } as Prisma.InputJsonValue,
  });

  const paidOrder = await orderRepository.updateStatus(payment.orderId, OrderStatus.PAID, {
    note: amountMismatch
      ? `Payment confirmed via Paystack (amount mismatch: expected ${expectedMinor} kobo, matched against ${matchMinor} kobo, charged ${verified.amountMinor} kobo)`
      : "Payment confirmed via Paystack",
    fromStatus: payment.order.status,
  });

  const paidItems = await prisma.orderItem.findMany({
    where: { orderId: payment.orderId, deletedAt: null },
    select: { variantId: true, quantity: true },
  });
  const saleQty = aggregateQuantities(
    paidItems.filter((item): item is { variantId: string; quantity: number } => Boolean(item.variantId)),
  );
  await withTransaction(async (tx) => {
    const inventoryRepo = new InventoryRepository(tx);
    for (const [variantId, quantity] of saleQty) {
      await inventoryRepo.commitSale(variantId, quantity, payment.orderId, tx);
    }
  });

  // First successful finalize only (alreadyPaid short-circuits above) — verify + webhook share this path.
  // Recipients: client + sales@ only (never brand managers).
  await notifyCustomerOrderStatus(paidOrder, OrderStatus.PAID);

  try {
    const { markCustomerAbandonedCartsRecovered } = await import("@/lib/marketing/abandoned-cart");
    await markCustomerAbandonedCartsRecovered(payment.order.customerId);
  } catch (error) {
    logger.warn({ err: error, orderId: payment.orderId }, "abandoned_cart.recover_on_paid_failed");
  }

  logger.info(
    {
      reference,
      orderNumber: payment.order.orderNumber,
      amountMismatch,
      channel: verified.channel,
      paidMinor: verified.amountMinor,
      requestedMinor: verified.requestedAmountMinor,
    },
    "Paystack payment finalized",
  );

  return {
    alreadyPaid: false as const,
    orderNumber: payment.order.orderNumber,
    reference: payment.reference,
    amountMismatch,
  };
}

export async function handlePaystackWebhookEvent(event: {
  event: string;
  data: Record<string, unknown>;
}) {
  if (event.event !== "charge.success") {
    return { ignored: true as const, reason: event.event };
  }

  const reference = String(event.data.reference ?? "");
  if (!reference) {
    throw new ValidationError("Webhook missing payment reference");
  }

  const payment = await paymentRepository.findByReference(reference);
  if (!payment) {
    logger.warn({ reference }, "Paystack webhook for unknown reference");
    return { ignored: true as const, reason: "unknown_reference" };
  }

  if (payment.status === PaymentStatus.PAID) {
    return { ignored: true as const, reason: "already_paid" };
  }

  // Re-verify with Paystack API for trust (do not trust webhook body alone for money movement).
  return finalizePaystackPayment(reference);
}
