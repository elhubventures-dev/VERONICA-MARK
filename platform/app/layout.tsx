import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Inter, Manrope, Playfair_Display } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { auth } from "@/lib/auth";
import {
  GEO_COUNTRY_COOKIE,
  normalizeCountryCode,
  resolveCountryFromHeaders,
} from "@/lib/commerce/geo";
import { getPublicEnv } from "@/lib/env";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-alt",
  display: "swap",
});

const publicEnv = getPublicEnv();

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
  title: {
    default: "VERONICA MARK",
    template: "%s · VERONICA MARK",
  },
  description:
    "Curated for the Exceptional. VERONICA MARK is a luxury managed-brand marketplace launching with premium perfumes.",
  applicationName: "VERONICA MARK",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VERONICA MARK",
    startupImage: [
      {
        url: "/brand/pwa/splash/iphone-8.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/brand/pwa/splash/iphone-x.png",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/brand/pwa/splash/iphone-12.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/brand/pwa/splash/iphone-14-pro.png",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/brand/pwa/splash/iphone-12-pro-max.png",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/brand/pwa/splash/iphone-14-plus.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/brand/pwa/splash/iphone-15-pro-max.png",
        media:
          "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/brand/pwa/splash/ipad.png",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/brand/pwa/splash/ipad-pro.png",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/brand/vm-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "VERONICA MARK",
    title: "VERONICA MARK",
    description:
      "Curated for the Exceptional. Luxury managed-brand marketplace for premium perfumes and future lifestyle collections.",
    images: [{ url: "/brand/og-default.webp", width: 1200, height: 630, alt: "VERONICA MARK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VERONICA MARK",
    description: "Curated for the Exceptional.",
    images: ["/brand/og-default.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F4EC" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const headerList = await headers();
  const cookieStore = await cookies();
  const geoFromHeader = resolveCountryFromHeaders(headerList);
  const geoFromCookie = cookieStore.get(GEO_COUNTRY_COOKIE)?.value;
  const geoCountry = normalizeCountryCode(
    geoFromHeader ?? geoFromCookie ?? process.env.GEO_COUNTRY_OVERRIDE ?? "NG",
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${manrope.variable} antialiased`}>
        <AppProviders session={session} geoCountry={geoCountry}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
