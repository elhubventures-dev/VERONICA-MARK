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

export const marketingPromotions: MarketingPromotion[] = [
  {
    id: "promo-1",
    name: "August Grand Opening Flash Sale",
    type: "PERCENTAGE",
    value: 20,
    status: "scheduled",
    priority: 100,
    stackable: false,
    targeting: "All perfumes",
    startsAt: "2026-08-01T00:00:00+01:00",
    endsAt: "2026-08-07T23:59:59+01:00",
    redemptions: 412,
    revenueAttributed: 68420,
  },
  {
    id: "promo-2",
    name: "Free shipping over €150",
    type: "FREE_SHIPPING",
    value: 0,
    status: "active",
    priority: 40,
    stackable: true,
    targeting: "Cart threshold",
    startsAt: "2026-07-01T00:00:00+01:00",
    endsAt: "2026-12-31T23:59:59+01:00",
    redemptions: 890,
    revenueAttributed: 0,
  },
  {
    id: "promo-3",
    name: "Welcome €15",
    type: "FIXED_AMOUNT",
    value: 15,
    status: "active",
    priority: 60,
    stackable: false,
    targeting: "First order customers",
    startsAt: "2026-06-01T00:00:00+01:00",
    endsAt: "2026-09-30T23:59:59+01:00",
    redemptions: 156,
    revenueAttributed: 22100,
  },
  {
    id: "promo-4",
    name: "Buy 2 get sample",
    type: "BXGY",
    value: 1,
    status: "scheduled",
    priority: 50,
    stackable: false,
    targeting: "Selected SKUs",
    startsAt: "2026-09-01T00:00:00+01:00",
    endsAt: "2026-09-15T23:59:59+01:00",
    redemptions: 0,
    revenueAttributed: 0,
  },
  {
    id: "promo-5",
    name: "Winter draft edit",
    type: "PERCENTAGE",
    value: 10,
    status: "draft",
    priority: 10,
    stackable: true,
    targeting: "Men category",
    startsAt: "2026-11-01T00:00:00+01:00",
    endsAt: "2026-11-30T23:59:59+01:00",
    redemptions: 0,
    revenueAttributed: 0,
  },
];

export const marketingCoupons: MarketingCoupon[] = [
  {
    id: "mc-1",
    code: "VM5AUG-20",
    promotionName: "August Grand Opening Flash Sale",
    status: "active",
    uses: 412,
    maxUses: 5000,
    minOrder: 0,
    startsAt: "2026-08-01T00:00:00+01:00",
    endsAt: "2026-08-07T23:59:59+01:00",
  },
  {
    id: "mc-1b",
    code: "AUGUST20",
    promotionName: "August Grand Opening Flash Sale (alias)",
    status: "active",
    uses: 88,
    maxUses: 500,
    minOrder: 0,
    startsAt: "2026-08-01T00:00:00+01:00",
    endsAt: "2026-08-07T23:59:59+01:00",
  },
  {
    id: "mc-2",
    code: "GRANDOPEN",
    promotionName: "Grand Opening soft launch",
    status: "active",
    uses: 148,
    maxUses: 500,
    minOrder: 80,
    startsAt: "2026-07-01T00:00:00+01:00",
    endsAt: "2026-08-31T23:59:59+01:00",
  },
  {
    id: "mc-3",
    code: "WELCOME15",
    promotionName: "Welcome €15",
    status: "active",
    uses: 156,
    maxUses: null,
    minOrder: 120,
    startsAt: "2026-06-01T00:00:00+01:00",
    endsAt: "2026-09-30T23:59:59+01:00",
  },
  {
    id: "mc-4",
    code: "SPRING10",
    promotionName: "Spring edit",
    status: "expired",
    uses: 220,
    maxUses: 300,
    minOrder: 100,
    startsAt: "2026-03-01T00:00:00+01:00",
    endsAt: "2026-05-31T23:59:59+01:00",
  },
];

