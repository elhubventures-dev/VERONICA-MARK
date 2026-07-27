export const EMAIL_TEMPLATE_KEYS = [
  "auth.email_verification",
  "auth.password_reset",
  "auth.welcome",
  "auth.password_changed",
  "auth.account_disabled",
  "staff.admin_invite",
  "staff.brand_manager_invite",
  "order.confirmation",
  "order.payment_failed",
  "order.processing",
  "order.packed",
  "order.shipped",
  "order.out_for_delivery",
  "order.delivered",
  "order.cancelled",
  "order.completed",
  "return.requested",
  "return.approved",
  "return.rejected",
  "refund.processed",
  "rewards.points_earned",
  "rewards.tier_upgraded",
  "wallet.credit_received",
  "referral.invite",
  "referral.reward",
  "wishlist.back_in_stock",
  "wishlist.price_drop",
  "cart.abandoned_1",
  "cart.abandoned_2",
  "review.request",
  "lifecycle.winback",
  "newsletter.welcome",
  "marketing.flash_sale",
  "marketing.promotion",
  "marketing.newsletter",
  "brand.low_stock",
  "brand.new_order",
  "brand.flash_sale_alert",
  "contact.auto_reply",
  "contact.internal_notify",
  "admin.event",
] as const;

export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number];

export type EmailChannel = "transactional" | "marketing" | "operational";

export type EmailAudience = "customer" | "staff" | "brand" | "internal";

export type EmailMeta = {
  key: EmailTemplateKey;
  name: string;
  description: string;
  channel: EmailChannel;
  audience: EmailAudience;
  /** Preference category for marketing sends; transactional may omit. */
  preferenceCategory?: "orders" | "promotions" | "newsletter" | "loyalty";
};

export type OrderLineVar = {
  name: string;
  quantity: number;
  priceLabel?: string;
};

export type DetailRow = {
  label: string;
  value: string;
};

export type BaseEmailVars = {
  recipientName?: string;
  appUrl?: string;
  supportEmail?: string;
  previewText?: string;
};

export type CtaVars = {
  ctaUrl: string;
  ctaLabel?: string;
};

export type OrderEmailVars = BaseEmailVars &
  Partial<CtaVars> & {
    orderNumber: string;
    orderTotalLabel?: string;
    currencyNote?: string;
    items?: OrderLineVar[];
    shippingAddress?: string;
    shippingMethod?: string;
    trackingUrl?: string;
    trackingNumber?: string;
    invoiceUrl?: string;
    cancelReason?: string;
    estimatedDelivery?: string;
  };

export type AuthEmailVars = BaseEmailVars &
  CtaVars & {
    expiresIn?: string;
  };

export type StaffInviteVars = BaseEmailVars &
  CtaVars & {
    inviterName?: string;
    roleLabel: string;
    brandName?: string;
    expiresIn?: string;
  };

export type ReturnEmailVars = BaseEmailVars &
  Partial<CtaVars> & {
    returnNumber: string;
    orderNumber: string;
    reason?: string;
    instructions?: string;
    refundAmountLabel?: string;
  };

export type RefundEmailVars = BaseEmailVars &
  Partial<CtaVars> & {
    orderNumber: string;
    refundAmountLabel: string;
    refundMethod?: string;
    refundReference?: string;
  };

export type RewardsEmailVars = BaseEmailVars &
  Partial<CtaVars> & {
    points?: number;
    pointsBalance?: number;
    tierName?: string;
    previousTier?: string;
    orderNumber?: string;
  };

export type WalletEmailVars = BaseEmailVars &
  Partial<CtaVars> & {
    creditAmountLabel: string;
    balanceLabel?: string;
    reason?: string;
  };

export type ReferralEmailVars = BaseEmailVars &
  Partial<CtaVars> & {
    inviterName?: string;
    referralCode?: string;
    rewardLabel?: string;
  };

export type WishlistEmailVars = BaseEmailVars &
  CtaVars & {
    productName: string;
    brandName?: string;
    priceLabel?: string;
    previousPriceLabel?: string;
  };

