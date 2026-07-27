# Performance & Lighthouse (v1.0)

## Target
Lighthouse **≥ 95** for Performance, Accessibility, Best Practices, and SEO on:
- `/` (homepage)
- `/products/[slug]` (PDP)
- `/shop`

Run locally (Chrome):
```bash
pnpm build && pnpm start
# then Chrome DevTools → Lighthouse (Mobile + Desktop)
```

Or:
```bash
npx lighthouse http://127.0.0.1:3000 --view --preset=desktop
npx lighthouse http://127.0.0.1:3000 --view --form-factor=mobile --screenEmulation.mobile
```

## Implemented optimizations
| Area | Change |
| --- | --- |
| Images | AVIF/WebP, device sizes, 30-day `minimumCacheTTL`, Supabase/Unsplash remote patterns |
| Caching | Immutable `/_next/static`, SWR for images/SEO assets, HSTS |
| Code splitting | `experimental.optimizePackageImports` for heavy UI libs |
| Lazy loading | Next/Image lazy by default; chart barrel for deferred analytics imports |
| SEO | robots.ts, sitemap.ts, metadata helpers, JSON-LD |
| A11y | Skip links, focus rings, reduced motion, semantic landmarks |
| Failures | Segment + global error UI; branded 404 |

## Operator checklist before claiming ≥95
1. Replace Unsplash placeholders with optimized first-party media where possible (LCP image).
2. Ensure homepage LCP image uses `priority` (hero already uses CSS background — consider Next/Image priority hero for measurable LCP).
3. Keep third-party scripts minimal (no unneeded analytics on first paint).
4. Verify CLS: reserve image aspect ratios; avoid late font swaps (fonts use `display: swap`).
5. Confirm TTFB via Neon region co-located with Vercel.

## Caching strategy
| Layer | Policy |
| --- | --- |
| Static JS/CSS | `max-age=31536000, immutable` |
| Images | CDN + Next Image optimizer; SWR headers for `/images` |
| Catalog reads | Tag helpers in `lib/performance/cache.ts` (wire `revalidateTag` when Prisma replaces demo) |
| Sitemap/robots | 1h cache + SWR |

## Code splitting / lazy loading guidance
- Keep admin/marketing chart imports client-only (already `"use client"` chart components).
- Prefer dynamic `import()` for heavy brand/admin analytics pages if bundle budgets regress.
- Do not lazy-load above-the-fold CTAs or LCP media.
