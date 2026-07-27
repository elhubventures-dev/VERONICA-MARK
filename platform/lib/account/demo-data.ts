import type { OrderStatus } from "@/components/commerce/order-status-badge";
import { demoProducts } from "@/lib/storefront/demo-catalog";

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

const perfumeImg = (slug: string) =>
  demoProducts.find((p) => p.slug === slug)?.image ??
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85";

export const accountOrders: AccountOrder[] = [
  {
    orderNumber: "VM-2026-0004",
    placedAt: "2026-07-22T09:14:00+01:00",
    status: "shipped",
    email: "customer@example.com",
    shippingAddress: {
      name: "Camille Dubois",
      line1: "18 Avenue Montaigne",
      city: "Paris",
      postalCode: "75008",
      country: "France",
    },
    items: [
      {
        title: "Ambre Soie",
        brand: "Maison Violette",
        variant: "100 ml",
        quantity: 1,
        unitPrice: 175,
        image: perfumeImg("ambre-soie"),
        productSlug: "ambre-soie",
      },
    ],
    subtotal: 175,
    tax: 35,
    shipping: 0,
    discount: 0,
    total: 210,
    currency: "EUR",
    trackingNumber: "VMTRK884201",
    timeline: [
      { label: "Order placed", at: "22 Jul · 09:14", done: true },
      { label: "Payment confirmed", at: "22 Jul · 09:15", done: true },
      { label: "Packed", at: "22 Jul · 16:40", done: true },
      { label: "Shipped", at: "23 Jul · 11:02", done: true },
      { label: "Out for delivery", at: "—", done: false },
      { label: "Delivered", at: "—", done: false },
    ],
  },
  {
    orderNumber: "VM-2026-0001",
    placedAt: "2026-07-20T14:32:00+01:00",
    status: "confirmed",
    email: "customer@example.com",
    shippingAddress: {
      name: "Camille Dubois",
      line1: "18 Avenue Montaigne",
      city: "Paris",
      postalCode: "75008",
      country: "France",
    },
    items: [
      {
        title: "Velvet Iris",
        brand: "Maison Violette",
        variant: "100 ml",
        quantity: 1,
        unitPrice: 165,
        image: perfumeImg("velvet-iris"),
        productSlug: "velvet-iris",
      },
      {
        title: "Nocturne Oud",
        brand: "Atelier Noir",
        variant: "50 ml",
        quantity: 1,
        unitPrice: 151,
        image: perfumeImg("nocturne-oud"),
        productSlug: "nocturne-oud",
      },
    ],
    subtotal: 316,
    tax: 63.2,
    shipping: 12,
    discount: 31.6,
    total: 359.6,
    currency: "EUR",
    timeline: [
      { label: "Order placed", at: "20 Jul · 14:32", done: true },
      { label: "Payment confirmed", at: "20 Jul · 14:33", done: true },
      { label: "Processing", at: "20 Jul · 18:00", done: true },
      { label: "Shipped", at: "—", done: false },
      { label: "Delivered", at: "—", done: false },
    ],
  },
  {
    orderNumber: "VM-2026-0002",
    placedAt: "2026-06-12T11:05:00+01:00",
    status: "delivered",
    email: "customer@example.com",
    shippingAddress: {
      name: "Camille Dubois",
      line1: "18 Avenue Montaigne",
      city: "Paris",
      postalCode: "75008",
      country: "France",
    },
    items: [
      {
        title: "Soleil Néroli",
        brand: "Or Jardin",
        variant: "100 ml",
        quantity: 1,
        unitPrice: 148,
        image: perfumeImg("soleil-neroli"),
        productSlug: "soleil-neroli",
      },
    ],
    subtotal: 148,
    tax: 29.6,
    shipping: 12,
    discount: 0,
    total: 189.6,
    currency: "EUR",
    trackingNumber: "VMTRK771902",
    timeline: [
      { label: "Order placed", at: "12 Jun · 11:05", done: true },
      { label: "Shipped", at: "13 Jun · 09:20", done: true },
      { label: "Delivered", at: "15 Jun · 14:10", done: true },
    ],
  },
  {
    orderNumber: "VM-2026-0003",
    placedAt: "2026-05-03T16:48:00+01:00",
    status: "completed",
    email: "customer@example.com",
    shippingAddress: {
      name: "Camille Dubois",
      line1: "42 Rue du Bac",
      city: "Paris",
      postalCode: "75007",
      country: "France",
    },
    items: [
      {
        title: "Purple Reign",
        brand: "Maison Violette",
        variant: "100 ml",
        quantity: 1,
        unitPrice: 195,
        image: perfumeImg("purple-reign"),
        productSlug: "purple-reign",
      },
    ],
    subtotal: 195,
    tax: 39,
    shipping: 0,
    discount: 19.5,
    total: 214.5,
    currency: "EUR",
    timeline: [
      { label: "Order placed", at: "3 May · 16:48", done: true },
      { label: "Delivered", at: "6 May · 10:22", done: true },
      { label: "Completed", at: "20 May · 00:00", done: true },
    ],
  },
];

