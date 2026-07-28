import "server-only";

import type { PromotionStatus } from "@prisma/client";

import {
  marketingAbandonedCarts,
  marketingAffiliates,
  marketingAnalytics,
  marketingAutomations,
  marketingComparison,
  marketingCoupons,
  marketingDashboard,
  marketingEmailCampaigns,
  marketingFlashSales,
  marketingPromotions,
  marketingPush,
  marketingRecentlyViewed,
  marketingRecommendations,
  marketingReferral,
  marketingReviews,
  marketingRewardRules,
  marketingSchedule,
  marketingWallet,
  type MarketingCoupon,
  type MarketingFlashSale,
  type MarketingPromotion,
} from "@/lib/marketing/demo-data";
import { promotionRepository } from "@/lib/repositories/promotion.repository";

function mapPromoStatus(status: PromotionStatus, startsAt: Date, endsAt: Date): MarketingPromotion["status"] {
  const now = Date.now();
  if (status === "DRAFT") return "draft";
  if (status === "PAUSED") return "paused";
  if (status === "EXPIRED" || endsAt.getTime() < now) return "ended";
  if (status === "SCHEDULED" || startsAt.getTime() > now) return "scheduled";
  if (status === "ACTIVE") return "active";
  return "ended";
}

export async function getMarketingDashboard() {
  try {
    const promotions = await getMarketingPromotions();
    return {
      ...marketingDashboard,
      activePromotions: promotions.filter((p) => p.status === "active").length,
      analytics: marketingAnalytics,
      upcoming: marketingSchedule.filter((s) => s.status === "scheduled").slice(0, 4),
      openCarts: marketingAbandonedCarts.filter((c) => c.status === "open").slice(0, 4),
      pendingReviews: marketingReviews.filter((r) => r.status === "pending"),
    };
  } catch {
    return {
      ...marketingDashboard,
      analytics: marketingAnalytics,
      upcoming: marketingSchedule.filter((s) => s.status === "scheduled").slice(0, 4),
      openCarts: marketingAbandonedCarts.filter((c) => c.status === "open").slice(0, 4),
      pendingReviews: marketingReviews.filter((r) => r.status === "pending"),
    };
  }
}

export async function getMarketingPromotions(): Promise<MarketingPromotion[]> {
  try {
    const promos = await promotionRepository.listPromotions(50);
    if (promos.length) {
      return promos.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type as MarketingPromotion["type"],
        value: Number(p.value),
        status: mapPromoStatus(p.status, p.startsAt, p.endsAt),
        priority: p.priority,
        stackable: p.stackable,
        targeting: p.brands.length || p.categories.length || p.products.length ? "targeted" : "sitewide",
        startsAt: p.startsAt.toISOString(),
        endsAt: p.endsAt.toISOString(),
        redemptions: p.usedCount,
        revenueAttributed: 0,
      }));
    }
  } catch {
    // demo fallback
  }
  return marketingPromotions;
}

export async function getMarketingCoupons(): Promise<MarketingCoupon[]> {
  try {
    const coupons = await promotionRepository.listCoupons(50);
    if (coupons.length) {
      const now = Date.now();
      return coupons.map((c) => {
        const starts = c.startsAt ?? c.promotion.startsAt;
        const ends = c.expiresAt ?? c.promotion.endsAt;
        let status: MarketingCoupon["status"] = "active";
        if (c.status === "EXPIRED" || ends.getTime() < now) status = "expired";
        else if (c.usageLimit != null && c.usedCount >= c.usageLimit) status = "exhausted";
        else if (starts.getTime() > now) status = "scheduled";

        return {
          id: c.id,
          code: c.code,
          promotionName: c.promotion.name,
          status,
          uses: c.usedCount,
          maxUses: c.usageLimit,
          minOrder: Number(c.promotion.minimumOrderAmount ?? 0),
          startsAt: starts.toISOString(),
          endsAt: ends.toISOString(),
        };
      });
    }
  } catch {
    // demo fallback
  }
  return marketingCoupons;
}

export async function getMarketingFlashSales(): Promise<MarketingFlashSale[]> {
  try {
    const promos = await promotionRepository.listPromotions(50);
    const flash = promos.filter((p) => p.type === "PERCENTAGE");
    if (flash.length) {
      const now = Date.now();
      return flash.map((p) => {
        let status: MarketingFlashSale["status"] = "live";
        if (p.endsAt.getTime() < now) status = "ended";
        else if (p.startsAt.getTime() > now) status = "scheduled";
        return {
          id: p.id,
          title: p.name,
          status,
          discountPercent: Number(p.value),
          startsAt: p.startsAt.toISOString(),
          endsAt: p.endsAt.toISOString(),
          productCount: p.products.length || 0,
          unitsSold: p.usedCount,
          revenue: 0,
        };
      });
    }
  } catch {
    // demo fallback
  }
  return marketingFlashSales;
}

export async function getMarketingWallet() {
  return marketingWallet;
}

export async function getMarketingRewardRules() {
  return marketingRewardRules;
}

export async function getMarketingReferral() {
  return marketingReferral;
}

export async function getMarketingAffiliates() {
  return marketingAffiliates;
}

export async function getMarketingPush() {
  return marketingPush;
}

export async function getMarketingEmailCampaigns() {
  return marketingEmailCampaigns;
}

export async function getMarketingAbandonedCarts() {
  return marketingAbandonedCarts;
}

export async function getMarketingRecommendations() {
  return marketingRecommendations;
}

export async function getMarketingRecentlyViewed() {
  return marketingRecentlyViewed;
}

export async function getMarketingReviews() {
  return marketingReviews;
}

export async function getMarketingComparison() {
  return marketingComparison;
}

export async function getMarketingAnalytics() {
  return marketingAnalytics;
}

export async function getMarketingAutomations() {
  return marketingAutomations;
}

export async function getMarketingSchedule() {
  return marketingSchedule;
}
