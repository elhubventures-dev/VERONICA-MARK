import "server-only";

import { Decimal } from "@prisma/client/runtime/library";
import { type Prisma } from "@prisma/client";

import { handlePrisma } from "@/lib/db/errors";
import { NotFoundError } from "@/lib/errors";
import { BaseRepository } from "@/lib/repositories/base.repository";

const cartInclude = {
  items: {
    where: { deletedAt: null },
    include: {
      variant: {
        include: {
          product: {
            include: {
              brand: true,
              media: {
                where: { deletedAt: null, isPrimary: true },
                take: 1,
              },
            },
          },
          inventory: true,
        },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
  customer: {
    include: {
      user: true,
    },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export class CartRepository extends BaseRepository {
  async findById(id: string) {
    return handlePrisma(() =>
      this.db.cart.findFirst({
        where: { id, deletedAt: null },
        include: cartInclude,
      }),
    );
  }

  async findByCustomerId(customerId: string) {
    return handlePrisma(() =>
      this.db.cart.findFirst({
        where: { customerId, deletedAt: null },
        include: cartInclude,
        orderBy: { updatedAt: "desc" },
      }),
    );
  }

  async findBySessionId(sessionId: string) {
    return handlePrisma(() =>
      this.db.cart.findFirst({
        where: { sessionId, deletedAt: null },
        include: cartInclude,
      }),
    );
  }

  async findByCustomerOrSession(input: {
    customerId?: string;
    sessionId?: string;
  }): Promise<CartWithItems | null> {
    if (input.customerId) {
      const customerCart = await this.findByCustomerId(input.customerId);
      if (customerCart) {
        return customerCart;
      }
    }

    if (input.sessionId) {
      return this.findBySessionId(input.sessionId);
    }

    return null;
  }

  async getOrCreateForCustomer(customerId: string) {
    const existing = await this.findByCustomerId(customerId);
    if (existing) {
      return existing;
    }

    return handlePrisma(() =>
      this.db.cart.create({
        data: { customerId },
        include: cartInclude,
      }),
    );
  }

  async getOrCreateForSession(sessionId: string) {
    const existing = await this.findBySessionId(sessionId);
    if (existing) {
      return existing;
    }

    return handlePrisma(() =>
      this.db.cart.create({
        data: { sessionId },
        include: cartInclude,
      }),
    );
  }

  async mergeGuestCart(input: {
    customerId: string;
    sessionId: string;
  }): Promise<CartWithItems> {
    return handlePrisma(async () => {
      const guestCart = await this.db.cart.findFirst({
        where: { sessionId: input.sessionId, deletedAt: null },
        include: {
          items: {
            where: { deletedAt: null },
            include: { variant: true },
          },
        },
      });

      const customerCart = await this.getOrCreateForCustomer(input.customerId);

      if (!guestCart || guestCart.items.length === 0) {
        return customerCart;
      }

      for (const guestItem of guestCart.items) {
        const unitPrice = guestItem.unitPrice ?? guestItem.variant.salePrice ?? guestItem.variant.price;
        const existingItem = customerCart.items.find(
          (item) => item.variantId === guestItem.variantId,
        );

        if (existingItem) {
          await this.db.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + guestItem.quantity },
          });
        } else {
          await this.db.cartItem.create({
            data: {
              cartId: customerCart.id,
              variantId: guestItem.variantId,
              quantity: guestItem.quantity,
              unitPrice,
            },
          });
        }
      }

      await this.db.cart.update({
        where: { id: guestCart.id },
        data: { deletedAt: new Date() },
      });

      const merged = await this.findById(customerCart.id);
      if (!merged) {
        throw new NotFoundError("Merged cart not found");
      }

      return merged;
    });
  }

  async upsertItem(
    cartId: string,
    variantId: string,
    quantity: number,
    unitPrice: Decimal | number | string,
  ) {
    const price =
      unitPrice instanceof Decimal ? unitPrice : new Decimal(unitPrice.toString());

    return handlePrisma(() =>
      this.db.cartItem.upsert({
        where: {
          cartId_variantId: { cartId, variantId },
        },
        create: { cartId, variantId, quantity, unitPrice: price },
        update: { quantity, unitPrice: price },
        include: {
          variant: {
            include: {
              product: true,
              inventory: true,
            },
          },
        },
      }),
    );
  }

  async removeItem(cartId: string, variantId: string) {
    return handlePrisma(() =>
      this.db.cartItem.update({
        where: {
          cartId_variantId: { cartId, variantId },
        },
        data: { deletedAt: new Date() },
      }),
    );
  }

  async clearCart(cartId: string) {
    return handlePrisma(() =>
      this.db.cartItem.updateMany({
        where: { cartId, deletedAt: null },
        data: { deletedAt: new Date() },
      }),
    );
  }
}

export const cartRepository = new CartRepository();
