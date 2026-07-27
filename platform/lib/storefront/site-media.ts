/**
 * Official website design assets from
 * `VERONICA MARK Website Design Asset Library/`.
 * Served as WebP under `public/media/site/`.
 */
export const siteMedia = {
  aboutUsBanner: "/media/site/about-us-banner.webp",
  authenticationBanner: "/media/site/authentication-banner.webp",
  bestSellerSection: "/media/site/best-seller-section.webp",
  brandPartnersBanner: "/media/site/brand-partners-banner.webp",
  categoryIconsBackground: "/media/site/category-icons-background.webp",
  checkoutBanner: "/media/site/checkout-banner.webp",
  contactPageBanner: "/media/site/contact-page-banner.webp",
  emptyCartIllustration: "/media/site/empty-cart-illustration.webp",
  featuredCollectionBanner: "/media/site/featured-collection-banner.webp",
  footerBackground: "/media/site/footer-background.webp",
  homepageHeroBanner: "/media/site/homepage-hero-banner.webp",
  loadingScreenBackground: "/media/site/loading-screen-background.webp",
  luxuryLifestyleBanner: "/media/site/luxury-lifestyle-banner.webp",
  luxuryPerfumeCollection: "/media/site/luxury-perfume-collection.webp",
  mobileAppSplashScreen: "/media/site/mobile-app-splash-screen.webp",
  newArrivalBanner: "/media/site/new-arrival-banner.webp",
  newsletterBackground: "/media/site/newsletter-background.webp",
  perfumeShelfDisplay: "/media/site/perfume-shelf-display.webp",
  premiumGiftCollection: "/media/site/premium-gift-collection.webp",
  seasonalCollection: "/media/site/seasonal-collection.webp",
} as const;

export type SiteMediaKey = keyof typeof siteMedia;
