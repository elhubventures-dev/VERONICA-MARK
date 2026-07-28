# Phase F — Visual QA, Contrast & Lighthouse

**Date:** 2026-07-24  
**Scope:** Brand guidelines adoption Phases A–E verification  
**Environment for Lighthouse:** local `pnpm dev` (Turbopack) — **not** production `pnpm build && pnpm start`

## Summary

| Area | Result |
| ---- | ------ |
| Route smoke | Pass — `/`, `/about`, `/shop`, `/cart`, `/products/*`, `/admin/marketing/brand-standards` → 200 |
| Content smoke | Pass — tagline, About story/pillars, shop voice present |
| Contrast (palette math) | Pass for charcoal/purple/cream/white pairs; gold-on-cream intentionally **not** for body text |
| Contrast (UI fixes) | Eyebrows moved from gold→primary on cream; footer muted text lightened; BrandMark redundant alt fixed |
| robots.txt | Host omitted on localhost (was failing Lighthouse SEO) |
| Lighthouse (dev server) | Perf **36** (expected on turbopack) · A11y **96** · BP **100** · SEO **92** |

## Contrast audit (official palette)

| Pair | Ratio | AA normal |
| ---- | ----- | --------- |
| Charcoal `#1A1A1A` on Cream `#F8F4EC` | 15.87:1 | Pass |
| Muted `#5C5C5C` on Cream | 6.10:1 | Pass |
| White on Purple `#4B246A` | 11.93:1 | Pass |
| Purple on Cream | 10.88:1 | Pass |
| Gold `#C7A25A` on Cream | 2.19:1 | **Fail — accent only** (icons, hairlines, large display on dark) |
| Gold on Purple | 4.97:1 | Pass |
| Gold on Black | 8.74:1 | Pass |

**Rule:** Do not use Champagne Gold for small text on cream. Use Royal Purple or Charcoal.

## Visual QA checklist

- [x] Homepage hero: **Curated for the Exceptional.** + priority LCP image  
- [x] About: founder story, mission/vision, pillars, manifesto  
- [x] Nav: search, wishlist, account, bag; Flash sales label  
- [x] Brand assets: favicon/OG paths resolve  
- [x] PDP trust signals + zoom control present (route 200)  
- [x] Marketing brand standards hub loads  
- [x] No legacy Stage 2 hex (`#5B2E91` / `#C9A227`) in `app/` + `components/`  

## Lighthouse notes

Artifacts (dev run):

- `docs/brand/_qa/lighthouse-home.report.html`
- `docs/brand/_qa/lighthouse-home.report.json`

**Performance 36** is not a production claim. Dev/Turbopack inflates TBT/LCP. Re-run on production:

```bash
cd platform
pnpm build && pnpm start
npx lighthouse http://127.0.0.1:3000 --preset=desktop --view
npx lighthouse http://127.0.0.1:3000 --form-factor=mobile --view
```

Target remains ≥95 per `docs/ops/PERFORMANCE_AND_LIGHTHOUSE.md` after production build + first-party LCP media.

Fixes applied during Phase F from the dev audit:

1. Section / content eyebrows: `text-primary` (was gold on cream)  
2. Footer legal line: `text-white/60` (was `/45`)  
3. BrandMark: empty `alt` when wordmark text is adjacent  
4. `robots.ts`: skip `Host` on localhost  
5. Hero: `next/image` + `priority` for measurable LCP  

## Remaining (optional follow-ups)

1. Production Lighthouse on `/`, `/shop`, PDP after `pnpm build`  
2. Replace Unsplash hero with first-party photography when available  
3. Wire Brand Management compliance sign-off to persisted campaign records (beyond localStorage demo)  
