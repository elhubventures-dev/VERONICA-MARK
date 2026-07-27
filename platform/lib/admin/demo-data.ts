export type AdminBrandStatus = "pending" | "active" | "suspended" | "archived";

export type AdminBrand = {
  id: string;
  name: string;
  slug: string;
  status: AdminBrandStatus;
  managers: number;
  products: number;
  revenue30d: number;
  createdAt: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  status: "active" | "restricted" | "deleted";
  orders: number;
  spend: number;
  riskScore: number;
  country: string;
  joinedAt: string;
};

export type AdminOrder = {
  orderNumber: string;
  placedAt: string;
  status: string;
  customerName: string;
  brandName: string;
  total: number;
  currency: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  shippingStatus: "unfulfilled" | "packed" | "shipped" | "delivered";
};

export type AdminPayment = {
  id: string;
  orderNumber: string;
  provider: "Paystack" | "SquadCo";
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  createdAt: string;
};

export type AdminShipment = {
  id: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  status: "label_created" | "in_transit" | "out_for_delivery" | "delivered" | "exception";
  destination: string;
  updatedAt: string;
};

export type AdminCmsPage = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  updatedAt: string;
  author: string;
};

export type AdminFeatureFlag = {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercent: number;
  environments: string[];
  updatedAt: string;
};

export type AdminLocale = {
  code: string;
  name: string;
  enabled: boolean;
  coveragePercent: number;
  defaultCurrency: string;
};

export type AdminEmailTemplate = {
  id: string;
  key: string;
  name: string;
  channel: "transactional" | "marketing" | "operational";
  locale: string;
  updatedAt: string;
  description?: string;
  audience?: string;
};

export type AdminAuditLog = {
  id: string;
  actor: string;
  action: string;
  resource: string;
  recordId: string;
  summary: string;
  ip: string;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "BRAND_MANAGER" | "CUSTOMER";
  status: "active" | "invited" | "disabled";
  lastActiveAt: string;
};

export type AdminPermission = {
  id: string;
  role: string;
  resource: string;
  action: string;
  description: string;
};

export type AdminSystemLog = {
  id: string;
  level: "info" | "warn" | "error";
  service: string;
  message: string;
  createdAt: string;
};

export type AdminFraudCase = {
  id: string;
  type: "payment" | "account" | "promo_abuse";
  severity: "low" | "medium" | "high";
  subject: string;
  status: "open" | "reviewing" | "resolved" | "blocked";
  score: number;
  createdAt: string;
};

export type AdminReport = {
  id: string;
  title: string;
  description: string;
  format: "CSV" | "XLSX" | "PDF";
  lastGeneratedAt: string;
};

export const adminPlatform = {
  name: "VERONICA MARK Platform",
  environment: "production",
  region: "eu-west",
  version: "0.8.0",
};

export const adminBrands: AdminBrand[] = [
  {
    id: "b1",
    name: "VERONICA MARK Atelier",
    slug: "veronica-mark-atelier",
    status: "active",
    managers: 1,
    products: 12,
    revenue30d: 27460500,
    createdAt: "2026-01-12T10:00:00+01:00",
  },
  {
    id: "b2",
    name: "Maison Violette",
    slug: "maison-violette",
    status: "active",
    managers: 2,
    products: 8,
    revenue30d: 18660000,
    createdAt: "2026-02-03T09:00:00+01:00",
  },
  {
    id: "b3",
    name: "Atelier Noir",
    slug: "atelier-noir",
    status: "active",
    managers: 1,
    products: 6,
    revenue30d: 14520000,
    createdAt: "2026-02-18T11:00:00+01:00",
  },
  {
    id: "b4",
    name: "Or Jardin",
    slug: "or-jardin",
    status: "pending",
    managers: 0,
    products: 0,
    revenue30d: 0,
    createdAt: "2026-07-20T16:00:00+01:00",
  },
  {
    id: "b5",
    name: "Lumen House",
    slug: "lumen-house",
    status: "suspended",
    managers: 1,
    products: 3,
    revenue30d: 630000,
    createdAt: "2026-03-01T08:00:00+01:00",
  },
];