export const marketingFlashSales: MarketingFlashSale[] = [
  {
    id: "mfs-1",
    title: "August Grand Opening Flash Sale",
    status: "scheduled",
    discountPercent: 20,
    startsAt: "2026-08-01T00:00:00+01:00",
    endsAt: "2026-08-07T23:59:59+01:00",
    productCount: 48,
    unitsSold: 612,
    revenue: 68420,
  },
  {
    id: "mfs-2",
    title: "After Dark Weekend",
    status: "scheduled",
    discountPercent: 15,
    startsAt: "2026-08-15T18:00:00+01:00",
    endsAt: "2026-08-17T23:59:59+01:00",
    productCount: 12,
    unitsSold: 0,
    revenue: 0,
  },
];

export const marketingWallet: MarketingWalletOverview = {
  totalBalance: 18420.5,
  currency: "EUR",
  activeWallets: 842,
  credits30d: 6200,
  debits30d: 3180,
  recent: [
    {
      id: "mw-1",
      customer: "Camille Dubois",
      type: "credit",
      amount: 25,
      reason: "Referral reward",
      createdAt: "2026-07-22T10:00:00+01:00",
    },
    {
      id: "mw-2",
      customer: "Louis Moreau",
      type: "debit",
      amount: 15,
      reason: "Applied at checkout",
      createdAt: "2026-07-21T16:20:00+01:00",
    },
    {
      id: "mw-3",
      customer: "Nora Ellis",
      type: "credit",
      amount: 30,
      reason: "Return store credit",
      createdAt: "2026-07-18T09:10:00+01:00",
    },
  ],
};

export const marketingRewardRules: MarketingRewardRule[] = [
  {
    id: "rr-1",
    name: "Earn on purchase",
    type: "earn",
    points: 1,
    description: "1 point per €1 spent (excl. shipping)",
    active: true,
  },
  {
    id: "rr-2",
    name: "Checkout redemption",
    type: "redeem",
    points: 100,
    description: "100 points = €5 wallet credit",
    active: true,
  },
  {
    id: "rr-3",
    name: "Points expiry",
    type: "expire",
    points: 0,
    description: "Unused points expire after 18 months",
    active: true,
  },
  {
    id: "rr-4",
    name: "Review bonus",
    type: "earn",
    points: 50,
    description: "Verified review bonus",
    active: false,
  },
];

export const marketingReferral: MarketingReferralStats = {
  codesIssued: 1260,
  invitationsSent: 3840,
  conversions: 312,
  rewardsPaid: 7800,
  currency: "EUR",
  topCodes: [
    { code: "CAMILLE-VM", owner: "Camille Dubois", conversions: 4, earned: 100 },
    { code: "LOUIS-VM", owner: "Louis Moreau", conversions: 2, earned: 50 },
    { code: "NORA-VM", owner: "Nora Ellis", conversions: 1, earned: 25 },
  ],
};

export const marketingAffiliates: MarketingAffiliate[] = [
  {
    id: "aff-1",
    name: "Scent Editorial Co.",
    email: "partners@scenteditorial.example",
    status: "active",
    commissionPercent: 8,
    clicks: 4200,
    conversions: 96,
    payoutDue: 1840,
    currency: "EUR",
  },
  {
    id: "aff-2",
    name: "Luxe Lifestyle Blog",
    email: "ads@luxelifestyle.example",
    status: "active",
    commissionPercent: 10,
    clicks: 2100,
    conversions: 41,
    payoutDue: 920,
    currency: "EUR",
  },
  {
    id: "aff-3",
    name: "Fragrance Weekly",
    email: "collab@fragranceweekly.example",
    status: "pending",
    commissionPercent: 7,
    clicks: 0,
    conversions: 0,
    payoutDue: 0,
    currency: "EUR",
  },
];

export const marketingPush: MarketingPushCampaign[] = [
  {
    id: "push-1",
    title: "Flash sale starts tonight",
    status: "scheduled",
    audience: "Push-opted perfume buyers",
    scheduledAt: "2026-07-31T18:00:00+01:00",
    sent: 0,
    opens: 0,
  },
  {
    id: "push-2",
    title: "Your bag is waiting",
    status: "sent",
    audience: "Abandoned cart 1h",
    scheduledAt: "2026-07-22T12:00:00+01:00",
    sent: 840,
    opens: 312,
  },
];

