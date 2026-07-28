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

/** Empty façades — admin portal renders Prisma data or empty states. */
export const adminPlatform = {
  name: "VERONICA MARK Platform",
  environment: "production",
  region: "eu-west",
  version: "0.8.0",
};

export const adminBrands: AdminBrand[] = [];
export const adminCustomers: AdminCustomer[] = [];
export const adminOrders: AdminOrder[] = [];
export const adminPayments: AdminPayment[] = [];
export const adminShipments: AdminShipment[] = [];
export const adminCmsPages: AdminCmsPage[] = [];
export const adminFeatureFlags: AdminFeatureFlag[] = [];
export const adminLocales: AdminLocale[] = [];
export const adminEmailTemplates: AdminEmailTemplate[] = [];
export const adminAuditLogs: AdminAuditLog[] = [];
export const adminUsers: AdminUser[] = [];
export const adminPermissions: AdminPermission[] = [];
export const adminSystemLogs: AdminSystemLog[] = [];
export const adminFraudCases: AdminFraudCase[] = [];
export const adminReports: AdminReport[] = [];

export const adminAnalytics = {
  totalRevenue30d: 0,
  orders30d: 0,
  customersTotal: 0,
  brandsActive: 0,
  activePromotions: 0,
  inventoryHealth: 100,
  platformHealth: 100,
  revenueSeries: [] as Array<{ day: string; revenue: number; orders: number }>,
  brandMix: [] as Array<{ name: string; value: number }>,
  paymentMix: [] as Array<{ name: string; value: number }>,
};

export const adminSecurity = {
  mfaEnforced: true,
  sessionTimeoutMinutes: 60,
  passwordMinLength: 12,
  ipAllowlistEnabled: false,
  failedLogins24h: 0,
  activeAdminSessions: 0,
  lastSecurityReview: "",
};

export const adminSettings = {
  maintenanceMode: false,
  guestCheckout: true,
  defaultCurrency: "NGN",
  defaultLocale: "en",
  taxInclusiveDisplay: true,
  supportEmail: "support@veronicamark.com",
};
