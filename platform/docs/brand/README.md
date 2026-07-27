# VERONICA MARK — Brand System (Source of Truth)

This folder is the **product brand source of truth** for the platform. It consolidates the seven official Brand Guidelines volumes, logo inventory, and how those standards map into digital tokens and surfaces.

Official guideline DOCX files live at:

`VERONICA MARK Brand Guidelines/` (workspace root)

Logo masters live at:

`logo/` (workspace root) — `VM_Logo.png`, `VM_Logo1.png`, `VM_Logo2.png`

## Documents in this folder

| Doc | Purpose |
| --- | --- |
| [COLORS.md](./COLORS.md) | Official flat palette, usage ratios, logo metallic ranges, token mapping |
| [LOGO.md](./LOGO.md) | Logo variants, clear space, sizes, do/don’t rules |
| [VOICE.md](./VOICE.md) | Tagline, tone, preferred/avoid language, homepage & About messaging |
| [GUIDELINES_INDEX.md](./GUIDELINES_INDEX.md) | Volume map + digital adoption checklist |
| [MARKETING_COMPLIANCE.md](./MARKETING_COMPLIANCE.md) | Campaign compliance checklist & governance |
| [PHASE_F_QA.md](./PHASE_F_QA.md) | Visual QA, contrast audit, Lighthouse notes |
| [ARCHITECTURE_REVIEW.md](./ARCHITECTURE_REVIEW.md) | Brand Manager portal architecture (product, not visual identity) |

Working extracts of the DOCX volumes (text only) are under [`../brand-guidelines/_extract/`](../brand-guidelines/_extract/).

## Confirmed decisions (2026-07-24)

1. **Official flat colors** follow Volume II (not the previous Stage 2 approximations).
2. **Logo artwork** in `logo/` is the visual reference for purple depth, metallic gold, and monogram treatment.
3. **Homepage + About** adopt official tagline and brand story in the content pass (after token CSS rollout).

## Adoption roadmap

| Phase | Status | Scope |
| ----- | ------ | ----- |
| **A** Brand system source of truth | **Done** | Docs + design-system aligned to official hex |
| **B** Visual token & asset rollout | **Done** | `globals.css` tokens; official logo → web SVG/WebP; favicon/OG; BrandMark |
| **C** Voice & content | **Done** | Homepage tagline, About story/mission/pillars, storefront voice soften |
| **D** Experience polish (Vol V) | **Done** | Nav search prominence, PDP story/zoom/trust, checkout secure pay, confirmation |
| **E** Marketing & governance | **Done** | Compliance checklist, photography brief, Brand standards hub |
| **F** Verify | **Done** | Contrast fixes, route/content smoke, Lighthouse baseline (dev) + QA doc |

## Design-system link

Runtime CSS tokens remain in [`app/globals.css`](../../app/globals.css). Authoritative token tables: [`../design-system/TOKENS.md`](../design-system/TOKENS.md).

Phase B applied official hex in `app/globals.css`. Logo masters remain in workspace `logo/`; web exports live in `platform/public/brand/`.
