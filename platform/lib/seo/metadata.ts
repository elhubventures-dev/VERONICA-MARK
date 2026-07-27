import type { Metadata } from "next";

import { getPublicEnv } from "@/lib/env";

export function absoluteUrl(path = "/"): string {
  return new URL(path, getPublicEnv().NEXT_PUBLIC_APP_URL).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: "VERONICA MARK",
      title,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
