export type MarketingPromotion = {
  id: string;
  name: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING" | "BXGY";
  value: number;
  status: "draft" | "scheduled" | "active" | "ended" | "paused";
  priority: number;
  stackable: boolean;
  targeting: string;
  startsAt: string;
  endsAt: string;
  redemptions: number;
  revenueAttributed: number;
};

export type MarketingCoupon = {
  id: string;
  code: string;
  promotionName: string;
  status: "active" | "scheduled" | "exhausted" | "expired";
  uses: number;
  maxUses: number | null;
  minOrder: number;
  startsAt: string;
  endsAt: string;
};

export type MarketingFlashSale = {
  id: string;
  title: string;
  status: "live" | "scheduled" | "ended";
  discountPercent: number;
  startsAt: string;
  endsAt: string;
  productCount: number;
  unitsSold: number;
  revenue: number;
};

export type MarketingWalletOverview = {
  totalBalance: number;
  currency: string;
  activeWallets: number;
  credits30d: number;
  debits30d: number;
  recent: Array<{
    id: string;
    customer: string;
    type: "credit" | "debit";
    amount: number;
    reason: string;
    createdAt: string;
  }>;
};

export type MarketingRewardRule = {
  id: string;
  name: string;
  type: "earn" | "redeem" | "expire";
  points: number;
  description: string;
  active: boolean;
};

export type MarketingReferralStats = {
  codesIssued: number;
  invitationsSent: number;
  conversions: number;
  rewardsPaid: number;
  currency: string;
  topCodes: Array<{ code: string; owner: string; conversions: number; earned: number }>;
};

export type MarketingAffiliate = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "active" | "paused" | "rejected";
  commissionPercent: number;
  clicks: number;
  conversions: number;
  payoutDue: number;
  currency: string;
};

export type MarketingPushCampaign = {
  id: string;
  title: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  audience: string;
  scheduledAt: string;
  sent: number;
  opens: number;
};

export type MarketingEmailCampaign = {
  id: string;
  name: string;
  status: "draft" | "scheduled" | "sending" | "sent";
  templateKey: string;
  audience: string;
  scheduledAt: string;
  openRate: number;
  clickRate: number;
};

export type MarketingAbandonedCart = {
  id: string;
  customer: string;
  email: string;
  value: number;
  currency: string;
  items: number;
  abandonedAt: string;
  remindersSent: number;
  status: "open" | "recovered" | "expired";
};

export type MarketingRecommendationConfig = {
  id: string;
  name: string;
  placement: string;
  algorithm: string;
  enabled: boolean;
  ctr: number;
};

export type MarketingRecentlyViewedStat = {
  productName: string;
  views: number;
  addToCartRate: number;
};

export type MarketingReviewModeration = {
  id: string;
  productName: string;
  author: string;
  rating: number;
  excerpt: string;
  status: "pending" | "approved" | "rejected";
  verifiedPurchase: boolean;
  submittedAt: string;
};

export type MarketingComparisonStat = {
  sessions: number;
  productsComparedAvg: number;
  conversionLift: number;
  topPairs: Array<{ a: string; b: string; count: number }>;
};

export type MarketingAutomation = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "active" | "paused" | "draft";
  runs30d: number;
};

export type MarketingScheduleItem = {
  id: string;
  campaignType: "promotion" | "flash_sale" | "email" | "push";
  title: string;
  startsAt: string;
  endsAt: string;
  owner: string;
  status: "scheduled" | "live" | "completed";
};

/** Empty façades — marketing portal renders Prisma data or empty states. */
export const marketingPromotions: MarketingPromotion[] = [];
export const marketingCoupons: MarketingCoupon[] = [];
export const marketingFlashSales: MarketingFlashSale[] = [];
export const marketingRewardRules: MarketingRewardRule[] = [];
export const marketingAffiliates: MarketingAffiliate[] = [];
export const marketingPush: MarketingPushCampaign[] = [];
export const marketingEmailCampaigns: MarketingEmailCampaign[] = [];
export const marketingAbandonedCarts: MarketingAbandonedCart[] = [];
export const marketingRecommendations: MarketingRecommendationConfig[] = [];
export const marketingRecentlyViewed: MarketingRecentlyViewedStat[] = [];
export const marketingReviews: MarketingReviewModeration[] = [];
export const marketingAutomations: MarketingAutomation[] = [];
export const marketingSchedule: MarketingScheduleItem[] = [];

export const marketingWallet: MarketingWalletOverview = {
  totalBalance: 0,
  currency: "NGN",
  activeWallets: 0,
  credits30d: 0,
  debits30d: 0,
  recent: [],
};

export const marketingReferral: MarketingReferralStats = {
  codesIssued: 0,
  invitationsSent: 0,
  conversions: 0,
  rewardsPaid: 0,
  currency: "NGN",
  topCodes: [],
};

export const marketingComparison: MarketingComparisonStat = {
  sessions: 0,
  productsComparedAvg: 0,
  conversionLift: 0,
  topPairs: [],
};

export const marketingAnalytics = {
  promoRevenue30d: 0,
  couponRedemptions30d: 0,
  abandonedRecoveryRate: 0,
  referralConversionRate: 0,
  emailOpenRate: 0,
  pushOpenRate: 0,
  series: [] as Array<{ day: string; promo: number; organic: number }>,
  channelMix: [] as Array<{ name: string; value: number }>,
};

export const marketingDashboard = {
  activePromotions: 0,
  liveFlashSales: 0,
  openAbandonedCarts: 0,
  pendingReviews: 0,
  scheduledCampaigns: 0,
  activeAutomations: 0,
};
