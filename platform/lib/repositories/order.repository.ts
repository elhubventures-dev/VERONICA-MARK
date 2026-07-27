import "server-only";

import { OrderStatus, type Currency, type Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { handlePrisma } from "@/lib/db/errors";
import { withTransaction } from "@/lib/db/transactions";
import { NotFoundError } from "@/lib/errors";
import { BaseRepository } from "@/lib/repositories/base.repository";

export type CreateOrderItemInput = {
  variantId: string;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPrice: Decimal | number | string;
  compareAtPrice?: Decimal | number | string;
  taxAmount?: Decimal | number | string;
  discountAmount?: Decimal | number | string;
  preorderEstimatedAt?: Date;
};

export type CreateOrderWithItemsInput = {
  orderNumber: string;
  customerId: string;
  currency: Currency;
  subtotal: Decimal | number | string;
  tax: Decimal | number | string;
  shippingFee: Decimal | number | string;
  discount?: Decimal | number | string;
  total: Decimal | number | string;
  couponId?: string;
  notes?: string;
  status?: OrderStatus;
  billingAddress: Prisma.InputJsonValue;
  shippingAddress: Prisma.InputJsonValue;
  items: CreateOrderItemInput[];
  actorId?: string;
};

const orderInclude = {
  items: {
    where: { deletedAt: null },
    include: {
      variant: {
        include: {
          product: {
            include: {
              brand: true,
              media: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" as const }, take: 1 },
            },
          },
        },
      },
    },
  },
  customer: {
    include: {
      user: true,
    },
  },
  statusHistory: {
    orderBy: { createdAt: "asc" as const },
  },
  payments: {
    orderBy: { createdAt: "desc" as const },
  },
  shipments: {
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.OrderInclude;

export type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function toDecimal(value: Decimal | number | string): Decimal {
  return value instanceof Decimal ? value : new Decimal(value.toString());
}

function lineTotal(item: CreateOrderItemInput): Decimal {
  const unitPrice = toDecimal(item.unitPrice);
  const tax = toDecimal(item.taxAmount ?? 0);
  const discount = toDecimal(item.discountAmount ?? 0);
  return unitPrice.mul(item.quantity).add(tax).sub(discount);
}

export class OrderRepository extends BaseRepository {
  async findById(id: string) {
    return handlePrisma(() =>
      this.db.order.findFirst({
        where: { id, deletedAt: null },
        include: orderInclude,
      }),
    );
  }

  async findByOrderNumber(orderNumber: string) {
    return handlePrisma(() =>
      this.db.order.findFirst({
        where: { orderNumber, deletedAt: null },
        include: orderInclude,
      }),
    );
  }

  async requireByOrderNumber(orderNumber: string) {
    const order = await this.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    return order;
  }

  async listByCustomer(customerId: string, limit = 20) {
    return handlePrisma(() =>
      this.db.order.findMany({
        where: { customerId, deletedAt: null },
        include: orderInclude,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    );
  }

  async listAll(limit = 50) {
    return handlePrisma(() =>
      this.db.order.findMany({
        where: { deletedAt: null },
        include: orderInclude,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    );
  }

  async listByBrand(brandId: string, limit = 50) {
    return handlePrisma(() =>
      this.db.order.findMany({
        where: {
          deletedAt: null,
          items: {
            some: {
              deletedAt: null,
              variant: { product: { brandId } },
            },
          },
        },
        include: orderInclude,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    );
  }

  async createOrderWithItems(input: CreateOrderWithItemsInput): Promise<OrderWithRelations> {
    return withTransaction(async (tx) => {
      const status = input.status ?? OrderStatus.PENDING;
      const discount = toDecimal(input.discount ?? 0);

      const order = await tx.order.create({
        data: {
          orderNumber: input.orderNumber,
          customerId: input.customerId,
          currency: input.currency,
          status,
          subtotal: toDecimal(input.subtotal),
          tax: toDecimal(input.tax),
          shippingFee: toDecimal(input.shippingFee),
          discount,
          total: toDecimal(input.total),
          couponId: input.couponId,
          notes: input.notes,
          billingAddress: input.billingAddress,
          shippingAddress: input.shippingAddress,
          placedAt: status === OrderStatus.PENDING ? undefined : new Date(),
          items: {
            create: input.items.map((item) => ({
              variantId: item.variantId,
              productName: item.productName,
              variantName: item.variantName,
              sku: item.sku,
              quantity: item.quantity,
              unitPrice: toDecimal(item.unitPrice),
              compareAtPrice: item.compareAtPrice
                ? toDecimal(item.compareAtPrice)
                : undefined,
              taxAmount: toDecimal(item.taxAmount ?? 0),
              discountAmount: toDecimal(item.discountAmount ?? 0),
              lineTotal: lineTotal(item),
              preorderEstimatedAt: item.preorderEstimatedAt,
            })),
          },
        },
        include: orderInclude,
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: null,
          toStatus: status,
          comment: "Order created",
          changedBy: input.actorId,
        },
      });

      return order;
    });
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    input: { note?: string; changedBy?: string; fromStatus?: OrderStatus } = {},
  ) {
    return withTransaction(async (tx) => {
      const current = await tx.order.findUnique({ where: { id: orderId } });
      if (!current) {
        throw new NotFoundError("Order not found");
      }

      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          ...(status === OrderStatus.PAID || status === OrderStatus.CONFIRMED
            ? { placedAt: current.placedAt ?? new Date() }
            : {}),
          ...(status === OrderStatus.COMPLETED ? { completedAt: new Date() } : {}),
          ...(status === OrderStatus.CANCELLED ? { cancelledAt: new Date() } : {}),
        },
        include: orderInclude,
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus: input.fromStatus ?? current.status,
          toStatus: status,
          comment: input.note,
          changedBy: input.changedBy,
        },
      });

      return order;
    });
  }

  /**
   * Advance order status only when the order includes at least one line for `brandId`.
   */
  async updateStatusForBrand(
    brandId: string,
    orderNumber: string,
    status: OrderStatus,
    input: { note?: string; changedBy?: string } = {},
  ) {
    const order = await this.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const belongs = order.items.some((item) => item.variant?.product?.brandId === brandId);
    if (!belongs) {
      throw new NotFoundError("Order not found for this brand");
    }

    return this.updateStatus(order.id, status, {
      note: input.note,
      changedBy: input.changedBy,
      fromStatus: order.status,
    });
  }
}

export const orderRepository = new OrderRepository();