export const marketingEmailCampaigns: MarketingEmailCampaign[] = [
  {
    id: "em-1",
    name: "August Grand Opening announce",
    status: "scheduled",
    templateKey: "marketing.flash_sale",
    audience: "Marketing consented",
    scheduledAt: "2026-07-30T09:00:00+01:00",
    openRate: 0,
    clickRate: 0,
  },
  {
    id: "em-2",
    name: "Abandoned cart recovery #1",
    status: "sent",
    templateKey: "cart.abandoned",
    audience: "Open abandoned carts",
    scheduledAt: "2026-07-20T10:00:00+01:00",
    openRate: 38.2,
    clickRate: 9.4,
  },
  {
    id: "em-3",
    name: "Loyalty tier upgrade",
    status: "draft",
    templateKey: "rewards.tier",
    audience: "Near Gold → Platinum",
    scheduledAt: "2026-08-05T09:00:00+01:00",
    openRate: 0,
    clickRate: 0,
  },
];

export const marketingAbandonedCarts: MarketingAbandonedCart[] = [
  {
    id: "ac-1",
    customer: "Guest",
    email: "guest.paris@example.com",
    value: 210,
    currency: "EUR",
    items: 1,
    abandonedAt: "2026-07-23T19:40:00+01:00",
    remindersSent: 1,
    status: "open",
  },
  {
    id: "ac-2",
    customer: "Louis Moreau",
    email: "louis@example.com",
    value: 355,
    currency: "EUR",
    items: 2,
    abandonedAt: "2026-07-22T11:15:00+01:00",
    remindersSent: 2,
    status: "open",
  },
  {
    id: "ac-3",
    customer: "Camille Dubois",
    email: "customer@example.com",
    value: 148,
    currency: "EUR",
    items: 1,
    abandonedAt: "2026-07-18T08:00:00+01:00",
    remindersSent: 2,
    status: "recovered",
  },
];

export const marketingRecommendations: MarketingRecommendationConfig[] = [
  {
    id: "rec-1",
    name: "Homepage For You",
    placement: "Home · recommendations rail",
    algorithm: "collaborative + affinity",
    enabled: true,
    ctr: 4.8,
  },
  {
    id: "rec-2",
    name: "PDP Related",
    placement: "Product detail",
    algorithm: "same brand/category",
    enabled: true,
    ctr: 6.1,
  },
  {
    id: "rec-3",
    name: "Cart FBT",
    placement: "Cart",
    algorithm: "frequently bought together",
    enabled: false,
    ctr: 0,
  },
];

export const marketingRecentlyViewed: MarketingRecentlyViewedStat[] = [
  { productName: "Velvet Iris", views: 1840, addToCartRate: 12.4 },
  { productName: "Nocturne Oud", views: 1622, addToCartRate: 10.1 },
  { productName: "Soleil Néroli", views: 1510, addToCartRate: 14.2 },
  { productName: "Purple Reign", views: 980, addToCartRate: 8.6 },
];

export const marketingReviews: MarketingReviewModeration[] = [
  {
    id: "rv-1",
    productName: "Velvet Iris",
    author: "Amelia R.",
    rating: 5,
    excerpt: "Beautifully edited selection — every bottle feels considered.",
    status: "pending",
    verifiedPurchase: true,
    submittedAt: "2026-07-23T15:00:00+01:00",
  },
  {
    id: "rv-2",
    productName: "Nocturne Oud",
    author: "James L.",
    rating: 4,
    excerpt: "Elegant and distinctive. Projection is excellent.",
    status: "approved",
    verifiedPurchase: true,
    submittedAt: "2026-07-20T11:00:00+01:00",
  },
  {
    id: "rv-3",
    productName: "Purple Reign",
    author: "Anon",
    rating: 1,
    excerpt: "Spammy review content flagged by filters.",
    status: "rejected",
    verifiedPurchase: false,
    submittedAt: "2026-07-19T09:00:00+01:00",
  },
];