export type CartEmailVars = BaseEmailVars &
  CtaVars & {
    items?: OrderLineVar[];
    cartTotalLabel?: string;
    couponCode?: string;
    unsubscribeUrl?: string;
  };

export type ReviewEmailVars = BaseEmailVars &
  CtaVars & {
    orderNumber: string;
    productName?: string;
  };

export type MarketingEmailVars = BaseEmailVars &
  CtaVars & {
    headline?: string;
    body?: string;
    campaignName?: string;
    offerLabel?: string;
    endsAtLabel?: string;
    unsubscribeUrl?: string;
  };

export type BrandOpsEmailVars = BaseEmailVars &
  Partial<CtaVars> & {
    brandName: string;
    productName?: string;
    sku?: string;
    stockLevel?: number;
    threshold?: number;
    orderNumber?: string;
    orderTotalLabel?: string;
    flashSaleName?: string;
    metricLabel?: string;
    metricValue?: string;
  };

export type ContactEmailVars = BaseEmailVars & {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  topic?: string;
  orderNumber?: string;
};

export type AdminEventVars = BaseEmailVars &
  Partial<CtaVars> & {
    eventTitle: string;
    summary: string;
    details?: DetailRow[];
    items?: OrderLineVar[];
    messageBody?: string;
  };

export type EmailVarsMap = {
  "auth.email_verification": AuthEmailVars;
  "auth.password_reset": AuthEmailVars;
  "auth.welcome": BaseEmailVars & Partial<CtaVars>;
  "auth.password_changed": BaseEmailVars & Partial<CtaVars>;
  "auth.account_disabled": BaseEmailVars & Partial<CtaVars> & { reason?: string };
  "staff.admin_invite": StaffInviteVars;
  "staff.brand_manager_invite": StaffInviteVars;
  "order.confirmation": OrderEmailVars;
  "order.payment_failed": OrderEmailVars;
  "order.processing": OrderEmailVars;
  "order.packed": OrderEmailVars;
  "order.shipped": OrderEmailVars;
  "order.out_for_delivery": OrderEmailVars;
  "order.delivered": OrderEmailVars;
  "order.cancelled": OrderEmailVars;
  "order.completed": OrderEmailVars;
  "return.requested": ReturnEmailVars;
  "return.approved": ReturnEmailVars;
  "return.rejected": ReturnEmailVars;
  "refund.processed": RefundEmailVars;
  "rewards.points_earned": RewardsEmailVars;
  "rewards.tier_upgraded": RewardsEmailVars;
  "wallet.credit_received": WalletEmailVars;
  "referral.invite": ReferralEmailVars;
  "referral.reward": ReferralEmailVars;
  "wishlist.back_in_stock": WishlistEmailVars;
  "wishlist.price_drop": WishlistEmailVars;
  "cart.abandoned_1": CartEmailVars;
  "cart.abandoned_2": CartEmailVars;
  "review.request": ReviewEmailVars;
  "lifecycle.winback": MarketingEmailVars;
  "newsletter.welcome": MarketingEmailVars;
  "marketing.flash_sale": MarketingEmailVars;
  "marketing.promotion": MarketingEmailVars;
  "marketing.newsletter": MarketingEmailVars;
  "brand.low_stock": BrandOpsEmailVars;
  "brand.new_order": BrandOpsEmailVars;
  "brand.flash_sale_alert": BrandOpsEmailVars;
  "contact.auto_reply": ContactEmailVars & Partial<CtaVars>;
  "contact.internal_notify": ContactEmailVars;
  "admin.event": AdminEventVars;
};

export type RenderedEmail = {
  key: EmailTemplateKey;
  subject: string;
  previewText: string;
  html: string;
  text: string;
};

export type EmailContent = {
  subject: string;
  previewText: string;
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  details?: DetailRow[];
  items?: OrderLineVar[];
  cta?: { label: string; href: string };
  secondaryNote?: string;
  /** Show marketing unsubscribe footer */
  unsubscribeUrl?: string;
  tone?: "default" | "success" | "warning" | "urgent";
};
