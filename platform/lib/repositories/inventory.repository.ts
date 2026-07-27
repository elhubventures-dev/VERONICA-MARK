import "server-only";

import { InventoryMovementType, InventoryStatus, type Prisma } from "@prisma/client";

import { handlePrisma } from "@/lib/db/errors";
import type { TransactionClient } from "@/lib/db/transactions";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { BaseRepository, type DbClient } from "@/lib/repositories/base.repository";

export type StockAdjustmentInput = {
  variantId: string;
  quantityDelta: number;
  type: InventoryMovementType;
  reason?: string;
  referenceType?: string;
  referenceId?: string;
  actorId?: string;
};

function inventoryStatusFor(available: number, reorderLevel: number): InventoryStatus {
  if (available <= 0) return InventoryStatus.OUT_OF_STOCK;
  if (available <= reorderLevel) return InventoryStatus.LOW_STOCK;
  return InventoryStatus.IN_STOCK;
}

async function createMovement(
  client: DbClient,
  input: {
    variantId: string;
    type: InventoryMovementType;
    quantity: number;
    balanceAfter: number;
    reason?: string;
    referenceType?: string;
    referenceId?: string;
    actorId?: string;
  },
) {
  return client.inventoryMovement.create({
    data: {
      variantId: input.variantId,
      type: input.type,
      quantity: input.quantity,
      balanceAfter: input.balanceAfter,
      reason: input.reason,
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      actorId: input.actorId,
    },
  });
}

export class InventoryRepository extends BaseRepository {
  constructor(client: DbClient = prisma) {
    super(client);
  }

  async findByVariantId(variantId: string) {
    return handlePrisma(() =>
      this.db.inventory.findUnique({
        where: { variantId },
        include: { variant: true },
      }),
    );
  }

