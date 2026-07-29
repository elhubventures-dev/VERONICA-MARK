"use server";

import { InventoryMovementType, OrderStatus, ProductStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireBrandContext } from "@/lib/auth/brand-tenancy";
import { mapOrderAddress, toAddressJson } from "@/lib/commerce/order-address";
import { toPrismaOrderStatus } from "@/lib/commerce/order-status";
import { mergeOrderNotes } from "@/lib/commerce/staff-order-detail";
import { notifyCustomerOrderStatus } from "@/lib/email/order-notifications";
import { env } from "@/lib/env";
import { toErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { inventoryRepository } from "@/lib/repositories/inventory.repository";
import { orderRepository } from "@/lib/repositories/order.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import { createSignedUploadUrl } from "@/lib/storage/supabase";
import { updateBrandProductSchema } from "@/lib/validations/brand-product";
import {
  updateOrderDetailsSchema,
  updateOrderStatusSchema,
} from "@/lib/validations/order-edit";

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
  status: z.enum(["packed", "shipped", "out_for_delivery", "delivered"]),
});

const signedUploadSchema = z.object({
  productId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(180),
  contentType: z
    .string()
    .trim()
    .regex(/^image\/(jpeg|jpg|png|webp|gif)$/i, "Only JPEG, PNG, WebP, or GIF images are allowed"),
});

const FULFILLMENT_STATUS_MAP = {
  packed: OrderStatus.PACKED,
  shipped: OrderStatus.SHIPPED,
  out_for_delivery: OrderStatus.OUT_FOR_DELIVERY,
  delivered: OrderStatus.DELIVERED,
} as const;

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

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
    revalidatePath(`/brand/products/${parsed.productId}/edit`);
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
 * Full product field editor — name, copy, category, variants, media, SEO.
 */
export async function updateBrandProductAction(input: unknown): Promise<BrandActionResult> {
  try {
    const parsed = updateBrandProductSchema.parse(input);
    const ctx = await requireBrandContext();

    const product = await productRepository.saveEditorForBrand(ctx.brandId, parsed, ctx.userId);

    revalidatePath("/brand/products");
    revalidatePath(`/brand/products/${parsed.productId}`);
    revalidatePath(`/brand/products/${parsed.productId}/edit`);
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/brand/inventory");
    revalidatePath("/brand");

    return {
      ok: true,
      message: "Product saved",
      data: {
        productId: product.id,
        slug: product.slug,
        variantCount: product.variants.length,
        mediaCount: product.media.length,
      },
    };
  } catch (error) {
    logger.warn({ err: error }, "brand.product.update_failed");
    return failure(error);
  }
}

/**
 * Mint a brand-scoped signed upload URL for product imagery.
 */
export async function createBrandProductImageUploadAction(input: {
  productId: string;
  fileName: string;
  contentType: string;
}): Promise<BrandActionResult> {
  try {
    const parsed = signedUploadSchema.parse(input);
    const ctx = await requireBrandContext();

    const product = await productRepository.findForBrandEditor(ctx.brandId, parsed.productId);
    if (!product) {
      return { ok: false, message: "Product not found for this brand", code: "NOT_FOUND" };
    }

    const safeName = sanitizeFileName(parsed.fileName) || "image.jpg";
    const path = `brands/${ctx.brandId}/products/${product.slug}/${Date.now()}-${safeName}`;
    const signed = await createSignedUploadUrl(path);
    const bucket = env.server.SUPABASE_STORAGE_BUCKET;
    const supabaseUrl = env.client.NEXT_PUBLIC_SUPABASE_URL;
    const publicUrl = supabaseUrl
      ? `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`
      : `/${path}`;

    return {
      ok: true,
      message: "Upload URL ready",
      data: {
        path,
        token: signed.token,
        signedUrl: signed.signedUrl,
        publicUrl,
      },
    };
  } catch (error) {
    logger.warn({ err: error }, "brand.product.signed_upload_failed");
    return failure(error);
  }
}

/**
 * Advance fulfillment when the order contains this brand's lines.
 * Sends the matching customer status email (packed / shipped / OFD / delivered).
 */
