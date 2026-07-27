import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import { createSerwistRoute } from "@serwist/turbopack";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout.trim() || randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  swSrc: "app/sw.ts",
  useNativeEsbuild: true,
  // Next's default browserslist (chrome64…) can't downlevel object destructuring in
  // Serwist/idb. Target modern SW engines that support it natively.
  esbuildOptions: {
    target: ["chrome90", "edge90", "firefox90", "safari15"],
  },
});
