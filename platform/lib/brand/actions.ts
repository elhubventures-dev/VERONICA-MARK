"use server";

import { InventoryMovementType, OrderStatus, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireBrandContext } from "@/lib/auth/brand-tenancy";
import { toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { inventoryRepository } from "@/lib/repositories/inventory.repository";
import { orderRepository } from "@/lib/repositories/order.repository";
import { productRepository } from "@/lib/repositories/product.repository";

export type BrandActionResult =
  | { ok: true; message: string; data?: Record<string, unknown> }
  | { ok: false; message: string; code?: string };

function failure(error: unknown): BrandActionResult {
  const { body } = toErrorResponse(error);
  return {
    ok: false,
    message: body.error.message,
    code: body.error.code,
  };
}

const adjustStockSchema = z.object({
  variantId: z.string().min(1),
  quantityDelta: z.number().int().refine((n) => n !== 0, "quantityDelta cannot be 0"),
});

const productStatusSchema = z.object({
  productId: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]),
});

const fulfillOrderSchema = z.object({
  orderNumber: z.string().min(1),
  status: z.enum(["packed", "shipped"]),
});

/**
 * Brand Manager inventory adjustment — scoped to BrandManagerProfile.brandId.
 */
export async function adjustBrandInventoryAction(input: {
  variantId: string;
  quantityDelta: number;
}): Promise<BrandActionResult> {
  try {
    const parsed = adjustStockSchema.parse(input);
    const ctx = await requireBrandContext();

    const updated = await inventoryRepository.adjustStockForBrand(ctx.brandId, {
      variantId: parsed.variantId,
      quantityDelta: parsed.quantityDelta,
      type: InventoryMovementType.ADJUSTMENT,
      reason: "Brand Manager stock adjustment",
      actorId: ctx.userId,
    });

    revalidatePath("/brand/inventory");
    revalidatePath("/brand");

    return {
      ok: true,
      message: "Inventory updated",
      data: {
        variantId: parsed.variantId,
        available: updated.available,
        reserved: updated.reserved,
      },
    };
  } catch (error) {
    logger.warn({ err: error }, "brand.inventory.adjust_failed");
    return failure(error);
  }
}

/**
 * Archive / restore / publish product — brand-scoped.
 */
export async function updateBrandProductStatusAction(input: {
  productId: string;
  status: "draft" | "published" | "archived";
}): Promise<BrandActionResult> {
  try {
    const parsed = productStatusSchema.parse(input);
    const ctx = await requireBrandContext();

    const statusMap = {
      draft: ProductStatus.DRAFT,
      published: ProductStatus.PUBLISHED,
      archived: ProductStatus.ARCHIVED,
    } as const;

    const next = statusMap[parsed.status];
    const product = await productRepository.updateForBrand(ctx.brandId, parsed.productId, {
      status: next,
      visible: next === ProductStatus.PUBLISHED,
      ...(next === ProductStatus.ARCHIVED ? { deletedAt: null } : {}),
      ...(next === ProductStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
    });

    revalidatePath("/brand/products");
    revalidatePath(`/brand/products/${parsed.productId}`);
    revalidatePath("/brand");

    return {
      ok: true,
      message: `Product marked as ${parsed.status}`,
      data: { productId: product.id, status: parsed.status },
    };
  } catch (error) {
    logger.warn({ err: error }, "brand.product.status_failed");
    return failure(error);
  }
}

/**
 * Mark order packed/shipped when the order contains this brand's lines.
 */
export async function updateBrandOrderFulfillmentAction(input: {
  orderNumber: string;
  status: "packed" | "shipped";
}): Promise<BrandActionResult> {
  try {
    const parsed = fulfillOrderSchema.parse(input);
    const ctx = await requireBrandContext();

    const nextStatus =
      parsed.status === "packed" ? OrderStatus.PACKED : OrderStatus.SHIPPED;

    const order = await orderRepository.updateStatusForBrand(
      ctx.brandId,
      parsed.orderNumber,
      nextStatus,
      {
        note: `Brand Manager marked order ${parsed.status}`,
        changedBy: ctx.userId,
      },
    );

    revalidatePath("/brand/orders");
    revalidatePath(`/brand/orders/${parsed.orderNumber}`);
    revalidatePath("/brand");

    return {
      ok: true,
      message: `Order ${order.orderNumber} marked as ${parsed.status}`,
      data: { orderNumber: order.orderNumber, status: parsed.status },
    };
  } catch (error) {
    logger.warn({ err: error }, "brand.order.fulfillment_failed");
    return failure(error);
  }
}
