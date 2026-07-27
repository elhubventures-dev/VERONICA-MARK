"use client";

import * as React from "react";

import {
  checkoutCountryFromGeo,
  displayCurrencyForCountry,
  GEO_COUNTRY_COOKIE,
  normalizeCountryCode,
} from "@/lib/commerce/geo";
import { USD_NGN_RATE, type StoreCurrency } from "@/lib/commerce/fx";
import { isNigeriaCountry } from "@/lib/commerce/shipping-rates";

type RegionContextValue = {
  /** ISO country from browsing location (geo). */
  geoCountry: string;
  /** Suggested checkout destination from geo. */
  checkoutCountry: string;
  displayCurrency: StoreCurrency;
  isInternationalBrowser: boolean;
  usdNgnRate: number;
};

const RegionContext = React.createContext<RegionContextValue | null>(null);

function readGeoCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${GEO_COUNTRY_COOKIE}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function RegionProvider({
  children,
  initialGeoCountry = "NG",
}: {
  children: React.ReactNode;
  initialGeoCountry?: string;
}) {
  const [geoCountry, setGeoCountry] = React.useState(() => normalizeCountryCode(initialGeoCountry));

  React.useEffect(() => {
    const fromCookie = readGeoCookie();
    if (fromCookie) {
      setGeoCountry(normalizeCountryCode(fromCookie));
    }
  }, []);

  const value = React.useMemo<RegionContextValue>(() => {
    const displayCurrency = displayCurrencyForCountry(geoCountry);
    return {
      geoCountry,
      checkoutCountry: checkoutCountryFromGeo(geoCountry),
      displayCurrency,
      isInternationalBrowser: !isNigeriaCountry(geoCountry),
      usdNgnRate: USD_NGN_RATE,
    };
  }, [geoCountry]);

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const ctx = React.useContext(RegionContext);
  if (!ctx) {
    return {
      geoCountry: "NG",
      checkoutCountry: "NG",
      displayCurrency: "NGN",
      isInternationalBrowser: false,
      usdNgnRate: USD_NGN_RATE,
    };
  }
  return ctx;
}