export const adminCustomers: AdminCustomer[] = [
  {
    id: "c1",
    name: "Camille Dubois",
    email: "customer@example.com",
    status: "active",
    orders: 4,
    spend: 1460550,
    riskScore: 12,
    country: "FR",
    joinedAt: "2026-04-02T10:00:00+01:00",
  },
  {
    id: "c2",
    name: "Louis Moreau",
    email: "louis@example.com",
    status: "active",
    orders: 2,
    spend: 582300,
    riskScore: 8,
    country: "FR",
    joinedAt: "2026-05-14T12:00:00+01:00",
  },
  {
    id: "c3",
    name: "Nora Ellis",
    email: "nora@example.com",
    status: "active",
    orders: 1,
    spend: 351000,
    riskScore: 18,
    country: "GB",
    joinedAt: "2026-06-01T09:00:00+01:00",
  },
  {
    id: "c4",
    name: "Flagged User",
    email: "risk@example.com",
    status: "restricted",
    orders: 7,
    spend: 3210000,
    riskScore: 86,
    country: "NG",
    joinedAt: "2026-07-01T18:00:00+01:00",
  },
];

export const adminOrders: AdminOrder[] = [
  {
    orderNumber: "VM-2026-0010",
    placedAt: "2026-07-23T18:02:00+01:00",
    status: "paid",
    customerName: "Louis Moreau",
    brandName: "Or Jardin",
    total: 266400,
    currency: "NGN",
    paymentStatus: "paid",
    shippingStatus: "unfulfilled",
  },
  {
    orderNumber: "VM-2026-0004",
    placedAt: "2026-07-22T09:14:00+01:00",
    status: "shipped",
    customerName: "Camille Dubois",
    brandName: "Maison Violette",
    total: 315000,
    currency: "NGN",
    paymentStatus: "paid",
    shippingStatus: "shipped",
  },
  {
    orderNumber: "VM-2026-0001",
    placedAt: "2026-07-20T14:32:00+01:00",
    status: "processing",
    customerName: "Camille Dubois",
    brandName: "VERONICA MARK Atelier",
    total: 539400,
    currency: "NGN",
    paymentStatus: "paid",
    shippingStatus: "packed",
  },
  {
    orderNumber: "VM-2026-0009",
    placedAt: "2026-07-19T21:10:00+01:00",
    status: "cancelled",
    customerName: "Flagged User",
    brandName: "Atelier Noir",
    total: 630000,
    currency: "NGN",
    paymentStatus: "refunded",
    shippingStatus: "unfulfilled",
  },
];

export const adminPayments: AdminPayment[] = [
  {
    id: "pay-1",
    orderNumber: "VM-2026-0010",
    provider: "Paystack",
    amount: 266400,
    currency: "NGN",
    status: "succeeded",
    createdAt: "2026-07-23T18:03:00+01:00",
  },
  {
    id: "pay-2",
    orderNumber: "VM-2026-0004",
    provider: "SquadCo",
    amount: 315000,
    currency: "NGN",
    status: "succeeded",
    createdAt: "2026-07-22T09:15:00+01:00",
  },
  {
    id: "pay-3",
    orderNumber: "VM-2026-0009",
    provider: "Paystack",
    amount: 630000,
    currency: "NGN",
    status: "refunded",
    createdAt: "2026-07-19T21:12:00+01:00",
  },
  {
    id: "pay-4",
    orderNumber: "VM-2026-0007",
    provider: "Paystack",
    amount: 232500,
    currency: "NGN",
    status: "failed",
    createdAt: "2026-07-17T13:40:00+01:00",
  },
];

export const adminShipments: AdminShipment[] = [
  {
    id: "ship-1",
    orderNumber: "VM-2026-0004",
    carrier: "DHL Express",
    trackingNumber: "VMTRK884201",
    status: "in_transit",
    destination: "Paris, FR",
    updatedAt: "2026-07-23T11:02:00+01:00",
  },
  {
    id: "ship-2",
    orderNumber: "VM-2026-0001",
    carrier: "Chronopost",
    trackingNumber: "VMTRK881104",
    status: "label_created",
    destination: "Paris, FR",
    updatedAt: "2026-07-21T08:00:00+01:00",
  },
  {
    id: "ship-3",
    orderNumber: "VM-2026-0008",
    carrier: "UPS",
    trackingNumber: "VMTRK770331",
    status: "delivered",
    destination: "London, GB",
    updatedAt: "2026-07-19T14:20:00+01:00",
  },
];

export const adminCmsPages: AdminCmsPage[] = [
  {
    id: "cms-1",
    title: "Homepage",
    slug: "/",
    status: "published",
    updatedAt: "2026-07-20T10:00:00+01:00",
    author: "Platform Ops",
  },
  {
    id: "cms-2",
    title: "About VERONICA MARK",
    slug: "/about",
    status: "published",
    updatedAt: "2026-07-12T09:00:00+01:00",
    author: "Editorial",
  },
  {
    id: "cms-3",
    title: "August Flash Sale Landing",
    slug: "/flash-sale",
    status: "published",
    updatedAt: "2026-07-19T16:00:00+01:00",
    author: "Marketing",
  },
  {
    id: "cms-4",
    title: "Private Client Invite",
    slug: "/invite",
    status: "draft",
    updatedAt: "2026-07-22T11:30:00+01:00",
    author: "Marketing",
  },
];

