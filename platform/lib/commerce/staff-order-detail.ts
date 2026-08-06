import type { OrderStatus } from "@/components/commerce/order-status-badge";
import {
  mapOrderAddress,
  type OrderAddressFields,
} from "@/lib/commerce/order-address";
import type { OrderWithRelations } from "@/lib/repositories/order.repository";

export type StaffOrderLineItem = {
  title: string;
  brand: string;
  variant: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice: number | null;
  taxAmount: number;
  discountAmount: number;
  lineTotal: number;
  preorderEstimatedAt: string | null;
  productSlug: string | null;
  image: string | null;
};

export type StaffOrderPayment = {
  provider: string;
  reference: string;
  status: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  failureReason: string | null;
  createdAt: string;
};

export type StaffOrderShipment = {
  provider: string;
  trackingNumber: string | null;
  status: string;
  shippingMethod: string | null;
  cost: number;
  estimatedDeliveryAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  updatedAt: string;
};

export type StaffOrderStatusHistory = {
  fromStatus: string | null;
  toStatus: string;
  comment: string | null;
  at: string;
};

export type StaffOrderDetail = {
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  completedAt: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  brandNames: string[];
  currency: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  itemCount: number;
  notes: string;
  customerNotes: string;
  shippingMethod: string | null;
  couponCode: string | null;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  shippingStatus: "unfulfilled" | "packed" | "shipped" | "delivered";
  shippingAddress: OrderAddressFields;
  billingAddress: OrderAddressFields;
  items: StaffOrderLineItem[];
  payments: StaffOrderPayment[];
  shipments: StaffOrderShipment[];
  statusHistory: StaffOrderStatusHistory[];
};

function noteValue(notes: string | null | undefined, key: string): string | null {
  if (!notes) return null;
  const match = notes.split("\n").find((line) => line.startsWith(`${key}:`));
  if (!match) return null;
  return match.slice(key.length + 1).trim() || null;
}

function customerFacingNotes(notes: string | null | undefined): string {
  if (!notes) return "";
  return notes
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("CART_SNAPSHOT:") &&
        !line.startsWith("SHIPPING_METHOD:") &&
        !line.startsWith("SHIPPING_DISPLAY_CURRENCY:") &&
        !line.startsWith("FULFILLMENT:") &&
        !line.startsWith("COUPON:") &&
        !line.startsWith("PARTIAL_LINE_ITEMS:"),
    )
    .join("\n")
    .trim();
}

function systemNoteLines(notes: string | null | undefined): string[] {
  if (!notes) return [];
  return notes.split("\n").filter(
    (line) =>
      line.startsWith("CART_SNAPSHOT:") ||
      line.startsWith("SHIPPING_METHOD:") ||
      line.startsWith("SHIPPING_DISPLAY_CURRENCY:") ||
      line.startsWith("FULFILLMENT:") ||
      line.startsWith("COUPON:") ||
      line.startsWith("PARTIAL_LINE_ITEMS:"),
  );
}

/** Merge edited customer notes with preserved checkout system metadata. */
export function mergeOrderNotes(
  existing: string | null | undefined,
  customerNotes: string,
): string | null {
  const merged = [customerNotes.trim(), ...systemNoteLines(existing)].filter(Boolean).join("\n");
  return merged || null;
}

function mapPaymentStatus(
  order: OrderWithRelations,
): StaffOrderDetail["paymentStatus"] {
  const payment = order.payments[0];
  if (payment?.status === "PAID") return "paid";
  if (payment?.status === "FAILED" || payment?.status === "CANCELLED") return "failed";
  if (payment?.status === "REFUNDED" || payment?.status === "PARTIALLY_REFUNDED") {
    return "refunded";
  }
  return "pending";
}

function mapShippingStatus(
  order: OrderWithRelations,
): StaffOrderDetail["shippingStatus"] {
  const shipment = order.shipments[0];
  if (shipment) {
    const s = shipment.status;
    if (s === "DELIVERED") return "delivered";
    if (s === "IN_TRANSIT" || s === "OUT_FOR_DELIVERY" || s === "PICKED_UP") return "shipped";
    if (s === "LABEL_CREATED") return "packed";
  }
  if (["PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED"].includes(order.status)) {
    if (order.status === "DELIVERED" || order.status === "COMPLETED") return "delivered";
    if (order.status === "PACKED") return "packed";
    return "shipped";
  }
  return "unfulfilled";
}

