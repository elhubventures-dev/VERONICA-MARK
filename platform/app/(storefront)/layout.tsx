import Link from "next/link";

import { PwaShell } from "@/components/pwa/pwa-shell";
import { FlashSalePopup } from "@/components/storefront/flash-sale-popup";
import { FloatingContactActions } from "@/components/storefront/floating-contact-actions";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { StorefrontChrome } from "@/components/storefront/storefront-chrome";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { WelcomeBackPopup } from "@/components/storefront/welcome-back-popup";
import { isFeatureEnabled } from "@/lib/feature-flags";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const pwaEnabled = await isFeatureEnabled("storefront.pwa");

  return (
    <PwaShell enabled={pwaEnabled}>
      <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </Link>
        <StorefrontChrome />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <StorefrontFooter />
        <MobileBottomNav />
        <FloatingContactActions />
        <FlashSalePopup />
        <WelcomeBackPopup />
      </div>
    </PwaShell>
  );
}