export const adminFeatureFlags: AdminFeatureFlag[] = [
  {
    id: "ff-1",
    key: "checkout.guest_enabled",
    description: "Allow guest checkout without account creation",
    enabled: true,
    rolloutPercent: 100,
    environments: ["production", "staging"],
    updatedAt: "2026-07-01T00:00:00+01:00",
  },
  {
    id: "ff-2",
    key: "payments.squadco",
    description: "Enable SquadCo as alternate payment provider",
    enabled: true,
    rolloutPercent: 50,
    environments: ["production"],
    updatedAt: "2026-07-15T12:00:00+01:00",
  },
  {
    id: "ff-3",
    key: "storefront.pwa",
    description: "Progressive web app install prompt",
    enabled: false,
    rolloutPercent: 0,
    environments: ["staging"],
    updatedAt: "2026-07-10T09:00:00+01:00",
  },
  {
    id: "ff-4",
    key: "loyalty.referrals_v2",
    description: "Referral v2 wallet credit flow",
    enabled: true,
    rolloutPercent: 25,
    environments: ["staging", "production"],
    updatedAt: "2026-07-18T14:00:00+01:00",
  },
];

export const adminLocales: AdminLocale[] = [
  { code: "en", name: "English", enabled: true, coveragePercent: 100, defaultCurrency: "NGN" },
  { code: "fr", name: "French", enabled: true, coveragePercent: 86, defaultCurrency: "NGN" },
  { code: "de", name: "German", enabled: false, coveragePercent: 42, defaultCurrency: "NGN" },
  { code: "ar", name: "Arabic", enabled: false, coveragePercent: 18, defaultCurrency: "NGN" },
];

/** Fallback list — prefer `listEmailTemplates()` from `@/emails` in queries. */
export const adminEmailTemplates: AdminEmailTemplate[] = [];

export const adminAuditLogs: AdminAuditLog[] = [
  {
    id: "al-1",
    actor: "admin@veronicamark.com",
    action: "BRAND.SUSPEND",
    resource: "Brand",
    recordId: "b5",
    summary: "Suspended Lumen House for policy review",
    ip: "102.89.12.4",
    createdAt: "2026-07-21T09:40:00+01:00",
  },
  {
    id: "al-2",
    actor: "admin@veronicamark.com",
    action: "FEATURE_FLAG.UPDATE",
    resource: "FeatureFlag",
    recordId: "ff-2",
    summary: "Set payments.squadco rollout to 50%",
    ip: "102.89.12.4",
    createdAt: "2026-07-15T12:00:00+01:00",
  },
  {
    id: "al-3",
    actor: "system",
    action: "PAYMENT.REFUND",
    resource: "Payment",
    recordId: "pay-3",
    summary: "Refunded VM-2026-0009 after fraud block",
    ip: "internal",
    createdAt: "2026-07-19T21:20:00+01:00",
  },
  {
    id: "al-4",
    actor: "admin@veronicamark.com",
    action: "USER.DISABLE",
    resource: "User",
    recordId: "c4",
    summary: "Restricted high-risk customer account",
    ip: "102.89.12.4",
    createdAt: "2026-07-19T21:25:00+01:00",
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "u1",
    name: "Platform Admin",
    email: "admin@veronicamark.com",
    role: "SUPER_ADMIN",
    status: "active",
    lastActiveAt: "2026-07-24T09:50:00+01:00",
  },
  {
    id: "u2",
    name: "Amara Okafor",
    email: "brand.manager@veronicamark.com",
    role: "BRAND_MANAGER",
    status: "active",
    lastActiveAt: "2026-07-23T16:10:00+01:00",
  },
  {
    id: "u3",
    name: "Camille Dubois",
    email: "customer@example.com",
    role: "CUSTOMER",
    status: "active",
    lastActiveAt: "2026-07-22T09:14:00+01:00",
  },
  {
    id: "u4",
    name: "Ops Invite",
    email: "ops.invite@veronicamark.com",
    role: "SUPER_ADMIN",
    status: "invited",
    lastActiveAt: "2026-07-18T00:00:00+01:00",
  },
];