export const marketingComparison: MarketingComparisonStat = {
  sessions: 960,
  productsComparedAvg: 2.4,
  conversionLift: 11.2,
  topPairs: [
    { a: "Velvet Iris", b: "Soleil Néroli", count: 84 },
    { a: "Nocturne Oud", b: "Santal Minuit", count: 61 },
    { a: "Purple Reign", b: "Ambre Soie", count: 44 },
  ],
};

export const marketingAutomations: MarketingAutomation[] = [
  {
    id: "auto-1",
    name: "Abandoned cart drip",
    trigger: "Cart idle 1 hour",
    action: "Send email + push reminder",
    status: "active",
    runs30d: 840,
  },
  {
    id: "auto-2",
    name: "Flash sale activation",
    trigger: "Schedule window start",
    action: "Activate promotion + homepage banner",
    status: "active",
    runs30d: 2,
  },
  {
    id: "auto-3",
    name: "Review request",
    trigger: "Order delivered + 5 days",
    action: "Email review invitation",
    status: "active",
    runs30d: 210,
  },
  {
    id: "auto-4",
    name: "Win-back lapsed buyers",
    trigger: "No purchase 90 days",
    action: "Issue WELCOME15 coupon",
    status: "paused",
    runs30d: 0,
  },
];

export const marketingSchedule: MarketingScheduleItem[] = [
  {
    id: "sch-1",
    campaignType: "flash_sale",
    title: "August Grand Opening Flash Sale",
    startsAt: "2026-08-01T00:00:00+01:00",
    endsAt: "2026-08-07T23:59:59+01:00",
    owner: "Platform Marketing",
    status: "scheduled",
  },
  {
    id: "sch-2",
    campaignType: "email",
    title: "August Grand Opening announce",
    startsAt: "2026-07-30T09:00:00+01:00",
    endsAt: "2026-07-30T09:30:00+01:00",
    owner: "Platform Marketing",
    status: "scheduled",
  },
  {
    id: "sch-3",
    campaignType: "push",
    title: "Flash sale starts tonight",
    startsAt: "2026-07-31T18:00:00+01:00",
    endsAt: "2026-07-31T18:15:00+01:00",
    owner: "Platform Marketing",
    status: "scheduled",
  },
  {
    id: "sch-4",
    campaignType: "promotion",
    title: "After Dark Weekend",
    startsAt: "2026-08-15T18:00:00+01:00",
    endsAt: "2026-08-17T23:59:59+01:00",
    owner: "Brand Ops",
    status: "scheduled",
  },
];

export const marketingAnalytics = {
  promoRevenue30d: 90520,
  couponRedemptions30d: 716,
  abandonedRecoveryRate: 18.4,
  referralConversionRate: 8.1,
  emailOpenRate: 36.5,
  pushOpenRate: 37.1,
  series: [
    { day: "17 Jul", promo: 8200, organic: 4100 },
    { day: "18 Jul", promo: 9100, organic: 4300 },
    { day: "19 Jul", promo: 7600, organic: 3900 },
    { day: "20 Jul", promo: 11200, organic: 4500 },
    { day: "21 Jul", promo: 10400, organic: 4700 },
    { day: "22 Jul", promo: 12800, organic: 5200 },
    { day: "23 Jul", promo: 14100, organic: 4800 },
  ],
  channelMix: [
    { name: "Flash / promo", value: 42 },
    { name: "Email", value: 18 },
    { name: "Referral", value: 12 },
    { name: "Organic", value: 28 },
  ],
};

export const marketingDashboard = {
  activePromotions: marketingPromotions.filter((p) => p.status === "active").length,
  liveFlashSales: marketingFlashSales.filter((f) => f.status === "live").length,
  openAbandonedCarts: marketingAbandonedCarts.filter((c) => c.status === "open").length,
  pendingReviews: marketingReviews.filter((r) => r.status === "pending").length,
  scheduledCampaigns: marketingSchedule.filter((s) => s.status === "scheduled").length,
  activeAutomations: marketingAutomations.filter((a) => a.status === "active").length,
};
