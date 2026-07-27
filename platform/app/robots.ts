import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/metadata";
import { getPublicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const appUrl = getPublicEnv().NEXT_PUBLIC_APP_URL;
  const isLocal = /localhost|127\.0\.0\.1/i.test(appUrl);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/brand", "/account", "/api"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    // Host is non-standard (Yandex); omit on local to keep Lighthouse robots.txt valid.
    ...(isLocal ? {} : { host: new URL(appUrl).host }),
  };
}
