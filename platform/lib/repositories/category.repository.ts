import "server-only";

import { handlePrisma } from "@/lib/db/errors";
import { NotFoundError } from "@/lib/errors";
import { BaseRepository } from "@/lib/repositories/base.repository";

export class CategoryRepository extends BaseRepository {
  async findBySlug(slug: string) {
    return handlePrisma(() =>
      this.db.category.findFirst({
        where: { slug, deletedAt: null },
        include: {
          parent: true,
          children: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
          _count: { select: { products: { where: { deletedAt: null, status: "PUBLISHED", visible: true } } } },
        },
      }),
    );
  }

  async requireBySlug(slug: string) {
    const category = await this.findBySlug(slug);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async list(options: { featuredOnly?: boolean; rootOnly?: boolean } = {}) {
    return handlePrisma(() =>
      this.db.category.findMany({
        where: {
          deletedAt: null,
          ...(options.featuredOnly ? { featured: true } : {}),
          ...(options.rootOnly ? { parentId: null } : {}),
        },
        include: {
          parent: true,
          _count: { select: { products: { where: { deletedAt: null, status: "PUBLISHED", visible: true } } } },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
    );
  }

  async resolveIdsBySlugs(slugs: string[]): Promise<string[]> {
    if (!slugs.length) return [];
    const rows = await handlePrisma(() =>
      this.db.category.findMany({
        where: { slug: { in: slugs }, deletedAt: null },
        select: { id: true },
      }),
    );
    return rows.map((r) => r.id);
  }
}

export const categoryRepository = new CategoryRepository();
