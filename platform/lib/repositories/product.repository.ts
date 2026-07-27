import "server-only";

import {
  InventoryMovementType,
  InventoryStatus,
  MediaType,
  type Prisma,
  ProductStatus,
} from "@prisma/client";

import { handlePrisma } from "@/lib/db/errors";
import { buildPaginatedResult, toSkipTake } from "@/lib/db/pagination";
import { mergeSoftDeleteFilter } from "@/lib/db/soft-delete";
import { withTransaction } from "@/lib/db/transactions";
import type { PaginatedResult, PaginationInput, WithDeletedOption } from "@/lib/db/types";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import { BaseRepository } from "@/lib/repositories/base.repository";
import type { UpdateBrandProductInput } from "@/lib/validations/brand-product";

export type PublishedProduct = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    category: true;
    variants: {
      include: {
        inventory: true;
      };
    };
    media: true;
    seo: true;
  };
}>;

export type ProductListFilters = WithDeletedOption & {
  brandId?: string;
  brandIds?: string[];
  categoryId?: string;
  categoryIds?: string[];
  featured?: boolean;
  search?: string;
};

const publishedInclude = {
  brand: true,
  category: true,
  variants: {
    where: { deletedAt: null, active: true },
    include: {
      inventory: true,
    },
    orderBy: { price: "asc" as const },
  },
  media: {
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" as const },
  },
  seo: true,
} satisfies Prisma.ProductInclude;

/** Brand editor: includes inactive variants so managers can reactivate them. */
const editorInclude = {
  brand: true,
  category: true,
  variants: {
    where: { deletedAt: null },
    include: {
      inventory: true,
    },
    orderBy: [{ sortOrder: "asc" as const }, { price: "asc" as const }],
  },
  media: {
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" as const },
  },
  seo: true,
} satisfies Prisma.ProductInclude;

export type EditorProduct = Prisma.ProductGetPayload<{
  include: typeof editorInclude;
}>;

function inventoryStatusFor(available: number, reorderLevel: number): InventoryStatus {
  if (available <= 0) return InventoryStatus.OUT_OF_STOCK;
  if (available <= reorderLevel) return InventoryStatus.LOW_STOCK;
  return InventoryStatus.IN_STOCK;
}

export class ProductRepository extends BaseRepository {
  async findById(id: string, options: WithDeletedOption = {}) {
    return handlePrisma(() =>
      this.db.product.findFirst({
        where: mergeSoftDeleteFilter({ id }, options),
        include: publishedInclude,
      }),
    );
  }

  async findBySlug(slug: string, options: WithDeletedOption = {}) {
    return handlePrisma(() =>
      this.db.product.findFirst({
        where: mergeSoftDeleteFilter({ slug }, options),
        include: publishedInclude,
      }),
    );
  }