  async listByBrand(brandId: string) {
    return handlePrisma(() =>
      this.db.inventory.findMany({
        where: {
          deletedAt: null,
          variant: {
            deletedAt: null,
            product: { brandId, deletedAt: null },
          },
        },
        include: {
          variant: {
            include: {
              product: { include: { media: { where: { deletedAt: null }, take: 1 } } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
    );
  }

  async requireByVariantId(variantId: string) {
    const inventory = await this.findByVariantId(variantId);
    if (!inventory) {
      throw new NotFoundError("Inventory record not found");
    }
    return inventory;
  }

  async adjustStock(input: StockAdjustmentInput, tx?: TransactionClient) {
    const client = tx ?? this.db;

    if (input.quantityDelta === 0) {
      throw new ValidationError("Stock adjustment quantity cannot be zero");
    }

    return handlePrisma(async () => {
      const inventory = await client.inventory.findUnique({
        where: { variantId: input.variantId },
      });

      if (!inventory) {
        throw new NotFoundError("Inventory record not found");
      }

      const nextAvailable = inventory.available + input.quantityDelta;
      if (nextAvailable < 0) {
        throw new ValidationError("Insufficient available stock for adjustment");
      }

      const updated = await client.inventory.update({
        where: { id: inventory.id },
        data: {
          available: nextAvailable,
          status: inventoryStatusFor(nextAvailable, inventory.reorderLevel),
        },
      });

      await createMovement(client, {
        variantId: input.variantId,
        type: input.type,
        quantity: input.quantityDelta,
        balanceAfter: nextAvailable,
        reason: input.reason,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        actorId: input.actorId,
      });

      return updated;
    });
  }

  /**
   * Adjust stock only when the variant belongs to `brandId`.
   */
  async adjustStockForBrand(brandId: string, input: StockAdjustmentInput, tx?: TransactionClient) {
    const client = tx ?? this.db;
    const owned = await handlePrisma(() =>
      client.productVariant.findFirst({
        where: {
          id: input.variantId,
          deletedAt: null,
          product: { brandId, deletedAt: null },
        },
        select: { id: true },
      }),
    );
    if (!owned) {
      throw new NotFoundError("Inventory variant not found for this brand");
    }
    return this.adjustStock(input, tx);
  }

  async reserveStock(variantId: string, quantity: number, tx?: TransactionClient) {
    const client = tx ?? this.db;

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ValidationError("Reserve quantity must be a positive integer");
    }

    return handlePrisma(async () => {
      const inventory = await client.inventory.findUnique({
        where: { variantId },
      });

      if (!inventory) {
        throw new NotFoundError("Inventory record not found");
      }

      if (inventory.available < quantity) {
        throw new ValidationError("Insufficient stock to reserve");
      }

      const nextAvailable = inventory.available - quantity;
      const nextReserved = inventory.reserved + quantity;

      const updated = await client.inventory.update({
        where: { id: inventory.id },
        data: {
          available: nextAvailable,
          reserved: nextReserved,
          status: inventoryStatusFor(nextAvailable, inventory.reorderLevel),
        },
      });

      await createMovement(client, {
        variantId,
        type: InventoryMovementType.RESERVATION,
        quantity: -quantity,
        balanceAfter: nextAvailable,
        reason: "Stock reserved for checkout",
        referenceType: "STOCK_RESERVATION",
      });

      return updated;
    });
  }

  async releaseReservedStock(
    variantId: string,
    quantity: number,
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.db;

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ValidationError("Release quantity must be a positive integer");
    }

    return handlePrisma(async () => {
      const inventory = await client.inventory.findUnique({
        where: { variantId },
      });

      if (!inventory) {
        throw new NotFoundError("Inventory record not found");
      }

      if (inventory.reserved < quantity) {
        throw new ValidationError("Cannot release more stock than reserved");
      }

      const nextAvailable = inventory.available + quantity;
      const nextReserved = inventory.reserved - quantity;

      const updated = await client.inventory.update({
        where: { id: inventory.id },
        data: {
          available: nextAvailable,
          reserved: nextReserved,
          status: inventoryStatusFor(nextAvailable, inventory.reorderLevel),
        },
      });

      await createMovement(client, {
        variantId,
        type: InventoryMovementType.RELEASE,
        quantity,
        balanceAfter: nextAvailable,
        reason: "Reserved stock released",
        referenceType: "STOCK_RESERVATION",
      });

      return updated;
    });
  }

  async commitSale(
    variantId: string,
    quantity: number,
    orderId: string,
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.db;

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ValidationError("Sale quantity must be a positive integer");
    }

    return handlePrisma(async () => {
      const inventory = await client.inventory.findUnique({
        where: { variantId },
      });

      if (!inventory) {
        throw new NotFoundError("Inventory record not found");
      }

      // Preferred path: stock was reserved at checkout.
      if (inventory.reserved >= quantity) {
        const nextReserved = inventory.reserved - quantity;
        const updated = await client.inventory.update({
          where: { id: inventory.id },
          data: {
            reserved: nextReserved,
            status: inventoryStatusFor(inventory.available, inventory.reorderLevel),
          },
        });

        await createMovement(client, {
          variantId,
          type: InventoryMovementType.SALE,
          quantity: -quantity,
          balanceAfter: inventory.available,
          reason: "Stock committed for confirmed purchase",
          referenceType: "ORDER",
          referenceId: orderId,
        });

        return updated;
      }

      // Fallback: decrement available directly when no reservation exists.
      if (inventory.available < quantity) {
        throw new ValidationError("Insufficient stock to complete sale");
      }

      const nextAvailable = inventory.available - quantity;
      const updated = await client.inventory.update({
        where: { id: inventory.id },
        data: {
          available: nextAvailable,
          status: inventoryStatusFor(nextAvailable, inventory.reorderLevel),
        },
      });

      await createMovement(client, {
        variantId,
        type: InventoryMovementType.SALE,
        quantity: -quantity,
        balanceAfter: nextAvailable,
        reason: "Stock reduced for confirmed purchase",
        referenceType: "ORDER",
        referenceId: orderId,
      });

      return updated;
    });
  }

  async upsertForVariant(
    variantId: string,
    data: Omit<Prisma.InventoryUncheckedCreateInput, "variantId">,
    tx?: TransactionClient,
  ) {
    const client = tx ?? this.db;
    const available = data.available ?? 0;
    const reorderLevel = data.reorderLevel ?? 5;
    const status = data.status ?? inventoryStatusFor(available, reorderLevel);

    return handlePrisma(() =>
      client.inventory.upsert({
        where: { variantId },
        create: {
          variantId,
          ...data,
          available,
          reorderLevel,
          status,
        },
        update: {
          ...data,
          status:
            data.status ??
            inventoryStatusFor(
              data.available ?? available,
              data.reorderLevel ?? reorderLevel,
            ),
        },
      }),
    );
  }
}

export const inventoryRepository = new InventoryRepository();