export const accountAddresses: AccountAddress[] = [
  {
    id: "addr-ship-1",
    label: "Home",
    type: "SHIPPING",
    name: "Camille Dubois",
    line1: "18 Avenue Montaigne",
    city: "Paris",
    postalCode: "75008",
    country: "France",
    phone: "+33 6 12 34 56 78",
    isDefault: true,
  },
  {
    id: "addr-bill-1",
    label: "Billing",
    type: "BILLING",
    name: "Camille Dubois",
    line1: "18 Avenue Montaigne",
    city: "Paris",
    postalCode: "75008",
    country: "France",
    isDefault: true,
  },
  {
    id: "addr-ship-2",
    label: "Office",
    type: "SHIPPING",
    name: "Camille Dubois",
    line1: "42 Rue du Bac",
    line2: "Floor 3",
    city: "Paris",
    postalCode: "75007",
    country: "France",
    phone: "+33 6 12 34 56 78",
    isDefault: false,
  },
];

export const accountNotifications: AccountNotification[] = [
  {
    id: "n1",
    title: "Your order has shipped",
    body: "VM-2026-0004 is on its way. Tracking: VMTRK884201.",
    createdAt: "2026-07-23T11:05:00+01:00",
    read: false,
    href: "/account/orders/VM-2026-0004",
    category: "order",
  },
  {
    id: "n2",
    title: "Flash sale ends soon",
    body: "August Grand Opening pricing closes 7 August.",
    createdAt: "2026-07-22T08:00:00+01:00",
    read: false,
    href: "/flash-sale",
    category: "promo",
  },
  {
    id: "n3",
    title: "You earned 210 points",
    body: "Reward points credited for order VM-2026-0004.",
    createdAt: "2026-07-22T09:20:00+01:00",
    read: true,
    href: "/account/rewards",
    category: "rewards",
  },
  {
    id: "n4",
    title: "Return approved",
    body: "Return RT-2026-0012 has been approved. Pack your item when ready.",
    createdAt: "2026-06-18T15:30:00+01:00",
    read: true,
    href: "/account/returns/RT-2026-0012",
    category: "order",
  },
];

export const accountWallet = {
  balance: 42.5,
  currency: "EUR",
  transactions: [
    {
      id: "w1",
      type: "credit" as const,
      amount: 25,
      currency: "EUR",
      description: "Referral reward — Amélie joined",
      createdAt: "2026-07-10T12:00:00+01:00",
    },
    {
      id: "w2",
      type: "credit" as const,
      amount: 30,
      currency: "EUR",
      description: "Store credit from return RT-2026-0012",
      createdAt: "2026-06-25T10:15:00+01:00",
    },
    {
      id: "w3",
      type: "debit" as const,
      amount: 12.5,
      currency: "EUR",
      description: "Applied to order VM-2026-0002",
      createdAt: "2026-06-12T11:05:00+01:00",
    },
  ] satisfies AccountWalletTx[],
};

export const accountRewards = {
  points: 1840,
  tier: "Gold",
  nextTier: "Platinum",
  pointsToNextTier: 160,
  transactions: [
    {
      id: "r1",
      points: 210,
      description: "Order VM-2026-0004",
      createdAt: "2026-07-22T09:20:00+01:00",
    },
    {
      id: "r2",
      points: 360,
      description: "Order VM-2026-0001",
      createdAt: "2026-07-20T14:40:00+01:00",
    },
    {
      id: "r3",
      points: -500,
      description: "Redeemed for €25 wallet credit",
      createdAt: "2026-07-01T09:00:00+01:00",
    },
    {
      id: "r4",
      points: 215,
      description: "Order VM-2026-0003",
      createdAt: "2026-05-03T17:00:00+01:00",
    },
  ] satisfies AccountRewardTx[],
};

