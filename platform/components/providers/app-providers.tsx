"use client";

import type { Session } from "next-auth";
import type { ReactNode } from "react";

import { CartProvider } from "@/features/cart/cart-context";
import { CompareProvider } from "@/features/compare/compare-context";
import { RegionProvider } from "@/features/storefront/region-context";
import { WishlistProvider } from "@/features/wishlist/wishlist-context";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

type AppProvidersProps = {
  children: ReactNode;
  session?: Session | null;
  geoCountry?: string;
};

export function AppProviders({ children, session, geoCountry = "NG" }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <RegionProvider initialGeoCountry={geoCountry}>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>{children}</CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </RegionProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
