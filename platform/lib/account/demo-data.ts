import type { OrderStatus } from "@/components/commerce/order-status-badge";

export type AccountOrderLine = {
  title: string;
  brand: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  image: string;
  productSlug?: string;
};

export type AccountOrder = {
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  email: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: AccountOrderLine[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  trackingNumber?: string;
  timeline: Array<{ label: string; at: string; done: boolean }>;
};

export type AccountAddress = {
  id: string;
  label: string;
  type: "SHIPPING" | "BILLING";
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
};

export type AccountNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
  category: "order" | "promo" | "system" | "rewards";
};

export type AccountWalletTx = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
};

export type AccountRewardTx = {
  id: string;
  points: number;
  description: string;
  createdAt: string;
};

export type AccountCoupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  expiresAt: string;
  status: "available" | "used" | "expired";
};

export type AccountReturn = {
  id: string;
  orderNumber: string;
  status: "requested" | "approved" | "received" | "refunded" | "rejected";
  reason: string;
  requestedAt: string;
  items: Array<{ title: string; quantity: number }>;
  refundAmount: number;
  currency: string;
};

export type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  language: string;
  currency: string;
  timezone: string;
};

export type AccountAnalytics = {
  ordersPlaced: number;
  spendYtd: number;
  avgOrderValue: number;
  pointsEarned: number;
  returnsRate: number;
  monthlySpend: Array<{ month: string; amount: number }>;
  categoryMix: Array<{ label: string; value: number }>;
};

/** Empty façades — dashboards render real Prisma data or empty states. */
export const accountOrders: AccountOrder[] = [];
export const accountAddresses: AccountAddress[] = [];
export const accountNotifications: AccountNotification[] = [];
export const accountCoupons: AccountCoupon[] = [];
export const accountReturns: AccountReturn[] = [];
export const accountWishlistSlugs: string[] = [];

export const accountWallet = {
  balance: 0,
  currency: "NGN",
  transactions: [] as AccountWalletTx[],
};

export const accountRewards = {
  points: 0,
  tier: "Member",
  nextTier: "Silver",
  pointsToNextTier: 500,
  transactions: [] as AccountRewardTx[],
};

export const accountProfile: AccountProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  language: "English",
  currency: "NGN",
  timezone: "Africa/Lagos",
};

export const accountReferral = {
  code: "",
  shareUrl: "",
  invited: 0,
  converted: 0,
  earned: 0,
  currency: "NGN",
  invitations: [] as Array<{ email: string; status: "joined" | "pending"; sentAt: string }>,
};

export const accountSecurity = {
  lastPasswordChange: "",
  twoFactorEnabled: false,
  sessions: [] as Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
  }>,
};

export const accountSettings = {
  emailOrderUpdates: true,
  emailPromotions: false,
  emailRewards: false,
  pushEnabled: false,
  smsEnabled: false,
  marketingConsent: false,
  theme: "system" as "light" | "dark" | "system",
};

export const accountAnalytics: AccountAnalytics = {
  ordersPlaced: 0,
  spendYtd: 0,
  avgOrderValue: 0,
  pointsEarned: 0,
  returnsRate: 0,
  monthlySpend: [],
  categoryMix: [],
};
