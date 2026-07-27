import "server-only";

import { DomainService } from "@/lib/domain/base.service";
import { withTransaction } from "@/lib/db/transactions";
import {
  InventoryRepository,
  inventoryRepository,
} from "@/lib/repositories/inventory.repository";

export class InventoryService extends DomainService {
  constructor(private readonly repository: InventoryRepository = inventoryRepository) {
    super();
  }

  async reserveStock(variantId: string, quantity: number) {
    this.assertPositiveQuantity(quantity);
    return withTransaction((tx) => {
      const repo = new InventoryRepository(tx);
      return repo.reserveStock(variantId, quantity, tx);
    });
  }

  async releaseStock(variantId: string, quantity: number) {
    this.assertPositiveQuantity(quantity);
    return withTransaction((tx) => {
      const repo = new InventoryRepository(tx);
      return repo.releaseReservedStock(variantId, quantity, tx);
    });
  }

  async commitSale(variantId: string, quantity: number, orderId: string) {
    this.assertPositiveQuantity(quantity);
    return withTransaction((tx) => {
      const repo = new InventoryRepository(tx);
      return repo.commitSale(variantId, quantity, orderId, tx);
    });
  }
}

export const inventoryService = new InventoryService();
