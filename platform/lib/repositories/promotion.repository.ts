import "server-only";

import { PromotionStatus, type Prisma } from "@prisma/client";

import { handlePrisma } from "@/lib/db/errors";
import { BaseRepository } from "@/lib/repositories/base.repository";

const promotionInclude = {
  coupons: true,
  brands: true,
  categories: true,
  products: true,
} satisfies Prisma.PromotionInclude;

export type ActivePromotion = Prisma.PromotionGetPayload<{
  include: typeof promotionInclude;
}>;

export class PromotionRepository extends BaseRepository {
  async findById(id: string) {
    return handlePrisma(() =>
      this.db.promotion.findUnique({
        where: { id },
        include: promotionInclude,
      }),
    );
  }

  async findActivePromotions(at: Date = new Date()): Promise<ActivePromotion[]> {
    return handlePrisma(() =>
      this.db.promotion.findMany({
        where: {
          status: PromotionStatus.ACTIVE,
          startsAt: { lte: at },
          endsAt: { gte: at },
        },
        include: promotionInclude,
        orderBy: [{ priority: "desc" }, { startsAt: "asc" }],
      }),
    );
  }

  async findActiveByCouponCode(code: string, at: Date = new Date()) {
    return handlePrisma(() =>
      this.db.coupon.findFirst({
        where: {
          code: code.toUpperCase(),
          status: "ACTIVE",
          OR: [{ expiresAt: null }, { expiresAt: { gte: at } }],
          promotion: {
            status: PromotionStatus.ACTIVE,
            startsAt: { lte: at },
            endsAt: { gte: at },
          },
        },
        include: {
          promotion: {
            include: promotionInclude,
          },
        },
      }),
    );
  }

  async listPromotions(limit = 50) {
    return handlePrisma(() =>
      this.db.promotion.findMany({
        where: { deletedAt: null },
        include: promotionInclude,
        orderBy: [{ priority: "desc" }, { startsAt: "desc" }],
        take: limit,
      }),
    );
  }

  async listCoupons(limit = 50) {
    return handlePrisma(() =>
      this.db.coupon.findMany({
        where: { deletedAt: null },
        include: { promotion: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    );
  }

  async listCouponsForBrand(brandId: string, limit = 50) {
    return handlePrisma(() =>
      this.db.coupon.findMany({
        where: {
          deletedAt: null,
          OR: [
            { promotion: { brands: { some: { brandId } } } },
            { promotion: { products: { some: { product: { brandId } } } } },
          ],
        },
        include: { promotion: { include: promotionInclude } },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    );
  }

  async listPromotionsForBrand(brandId: string, limit = 50) {
    return handlePrisma(() =>
      this.db.promotion.findMany({
        where: {
          deletedAt: null,
          OR: [
            { brands: { some: { brandId } } },
            { products: { some: { product: { brandId } } } },
          ],
        },
        include: promotionInclude,
        orderBy: [{ priority: "desc" }, { startsAt: "desc" }],
        take: limit,
      }),
    );
  }

  async create(data: Prisma.PromotionCreateInput) {
    return handlePrisma(() =>
      this.db.promotion.create({
        data,
        include: promotionInclude,
      }),
    );
  }
}

export const promotionRepository = new PromotionRepository();