export const accountCoupons: AccountCoupon[] = [
  {
    id: "c1",
    code: "VM5AUG-20",
    title: "August Grand Opening",
    description: "20% off signature compositions (1–7 August)",
    type: "PERCENTAGE",
    value: 20,
    expiresAt: "2026-08-07T23:59:59+01:00",
    status: "available",
  },
  {
    id: "c1b",
    code: "GRANDOPEN",
    title: "Grand Opening",
    description: "20% off your next fragrance order",
    type: "PERCENTAGE",
    value: 20,
    expiresAt: "2026-08-31T23:59:59+01:00",
    status: "available",
  },
  {
    id: "c2",
    code: "WELCOME15",
    title: "Welcome gift",
    description: "15% off your first order",
    type: "PERCENTAGE",
    value: 15,
    expiresAt: "2026-09-30T23:59:59+01:00",
    status: "available",
  },
  {
    id: "c3",
    code: "FREESHIP",
    title: "Complimentary delivery",
    description: "Free standard shipping on your next order",
    type: "FREE_SHIPPING",
    value: 0,
    expiresAt: "2026-08-15T23:59:59+01:00",
    status: "available",
  },
  {
    id: "c4",
    code: "SPRING10",
    title: "Spring edit",
    description: "Used on order VM-2026-0003",
    type: "PERCENTAGE",
    value: 10,
    expiresAt: "2026-05-31T23:59:59+01:00",
    status: "used",
  },
];

export const accountReturns: AccountReturn[] = [
  {
    id: "RT-2026-0012",
    orderNumber: "VM-2026-0002",
    status: "refunded",
    reason: "Changed mind — unused, sealed",
    requestedAt: "2026-06-16T09:00:00+01:00",
    items: [{ title: "Soleil Néroli · 100 ml", quantity: 1 }],
    refundAmount: 30,
    currency: "EUR",
  },
];

export const accountProfile: AccountProfile = {
  firstName: "Camille",
  lastName: "Dubois",
  email: "customer@example.com",
  phone: "+33 6 12 34 56 78",
  dateOfBirth: "1992-04-18",
  gender: "Prefer not to say",
  language: "English",
  currency: "EUR",
  timezone: "Europe/Paris",
};

export const accountReferral = {
  code: "CAMILLE-VM",
  shareUrl: "https://veronicamark.com/r/CAMILLE-VM",
  invited: 3,
  converted: 1,
  earned: 25,
  currency: "EUR",
  invitations: [
    { email: "amelie@example.com", status: "joined" as const, sentAt: "2026-07-01" },
    { email: "louis@example.com", status: "pending" as const, sentAt: "2026-07-15" },
    { email: "nora@example.com", status: "pending" as const, sentAt: "2026-07-18" },
  ],
};

export const accountSecurity = {
  lastPasswordChange: "2026-04-02T10:00:00+01:00",
  twoFactorEnabled: false,
  sessions: [
    {
      id: "s1",
      device: "Chrome on Windows",
      location: "Paris, FR",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "s2",
      device: "Safari on iPhone",
      location: "Paris, FR",
      lastActive: "2 days ago",
      current: false,
    },
  ],
};

export const accountSettings = {
  emailOrderUpdates: true,
  emailPromotions: true,
  emailRewards: true,
  pushEnabled: false,
  smsEnabled: false,
  marketingConsent: true,
  theme: "system" as "light" | "dark" | "system",
};

export const accountAnalytics: AccountAnalytics = {
  ordersPlaced: 4,
  spendYtd: 973.7,
  avgOrderValue: 243.43,
  pointsEarned: 1840,
  returnsRate: 25,
  monthlySpend: [
    { month: "Feb", amount: 0 },
    { month: "Mar", amount: 0 },
    { month: "Apr", amount: 0 },
    { month: "May", amount: 214.5 },
    { month: "Jun", amount: 189.6 },
    { month: "Jul", amount: 569.6 },
  ],
  categoryMix: [
    { label: "Women", value: 52 },
    { label: "Men", value: 28 },
    { label: "Perfumes", value: 20 },
  ],
};

export const accountWishlistSlugs = ["velvet-iris", "santal-minuit", "figue-dor"];
