import "server-only";

import {
  PaymentStatus,
  type PaymentProvider,
  type Currency,
  type Prisma,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { handlePrisma } from "@/lib/db/errors";
import { NotFoundError } from "@/lib/errors";
import { BaseRepository } from "@/lib/repositories/base.repository";

export type CreatePaymentInput = {
  orderId: string;
  provider: PaymentProvider;
  reference: string;
  amount: Decimal | number | string;
  currency: Currency;
  status?: PaymentStatus;
  authorizationCode?: string;
};

function toDecimal(value: Decimal | number | string): Decimal {
  return value instanceof Decimal ? value : new Decimal(value.toString());
}

export class PaymentRepository extends BaseRepository {
  async findById(id: string) {
    return handlePrisma(() =>
      this.db.payment.findFirst({
        where: { id, deletedAt: null },
        include: {
          order: true,
          events: { orderBy: { createdAt: "desc" } },
        },
      }),
    );
  }

  async findByOrderId(orderId: string) {
    return handlePrisma(() =>
      this.db.payment.findMany({
        where: { orderId, deletedAt: null },
        include: {
          order: true,
          events: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  async findLatestByOrderId(orderId: string) {
    const payments = await this.findByOrderId(orderId);
    return payments[0] ?? null;
  }

  async findByReference(reference: string) {
    return handlePrisma(() =>
      this.db.payment.findFirst({
        where: { reference, deletedAt: null },
        include: {
          order: true,
          events: { orderBy: { createdAt: "desc" } },
        },
      }),
    );
  }

  async listRecent(limit = 50) {
    return handlePrisma(() =>
      this.db.payment.findMany({
        where: { deletedAt: null },
        include: {
          order: {
            include: {
              customer: { include: { user: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    );
  }

  async requireByReference(reference: string) {
    const payment = await this.findByReference(reference);
    if (!payment) {
      throw new NotFoundError("Payment not found");
    }
    return payment;
  }

  async create(input: CreatePaymentInput) {
    return handlePrisma(() =>
      this.db.payment.create({
        data: {
          orderId: input.orderId,
          provider: input.provider,
          reference: input.reference,
          amount: toDecimal(input.amount),
          currency: input.currency,
          status: input.status ?? PaymentStatus.PENDING,
          authorizationCode: input.authorizationCode,
        },
        include: { order: true },
      }),
    );
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
    event?: {
      provider: PaymentProvider;
      providerEventId: string;
      eventType: string;
      payload: Prisma.InputJsonValue;
    },
  ) {
    return handlePrisma(async () => {
      const payment = await this.db.payment.update({
        where: { id },
        data: {
          status,
          ...(status === PaymentStatus.PAID ? { paidAt: new Date() } : {}),
        },
        include: { order: true },
      });

      if (event) {
        await this.db.paymentEvent.create({
          data: {
            paymentId: id,
            provider: event.provider,
            providerEventId: event.providerEventId,
            eventType: event.eventType,
            payload: event.payload,
          },
        });
      }

      return payment;
    });
  }
}

export const paymentRepository = new PaymentRepository();