export async function updateBrandOrderFulfillmentAction(input: {
  orderNumber: string;
  status: "packed" | "shipped" | "out_for_delivery" | "delivered";
}): Promise<BrandActionResult> {
  try {
    const parsed = fulfillOrderSchema.parse(input);
    const ctx = await requireBrandContext();

    const nextStatus = FULFILLMENT_STATUS_MAP[parsed.status];

    const order = await orderRepository.updateStatusForBrand(
      ctx.brandId,
      parsed.orderNumber,
      nextStatus,
      {
        note: `Brand Manager marked order ${parsed.status}`,
        changedBy: ctx.userId,
      },
    );

    await notifyCustomerOrderStatus(order, nextStatus);

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

/**
 * Set any order status for a brand-scoped order (staff status control).
 */
export async function updateBrandOrderStatusAction(input: {
  orderNumber: string;
  status: string;
  note?: string;
}): Promise<BrandActionResult> {
  try {
    const parsed = updateOrderStatusSchema.parse(input);
    const ctx = await requireBrandContext();
    const nextStatus = toPrismaOrderStatus(parsed.status);

    const order = await orderRepository.updateStatusForBrand(
      ctx.brandId,
      parsed.orderNumber,
      nextStatus,
      {
        note: parsed.note?.trim() || `Brand Manager set status to ${parsed.status}`,
        changedBy: ctx.userId,
      },
    );

    await notifyCustomerOrderStatus(order, nextStatus);

    revalidatePath("/brand/orders");
    revalidatePath(`/brand/orders/${parsed.orderNumber}`);
    revalidatePath("/brand");

    return {
      ok: true,
      message: `Order ${order.orderNumber} updated to ${parsed.status.replaceAll("_", " ")}`,
      data: { orderNumber: order.orderNumber, status: parsed.status },
    };
  } catch (error) {
    logger.warn({ err: error }, "brand.order.status_failed");
    return failure(error);
  }
}

/**
 * Edit shipping address and notes for a brand-scoped order.
 */
export async function updateBrandOrderDetailsAction(input: {
  orderNumber: string;
  notes?: string;
  shippingAddress: {
    name: string;
    phone: string;
    email?: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
}): Promise<BrandActionResult> {
  try {
    const parsed = updateOrderDetailsSchema.parse(input);
    const ctx = await requireBrandContext();

    const shippingAddress = toAddressJson({
      name: parsed.shippingAddress.name,
      phone: parsed.shippingAddress.phone,
      email: parsed.shippingAddress.email ?? "",
      line1: parsed.shippingAddress.line1,
      line2: parsed.shippingAddress.line2 ?? "",
      city: parsed.shippingAddress.city,
      state: parsed.shippingAddress.state ?? "",
      postalCode: parsed.shippingAddress.postalCode ?? "",
      country: parsed.shippingAddress.country,
    });

    const current = await orderRepository.findByOrderNumber(parsed.orderNumber);
    if (!current) {
      return { ok: false, message: "Order not found", code: "NOT_FOUND" };
    }

    const currentShipping = mapOrderAddress(current.shippingAddress);
    const currentBilling = mapOrderAddress(current.billingAddress);
    const billingMatchedShipping =
      currentBilling.line1 === currentShipping.line1 &&
      currentBilling.city === currentShipping.city &&
      currentBilling.name === currentShipping.name;

    const order = await orderRepository.updateDetailsForBrand(ctx.brandId, parsed.orderNumber, {
      notes: mergeOrderNotes(current.notes, parsed.notes ?? ""),
      shippingAddress,
      ...(billingMatchedShipping ? { billingAddress: shippingAddress } : {}),
    });

    revalidatePath("/brand/orders");
    revalidatePath(`/brand/orders/${parsed.orderNumber}`);
    revalidatePath("/brand");

    return {
      ok: true,
      message: `Order ${order.orderNumber} details saved`,
      data: {
        orderNumber: order.orderNumber,
        notes: order.notes ?? "",
        shippingAddress: mapOrderAddress(order.shippingAddress),
      },
    };
  } catch (error) {
    logger.warn({ err: error }, "brand.order.details_failed");
    return failure(error);
  }
}
