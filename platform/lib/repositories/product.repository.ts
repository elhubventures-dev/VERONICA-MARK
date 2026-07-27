import "server-only";

import { type Prisma, ProductStatus } from "@prisma/client";

import { handlePrisma } from "@/lib/db/errors";
import { buildPaginatedResult, toSkipTake } from "@/lib/db/pagination";
import { mergeSoftDeleteFilter } from "@/lib/db/soft-delete";
import type { PaginatedResult, PaginationInput, WithDeletedOption } from "@/lib/db/types";
import { NotFoundError } from "@/lib/errors";
import { BaseRepository } from "@/lib/repositories/base.repository";

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
}

export const productRepository = new ProductRepository();