export function mapStaffOrderDetail(order: OrderWithRelations): StaffOrderDetail {
  const user = order.customer?.user;
  const shippingAddress = mapOrderAddress(order.shippingAddress);
  const brandNames = [
    ...new Set(
      order.items
        .map((item) => item.variant?.product?.brand?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ];

  return {
    orderNumber: order.orderNumber,
    status: order.status.toLowerCase() as OrderStatus,
    placedAt: (order.placedAt ?? order.createdAt).toISOString(),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    cancelledAt: order.cancelledAt?.toISOString() ?? null,
    completedAt: order.completedAt?.toISOString() ?? null,
    customerName: user ? `${user.firstName} ${user.lastName}`.trim() : shippingAddress.name || "Customer",
    customerEmail: user?.email ?? shippingAddress.email,
    customerPhone: user?.phone ?? shippingAddress.phone,
    brandNames,
    currency: order.currency,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shippingFee: Number(order.shippingFee),
    discount: Number(order.discount),
    total: Number(order.total),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    notes: order.notes ?? "",
    customerNotes: customerFacingNotes(order.notes),
    shippingMethod: noteValue(order.notes, "SHIPPING_METHOD") ?? order.shipments[0]?.shippingMethod ?? null,
    couponCode: order.coupon?.code ?? noteValue(order.notes, "COUPON"),
    paymentStatus: mapPaymentStatus(order),
    shippingStatus: mapShippingStatus(order),
    shippingAddress,
    billingAddress: mapOrderAddress(order.billingAddress),
    items: order.items.map((item) => {
      const media = item.variant?.product?.media?.[0];
      return {
        title: item.productName,
        brand: item.variant?.product?.brand?.name ?? "",
        variant: item.variantName ?? "",
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        compareAtPrice: item.compareAtPrice != null ? Number(item.compareAtPrice) : null,
        taxAmount: Number(item.taxAmount),
        discountAmount: Number(item.discountAmount),
        lineTotal: Number(item.lineTotal),
        preorderEstimatedAt: item.preorderEstimatedAt?.toISOString() ?? null,
        productSlug: item.variant?.product?.slug ?? null,
        image: media?.url ?? null,
      };
    }),
    payments: order.payments.map((payment) => ({
      provider: payment.provider === "PAYSTACK" ? "Paystack" : payment.provider === "SQUADCO" ? "SquadCo" : payment.provider,
      reference: payment.reference,
      status: payment.status.toLowerCase(),
      amount: Number(payment.amount),
      currency: payment.currency,
      paidAt: payment.paidAt?.toISOString() ?? null,
      failureReason: payment.failureReason,
      createdAt: payment.createdAt.toISOString(),
    })),
    shipments: order.shipments.map((shipment) => ({
      provider: shipment.provider.replaceAll("_", " ").toLowerCase(),
      trackingNumber: shipment.trackingNumber,
      status: shipment.status.toLowerCase(),
      shippingMethod: shipment.shippingMethod,
      cost: Number(shipment.cost),
      estimatedDeliveryAt: shipment.estimatedDeliveryAt?.toISOString() ?? null,
      shippedAt: shipment.shippedAt?.toISOString() ?? null,
      deliveredAt: shipment.deliveredAt?.toISOString() ?? null,
      updatedAt: shipment.updatedAt.toISOString(),
    })),
    statusHistory: (order.statusHistory ?? []).map((entry) => ({
      fromStatus: entry.fromStatus?.toLowerCase() ?? null,
      toStatus: entry.toStatus.toLowerCase(),
      comment: entry.comment,
      at: entry.createdAt.toISOString(),
    })),
  };
}

export function emptyStaffOrderDetail(
  partial: Pick<
    StaffOrderDetail,
    "orderNumber" | "placedAt" | "status" | "customerName" | "total" | "currency"
  > &
    Partial<StaffOrderDetail>,
): StaffOrderDetail {
  const emptyAddress: OrderAddressFields = {
    name: partial.customerName,
    phone: "",
    email: partial.customerEmail ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "NG",
  };

  return {
    createdAt: partial.placedAt,
    updatedAt: partial.placedAt,
    cancelledAt: null,
    completedAt: null,
    customerEmail: "",
    customerPhone: "",
    brandNames: partial.brandNames ?? [],
    subtotal: partial.total,
    tax: 0,
    shippingFee: 0,
    discount: 0,
    itemCount: 0,
    notes: "",
    customerNotes: "",
    shippingMethod: null,
    couponCode: null,
    paymentStatus: "pending",
    shippingStatus: "unfulfilled",
    shippingAddress: emptyAddress,
    billingAddress: emptyAddress,
    items: [],
    payments: [],
    shipments: [],
    statusHistory: [],
    ...partial,
  };
}