  async requireBySlug(slug: string, options: WithDeletedOption = {}) {
    const product = await this.findBySlug(slug, options);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  async listPublished(
    pagination: PaginationInput,
    filters: ProductListFilters = {},
  ): Promise<PaginatedResult<PublishedProduct>> {
    const where: Prisma.ProductWhereInput = mergeSoftDeleteFilter(
      {
        status: ProductStatus.PUBLISHED,
        visible: true,
        ...(filters.brandIds?.length
          ? { brandId: { in: filters.brandIds } }
          : filters.brandId
            ? { brandId: filters.brandId }
            : {}),
        ...(filters.categoryIds?.length
          ? { categoryId: { in: filters.categoryIds } }
          : filters.categoryId
            ? { categoryId: filters.categoryId }
            : {}),
        ...(filters.featured !== undefined ? { featured: filters.featured } : {}),
        ...(filters.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { slug: { contains: filters.search, mode: "insensitive" } },
                { barcode: { contains: filters.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      filters,
    );

    const { skip, take } = toSkipTake(pagination);

    const [items, total] = await handlePrisma(() =>
      Promise.all([
        this.db.product.findMany({
          where,
          skip,
          take,
          orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
          include: publishedInclude,
        }),
        this.db.product.count({ where }),
      ]),
    );

    return buildPaginatedResult(items, total, pagination);
  }

  /** Brand portal: all non-deleted products for a brand (any status). */
  async listByBrand(
    brandId: string,
    pagination: PaginationInput = { page: 1, pageSize: 50 },
  ): Promise<PaginatedResult<PublishedProduct>> {
    const where: Prisma.ProductWhereInput = {
      brandId,
      deletedAt: null,
    };
    const { skip, take } = toSkipTake(pagination);
    const [items, total] = await handlePrisma(() =>
      Promise.all([
        this.db.product.findMany({
          where,
          skip,
          take,
          orderBy: [{ updatedAt: "desc" }],
          include: publishedInclude,
        }),
        this.db.product.count({ where }),
      ]),
    );
    return buildPaginatedResult(items, total, pagination);
  }

  async create(data: Prisma.ProductCreateInput) {
    return handlePrisma(() =>
      this.db.product.create({
        data,
        include: publishedInclude,
      }),
    );
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return handlePrisma(() =>
      this.db.product.update({
        where: { id },
        data,
        include: publishedInclude,
      }),
    );
  }

  /**
   * Brand-scoped update — refuses if the product is not owned by `brandId`.
   */
  async updateForBrand(brandId: string, id: string, data: Prisma.ProductUpdateInput) {
    const existing = await handlePrisma(() =>
      this.db.product.findFirst({
        where: { id, brandId, deletedAt: null },
        select: { id: true },
      }),
    );
    if (!existing) {
      throw new NotFoundError("Product not found for this brand");
    }
    return this.update(id, data);
  }

  async softDelete(id: string) {
    return handlePrisma(() =>
      this.db.product.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: ProductStatus.ARCHIVED,
          visible: false,
        },
        include: publishedInclude,
      }),
    );
  }

  async softDeleteForBrand(brandId: string, id: string) {
    return this.updateForBrand(brandId, id, {
      deletedAt: new Date(),
      status: ProductStatus.ARCHIVED,
      visible: false,
    });
  }

  async findByIdForBrand(brandId: string, id: string) {
    return handlePrisma(() =>
      this.db.product.findFirst({
        where: { id, brandId, deletedAt: null },
        include: publishedInclude,
      }),
    );
  }

  async findForBrandEditor(brandId: string, id: string): Promise<EditorProduct | null> {
    return handlePrisma(() =>
      this.db.product.findFirst({
        where: { id, brandId, deletedAt: null },
        include: editorInclude,
      }),
    );
  }

  /**
   * Persist brand product editor payload — product fields, variants (+ inventory),
   * media, and SEO — scoped to `brandId`.
   */
  async saveEditorForBrand(
    brandId: string,
    input: UpdateBrandProductInput,
    actorId?: string,
  ): Promise<EditorProduct> {
    return withTransaction(async (tx) => {
      const existing = await tx.product.findFirst({
        where: { id: input.productId, brandId, deletedAt: null },
        include: editorInclude,
      });

      if (!existing) {
        throw new NotFoundError("Product not found for this brand");
      }

      const category = await tx.category.findFirst({
        where: { id: input.categoryId, deletedAt: null },
        select: { id: true },
      });
      if (!category) {
        throw new ValidationError("Category not found");
      }

      const slugConflict = await tx.product.findFirst({
        where: {
          slug: input.slug,
          deletedAt: null,
          NOT: { id: input.productId },
        },
        select: { id: true },
      });
      if (slugConflict) {
        throw new ConflictError("Another product already uses this slug");
      }

      if (input.barcode) {
        const barcodeConflict = await tx.product.findFirst({
          where: {
            barcode: input.barcode,
            deletedAt: null,
            NOT: { id: input.productId },
          },
          select: { id: true },
        });
        if (barcodeConflict) {
          throw new ConflictError("Another product already uses this barcode");
        }
      }

      const existingVariantIds = new Set(existing.variants.map((variant) => variant.id));
      const keptVariantIds = new Set(
        input.variants.map((variant) => variant.id).filter((id): id is string => Boolean(id)),
      );

      for (const variantId of keptVariantIds) {
        if (!existingVariantIds.has(variantId)) {
          throw new ValidationError("Variant does not belong to this product");
        }
      }

      for (const variant of input.variants) {
        const skuOwner = await tx.productVariant.findFirst({
          where: {
            sku: variant.sku,
            deletedAt: null,
            ...(variant.id ? { NOT: { id: variant.id } } : {}),
          },
          select: { id: true },
        });
        if (skuOwner) {
          throw new ConflictError(`SKU already in use: ${variant.sku}`);
        }
      }

      await tx.product.update({
        where: { id: input.productId },
        data: {
          name: input.name,
          slug: input.slug,
          barcode: input.barcode,
          shortDescription: input.shortDescription,
          description: input.description,
          categoryId: input.categoryId,
          featured: input.featured,
          newArrival: input.newArrival,
          bestSeller: input.bestSeller,
        },
      });

      for (const variant of existing.variants) {
        if (!keptVariantIds.has(variant.id)) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { deletedAt: new Date(), active: false },
          });
        }
      }

      for (const [index, variant] of input.variants.entries()) {
        const sortOrder = variant.sortOrder ?? index;
        const salePrice =
          variant.salePrice == null || Number.isNaN(variant.salePrice)
            ? null
            : variant.salePrice;

        if (variant.id) {
          const previous = existing.variants.find((row) => row.id === variant.id);
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              sku: variant.sku,
              sizeLabel: variant.sizeLabel,
              price: variant.price,
              salePrice,
              active: variant.active,
              sortOrder,
            },
          });

          const reorderLevel = variant.reorderLevel ?? previous?.inventory?.reorderLevel ?? 5;
          if (previous?.inventory) {
            const delta = variant.available - previous.inventory.available;
            if (delta !== 0) {
              const nextAvailable = previous.inventory.available + delta;
              if (nextAvailable < 0) {
                throw new ValidationError("Insufficient available stock for adjustment");
              }
              await tx.inventory.update({
                where: { id: previous.inventory.id },
                data: {
                  available: nextAvailable,
                  reorderLevel,
                  status: inventoryStatusFor(nextAvailable, reorderLevel),
                },
              });
              await tx.inventoryMovement.create({
                data: {
                  variantId: variant.id,
                  type: InventoryMovementType.ADJUSTMENT,
                  quantity: delta,
                  balanceAfter: nextAvailable,
                  reason: "Brand product editor stock update",
                  actorId,
                },
              });
            } else if (reorderLevel !== previous.inventory.reorderLevel) {
              await tx.inventory.update({
                where: { id: previous.inventory.id },
                data: {
                  reorderLevel,
                  status: inventoryStatusFor(previous.inventory.available, reorderLevel),
                },
              });
            }
          } else {
            await tx.inventory.create({
              data: {
                variantId: variant.id,
                available: variant.available,
                reorderLevel,
                status: inventoryStatusFor(variant.available, reorderLevel),
              },
            });
            if (variant.available > 0) {
              await tx.inventoryMovement.create({
                data: {
                  variantId: variant.id,
                  type: InventoryMovementType.RECEIPT,
                  quantity: variant.available,
                  balanceAfter: variant.available,
                  reason: "Initial stock from product editor",
                  actorId,
                },
              });
            }
          }
        } else {
          const created = await tx.productVariant.create({
            data: {
              productId: input.productId,
              sku: variant.sku,
              sizeLabel: variant.sizeLabel,
              price: variant.price,
              salePrice,
              active: variant.active,
              sortOrder,
              inventory: {
                create: {
                  available: variant.available,
                  reorderLevel: variant.reorderLevel,
                  status: inventoryStatusFor(variant.available, variant.reorderLevel),
                },
              },
            },
          });
          if (variant.available > 0) {
            await tx.inventoryMovement.create({
              data: {
                variantId: created.id,
                type: InventoryMovementType.RECEIPT,
                quantity: variant.available,
                balanceAfter: variant.available,
                reason: "Initial stock from product editor",
                actorId,
              },
            });
          }
        }
      }

      const existingMediaIds = new Set(existing.media.map((item) => item.id));
      const keptMediaIds = new Set(
        input.media.map((item) => item.id).filter((id): id is string => Boolean(id)),
      );

      for (const mediaId of keptMediaIds) {
        if (!existingMediaIds.has(mediaId)) {
          throw new ValidationError("Media item does not belong to this product");
        }
      }

      for (const item of existing.media) {
        if (!keptMediaIds.has(item.id)) {
          await tx.productMedia.update({
            where: { id: item.id },
            data: { deletedAt: new Date() },
          });
        }
      }

      const normalizedMedia =
        input.media.length > 0 && !input.media.some((item) => item.isPrimary)
          ? input.media.map((item, index) => ({ ...item, isPrimary: index === 0 }))
          : input.media;

      for (const [index, item] of normalizedMedia.entries()) {
        const sortOrder = item.sortOrder ?? index;
        if (item.id) {
          await tx.productMedia.update({
            where: { id: item.id },
            data: {
              url: item.url,
              altText: item.altText,
              sortOrder,
              isPrimary: item.isPrimary,
              type: MediaType.IMAGE,
            },
          });
        } else {
          await tx.productMedia.create({
            data: {
              productId: input.productId,
              url: item.url,
              altText: item.altText,
              sortOrder,
              isPrimary: item.isPrimary,
              type: MediaType.IMAGE,
              uploadedBy: actorId,
            },
          });
        }
      }

      if (input.seo) {
        await tx.productSEO.upsert({
          where: { productId: input.productId },
          create: {
            productId: input.productId,
            metaTitle: input.seo.metaTitle,
            metaDescription: input.seo.metaDescription,
            canonicalUrl: input.seo.canonicalUrl,
            keywords: input.seo.keywords,
          },
          update: {
            metaTitle: input.seo.metaTitle,
            metaDescription: input.seo.metaDescription,
            canonicalUrl: input.seo.canonicalUrl,
            keywords: input.seo.keywords,
            deletedAt: null,
          },
        });
      }

      const refreshed = await tx.product.findFirst({
        where: { id: input.productId, brandId, deletedAt: null },
        include: editorInclude,
      });

      if (!refreshed) {
        throw new NotFoundError("Product not found after save");
      }

      return refreshed;
    });
  }
}

export const productRepository = new ProductRepository();
