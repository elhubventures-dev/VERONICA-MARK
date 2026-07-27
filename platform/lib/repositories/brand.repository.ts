import "server-only";

import { type Brand, type Prisma } from "@prisma/client";

import { handlePrisma } from "@/lib/db/errors";
import { buildPaginatedResult, toSkipTake } from "@/lib/db/pagination";
import { mergeSoftDeleteFilter } from "@/lib/db/soft-delete";
import type { PaginatedResult, PaginationInput, WithDeletedOption } from "@/lib/db/types";
import { NotFoundError } from "@/lib/errors";
import { BaseRepository } from "@/lib/repositories/base.repository";

export type BrandListFilters = WithDeletedOption & {
  featured?: boolean;
  search?: string;
  status?: Brand["status"];
};

export class BrandRepository extends BaseRepository {
  async findById(id: string, options: WithDeletedOption = {}) {
    return handlePrisma(() =>
      this.db.brand.findFirst({
        where: mergeSoftDeleteFilter({ id }, options),
      }),
    );
  }

  async findBySlug(slug: string, options: WithDeletedOption = {}) {
    return handlePrisma(() =>
      this.db.brand.findFirst({
        where: mergeSoftDeleteFilter({ slug }, options),
      }),
    );
  }

  async requireBySlug(slug: string, options: WithDeletedOption = {}) {
    const brand = await this.findBySlug(slug, options);
    if (!brand) {
      throw new NotFoundError("Brand not found");
    }
    return brand;
  }

  async list(
    pagination: PaginationInput,
    filters: BrandListFilters = {},
  ): Promise<PaginatedResult<Brand>> {
    const where: Prisma.BrandWhereInput = mergeSoftDeleteFilter(
      {
        ...(filters.featured !== undefined ? { featured: filters.featured } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.search
          ? {
              OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { slug: { contains: filters.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      filters,
    );

    const { skip, take } = toSkipTake(pagination);

    const [items, total] = await handlePrisma(() =>
      Promise.all([
        this.db.brand.findMany({
          where,
          skip,
          take,
          orderBy: { name: "asc" },
        }),
        this.db.brand.count({ where }),
      ]),
    );

    return buildPaginatedResult(items, total, pagination);
  }

  async resolveIdsBySlugs(slugs: string[]): Promise<string[]> {
    if (!slugs.length) return [];
    const rows = await handlePrisma(() =>
      this.db.brand.findMany({
        where: { slug: { in: slugs }, deletedAt: null },
        select: { id: true },
      }),
    );
    return rows.map((r) => r.id);
  }

  async create(data: Prisma.BrandCreateInput) {
    return handlePrisma(() => this.db.brand.create({ data }));
  }

  async update(id: string, data: Prisma.BrandUpdateInput) {
    return handlePrisma(() =>
      this.db.brand.update({
        where: { id },
        data,
      }),
    );
  }

  async softDelete(id: string) {
    return handlePrisma(() =>
      this.db.brand.update({
        where: { id },
        data: { deletedAt: new Date() },
      }),
    );
  }
}

export const brandRepository = new BrandRepository();
