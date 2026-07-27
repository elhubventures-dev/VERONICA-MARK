import { greet, resolveAppUrl } from "@/emails/layout";
import type {
  CartEmailVars,
  EmailContent,
  MarketingEmailVars,
  ReferralEmailVars,
  ReviewEmailVars,
  RewardsEmailVars,
  WalletEmailVars,
  WishlistEmailVars,
} from "@/emails/types";

export function buildRewardsPointsEarned(vars: RewardsEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  const points = vars.points ?? 0;
  return {
    subject: `You earned ${points} reward points`,
    previewText: "Your loyalty balance has been updated.",
    eyebrow: "Rewards",
    heading: "Points earned",
    paragraphs: [
      greet(vars.recipientName),
      vars.orderNumber
        ? `You earned ${points} points from order ${vars.orderNumber}.`
        : `You earned ${points} reward points.`,
      "Points can be redeemed toward wallet credit at checkout according to current rewards rules.",
    ],
    details: [
      { label: "Points earned", value: String(points) },
      ...(vars.pointsBalance != null
        ? [{ label: "Balance", value: String(vars.pointsBalance) }]
        : []),
      ...(vars.orderNumber ? [{ label: "Order", value: vars.orderNumber }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "View rewards",
      href: vars.ctaUrl || `${appUrl}/account/rewards`,
    },
  };
}

export function buildRewardsTierUpgraded(vars: RewardsEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  const tier = vars.tierName || "your new tier";
  return {
    subject: `Welcome to ${tier}`,
    previewText: "Your loyalty tier has been upgraded.",
    eyebrow: "Loyalty",
    heading: "Your tier has been upgraded",
    paragraphs: [
      greet(vars.recipientName),
      vars.previousTier
        ? `Congratulations — you have moved from ${vars.previousTier} to ${tier}.`
        : `Congratulations — you have reached ${tier}.`,
      "Enjoy the refined benefits of your new tier on future orders and rewards redemptions.",
    ],
    details: [
      { label: "New tier", value: tier },
      ...(vars.previousTier ? [{ label: "Previous", value: vars.previousTier }] : []),
      ...(vars.pointsBalance != null
        ? [{ label: "Points", value: String(vars.pointsBalance) }]
        : []),
    ],
    cta: {
      label: vars.ctaLabel || "View rewards",
      href: vars.ctaUrl || `${appUrl}/account/rewards`,
    },
    tone: "success",
  };
}

export function buildWalletCreditReceived(vars: WalletEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: `Wallet credit · ${vars.creditAmountLabel}`,
    previewText: "Store credit has been added to your wallet.",
    eyebrow: "Wallet",
    heading: "Credit added to your wallet",
    paragraphs: [
      greet(vars.recipientName),
      `${vars.creditAmountLabel} has been added to your VERONICA MARK wallet.`,
      vars.reason || "You can apply wallet credit at checkout on your next order.",
    ],
    details: [
      { label: "Credit", value: vars.creditAmountLabel },
      ...(vars.balanceLabel ? [{ label: "Balance", value: vars.balanceLabel }] : []),
      ...(vars.reason ? [{ label: "Reason", value: vars.reason }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "View wallet",
      href: vars.ctaUrl || `${appUrl}/account/wallet`,
    },
    tone: "success",
  };
}

export function buildReferralInvite(vars: ReferralEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: vars.inviterName
      ? `${vars.inviterName} invited you to VERONICA MARK`
      : "You are invited to VERONICA MARK",
    previewText: "Discover curated luxury — join with a personal invitation.",
    eyebrow: "Invitation",
    heading: "You are invited",
    paragraphs: [
      greet(vars.recipientName),
      vars.inviterName
        ? `${vars.inviterName} thought you would appreciate VERONICA MARK — curated luxury from trusted brands.`
        : "You have been invited to discover VERONICA MARK — curated luxury from trusted brands.",
      vars.rewardLabel
        ? `When you join and complete your first eligible order, ${vars.rewardLabel}.`
        : "Create your account to explore the edit, track orders and enjoy member benefits.",
    ],
    details: vars.referralCode ? [{ label: "Code", value: vars.referralCode }] : undefined,
    cta: {
      label: vars.ctaLabel || "Accept invitation",
      href: vars.ctaUrl || `${appUrl}/auth/sign-up`,
    },
  };
}

export function buildReferralReward(vars: ReferralEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: "Your referral reward is ready",
    previewText: "Thank you for sharing VERONICA MARK.",
    eyebrow: "Referral",
    heading: "Referral reward earned",
    paragraphs: [
      greet(vars.recipientName),
      "Someone you invited has joined and completed an eligible order. Thank you for sharing VERONICA MARK.",
      vars.rewardLabel
        ? `Your reward: ${vars.rewardLabel}.`
        : "Your referral reward has been applied to your account.",
    ],
    details: vars.rewardLabel ? [{ label: "Reward", value: vars.rewardLabel }] : undefined,
    cta: {
      label: vars.ctaLabel || "View wallet",
      href: vars.ctaUrl || `${appUrl}/account/wallet`,
    },
    tone: "success",
  };
}

export function buildWishlistBackInStock(vars: WishlistEmailVars): EmailContent {
  return {
    subject: `Back in stock · ${vars.productName}`,
    previewText: "A piece from your wishlist is available again.",
    eyebrow: "Wishlist",
    heading: "Back in stock",
    paragraphs: [
      greet(vars.recipientName),
      vars.brandName
        ? `${vars.productName} by ${vars.brandName} is available again.`
        : `${vars.productName} is available again.`,
      "Quantities can be limited — secure yours while it remains in the edit.",
    ],
    details: [
      { label: "Product", value: vars.productName },
      ...(vars.brandName ? [{ label: "Brand", value: vars.brandName }] : []),
      ...(vars.priceLabel ? [{ label: "Price", value: vars.priceLabel }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "View product",
      href: vars.ctaUrl,
    },
  };
}

export function buildWishlistPriceDrop(vars: WishlistEmailVars): EmailContent {
  return {
    subject: `Price update · ${vars.productName}`,
    previewText: "A saved piece has a new price.",
    eyebrow: "Wishlist",
    heading: "A price update on your wishlist",
    paragraphs: [
      greet(vars.recipientName),
      `${vars.productName} from your wishlist now has an updated price.`,
      "Review the piece and decide whether the moment is right to add it to your bag.",
    ],
    details: [
      { label: "Product", value: vars.productName },
      ...(vars.previousPriceLabel
        ? [{ label: "Was", value: vars.previousPriceLabel }]
        : []),
      ...(vars.priceLabel ? [{ label: "Now", value: vars.priceLabel }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "View product",
      href: vars.ctaUrl,
    },
  };
}

export function buildCartAbandoned1(vars: CartEmailVars): EmailContent {
  return {
    subject: "Your bag is waiting",
    previewText: "Your VERONICA MARK selection is still saved.",
    eyebrow: "Your bag",
    heading: "Your selection is waiting",
    paragraphs: [
      greet(vars.recipientName),
      "You left a thoughtfully chosen selection in your bag. It is still saved for you.",
      "Return when you are ready — checkout remains simple, with guest options available.",
    ],
    items: vars.items,
    details: vars.cartTotalLabel
      ? [{ label: "Bag total", value: vars.cartTotalLabel }]
      : undefined,
    cta: {
      label: vars.ctaLabel || "Return to bag",
      href: vars.ctaUrl,
    },
    unsubscribeUrl: vars.unsubscribeUrl,
  };
}

export function buildCartAbandoned2(vars: CartEmailVars): EmailContent {
  return {
    subject: "Still considering your selection?",
    previewText: "A gentle reminder — your bag is still saved.",
    eyebrow: "Your bag",
    heading: "A gentle reminder",
    paragraphs: [
      greet(vars.recipientName),
      "Your VERONICA MARK bag is still waiting. Stock can move quickly on sought-after pieces.",
      vars.couponCode
        ? `If helpful, you may use code ${vars.couponCode} where eligible at checkout.`
        : "Complete your order when the moment feels right — we are here if you need guidance.",
    ],
    items: vars.items,
    details: [
      ...(vars.cartTotalLabel ? [{ label: "Bag total", value: vars.cartTotalLabel }] : []),
      ...(vars.couponCode ? [{ label: "Code", value: vars.couponCode }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Complete checkout",
      href: vars.ctaUrl,
    },
    unsubscribeUrl: vars.unsubscribeUrl,
  };
}

export function buildReviewRequest(vars: ReviewEmailVars): EmailContent {
  return {
    subject: "How was your VERONICA MARK order?",
    previewText: "Share a few words about your recent purchase.",
    eyebrow: "Reviews",
    heading: "We would value your perspective",
    paragraphs: [
      greet(vars.recipientName),
      vars.productName
        ? `We hope you are enjoying ${vars.productName} from order ${vars.orderNumber}.`
        : `We hope you are enjoying your selection from order ${vars.orderNumber}.`,
      "A brief review helps other clients discover exceptional pieces with confidence.",
    ],
    details: [
      { label: "Order", value: vars.orderNumber },
      ...(vars.productName ? [{ label: "Product", value: vars.productName }] : []),
    ],
    cta: {
      label: vars.ctaLabel || "Write a review",
      href: vars.ctaUrl,
    },
  };
}

export function buildLifecycleWinback(vars: MarketingEmailVars): EmailContent {
  const appUrl = resolveAppUrl(vars.appUrl);
  return {
    subject: vars.headline || "We have saved something for your return",
    previewText: vars.offerLabel || "A considered welcome back to the edit.",
    eyebrow: "Welcome back",
    heading: vars.headline || "The edit continues without you",
    paragraphs: [
      greet(vars.recipientName),
      vars.body ||
        "It has been a while since your last visit. New arrivals and enduring signatures are waiting when you return.",
      vars.offerLabel
        ? `As a gesture of welcome: ${vars.offerLabel}.`
        : "We would be delighted to welcome you back whenever you are ready.",
    ],
    details: vars.offerLabel ? [{ label: "Offer", value: vars.offerLabel }] : undefined,
    cta: {
      label: vars.ctaLabel || "Explore the edit",
      href: vars.ctaUrl || appUrl,
    },
    unsubscribeUrl: vars.unsubscribeUrl || `${appUrl}/account/settings`,
  };
}