export const adminPermissions: AdminPermission[] = [
  {
    id: "p1",
    role: "SUPER_ADMIN",
    resource: "brand",
    action: "MANAGE",
    description: "Full brand lifecycle control",
  },
  {
    id: "p2",
    role: "SUPER_ADMIN",
    resource: "user",
    action: "MANAGE",
    description: "Create, disable, and assign roles",
  },
  {
    id: "p3",
    role: "SUPER_ADMIN",
    resource: "audit_log",
    action: "READ",
    description: "View immutable platform audit trail",
  },
  {
    id: "p4",
    role: "BRAND_MANAGER",
    resource: "product",
    action: "MANAGE",
    description: "Manage own-brand catalog only",
  },
  {
    id: "p5",
    role: "BRAND_MANAGER",
    resource: "order",
    action: "READ",
    description: "View brand-scoped orders",
  },
  {
    id: "p6",
    role: "CUSTOMER",
    resource: "order",
    action: "READ",
    description: "View own orders",
  },
];

export const adminSystemLogs: AdminSystemLog[] = [
  {
    id: "sl-1",
    level: "info",
    service: "checkout",
    message: "Order VM-2026-0010 payment authorized via Paystack",
    createdAt: "2026-07-23T18:03:12+01:00",
  },
  {
    id: "sl-2",
    level: "warn",
    service: "payments",
    message: "SquadCo webhook latency 2.4s (p95 threshold 2.0s)",
    createdAt: "2026-07-23T17:40:00+01:00",
  },
  {
    id: "sl-3",
    level: "error",
    service: "shipping",
    message: "Carrier rate lookup timeout for Chronopost EU",
    createdAt: "2026-07-23T12:11:00+01:00",
  },
  {
    id: "sl-4",
    level: "info",
    service: "auth",
    message: "Successful SUPER_ADMIN sign-in",
    createdAt: "2026-07-24T09:50:00+01:00",
  },
];

export const adminFraudCases: AdminFraudCase[] = [
  {
    id: "fr-1",
    type: "payment",
    severity: "high",
    subject: "risk@example.com · VM-2026-0009",
    status: "blocked",
    score: 92,
    createdAt: "2026-07-19T21:11:00+01:00",
  },
  {
    id: "fr-2",
    type: "promo_abuse",
    severity: "medium",
    subject: "Multiple accounts · GRANDOPEN",
    status: "reviewing",
    score: 64,
    createdAt: "2026-07-22T08:30:00+01:00",
  },
  {
    id: "fr-3",
    type: "account",
    severity: "low",
    subject: "nora@example.com · velocity check",
    status: "resolved",
    score: 28,
    createdAt: "2026-07-10T14:00:00+01:00",
  },
];

export const adminReports: AdminReport[] = [
  {
    id: "ar-1",
    title: "Platform GMV (30 days)",
    description: "Gross merchandise value by brand and country",
    format: "XLSX",
    lastGeneratedAt: "2026-07-23T07:00:00+01:00",
  },
  {
    id: "ar-2",
    title: "Payment success rate",
    description: "Provider-level authorization and decline metrics",
    format: "CSV",
    lastGeneratedAt: "2026-07-23T07:05:00+01:00",
  },
  {
    id: "ar-3",
    title: "Fraud review pack",
    description: "Open and blocked cases with score distributions",
    format: "PDF",
    lastGeneratedAt: "2026-07-22T18:00:00+01:00",
  },
];

export const adminAnalytics = {
  totalRevenue30d: 61270500,
  orders30d: 126,
  customersTotal: 1842,
  brandsActive: 3,
  activePromotions: 5,
  inventoryHealth: 88,
  platformHealth: 96,
  revenueSeries: [
    { day: "17 Jul", revenue: 6300000, orders: 14 },
    { day: "18 Jul", revenue: 7650000, orders: 17 },
    { day: "19 Jul", revenue: 5850000, orders: 12 },
    { day: "20 Jul", revenue: 9600000, orders: 21 },
    { day: "21 Jul", revenue: 8700000, orders: 19 },
    { day: "22 Jul", revenue: 10800000, orders: 23 },
    { day: "23 Jul", revenue: 12370500, orders: 20 },
  ],
  brandMix: [
    { name: "Atelier", value: 38 },
    { name: "Maison Violette", value: 27 },
    { name: "Atelier Noir", value: 22 },
    { name: "Other", value: 13 },
  ],
  paymentMix: [
    { name: "Paystack", value: 62 },
    { name: "SquadCo", value: 38 },
  ],
};

export const adminSecurity = {
  mfaEnforced: true,
  sessionTimeoutMinutes: 60,
  passwordMinLength: 12,
  ipAllowlistEnabled: false,
  failedLogins24h: 7,
  activeAdminSessions: 2,
  lastSecurityReview: "2026-07-01T00:00:00+01:00",
};

export const adminSettings = {
  maintenanceMode: false,
  guestCheckout: true,
  defaultCurrency: "NGN",
  defaultLocale: "en",
  taxInclusiveDisplay: true,
  supportEmail: "support@veronicamark.com",
};
