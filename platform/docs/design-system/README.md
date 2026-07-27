# VERONICA MARK Design System

Authoritative UI documentation for the luxury **managed-brand marketplace** platform. Brands are curated and onboarded by VERONICA MARK — the design language reflects editorial restraint, premium typography, and confident use of brand color.

## Brand identity

Official palette (Brand Guidelines Volume II). Full analysis including **logo metallic ranges**: [`../brand/COLORS.md`](../brand/COLORS.md). Logo rules: [`../brand/LOGO.md`](../brand/LOGO.md).

| Token | Hex | Role |
| ----- | --- | ---- |
| **Royal Purple** | `#4B246A` | Primary actions, brand emphasis, links (~25%) |
| **Luxury Cream** | `#F8F4EC` | Default page background / canvas (~65%) |
| **Champagne Gold** | `#C7A25A` | Accent, focus rings, premium highlights (~10% with charcoal) |
| **Charcoal Black** | `#1A1A1A` | Body text, neutral foreground |

Usage mix: cream-first surfaces; purple for signature moments; gold only for luxury accents. Tagline: **Curated for the Exceptional.** — [`../brand/VOICE.md`](../brand/VOICE.md).

### Typography

| Role | Family | Usage |
| ---- | ------ | ----- |
| **Display** | Playfair Display | Headings (`h1`–`h3`), hero copy, editorial moments |
| **Sans** | Inter | Body text, UI labels, forms (default `body` font) |
| **Alt** | Manrope | Secondary UI, metrics, compact labels |

Font files are loaded via `next/font` in the app layout; CSS variables `--font-display`, `--font-sans`, and `--font-alt` map to Tailwind utilities (`font-display`, `font-sans`, `font-alt`).

## Design tokens

All tokens live in **`app/globals.css`** under `:root` and `.dark`. They are registered in Tailwind v4 via `@theme inline` so utilities like `bg-primary`, `text-muted-foreground`, and `rounded-lg` resolve to brand values.

See [TOKENS.md](./TOKENS.md) for the full token reference.

## Storybook

Interactive component docs and visual regression baseline:

```bash
cd platform
pnpm storybook        # dev server → http://localhost:6006
pnpm build-storybook  # static export → storybook-static/
```

Storybook loads `app/globals.css`, supports light/dark via `@storybook/addon-themes`, and includes the `@storybook/addon-a11y` panel. MDX docs (including this introduction) live under `docs/design-system/`.

## Accessibility (WCAG 2.2 AA)

The system targets **WCAG 2.2 Level AA** (Brand Guidelines Volume V):

- **Color contrast** — Charcoal on cream is the primary reading pair; purple on white/cream for chrome and large text; gold is accent-only (not small body text). Re-verify after Phase B token swap. Semantic colors (`success`, `error`, `warning`, `info`) are paired with foreground tokens.
- **Focus** — Global `:focus-visible` outline (2px gold) plus component-level `focusRingClass` from `lib/motion.ts`.
- **Touch targets** — Minimum **44px** (`--touch-target` / `h-11`) on primary controls.
- **Motion** — `prefers-reduced-motion: reduce` collapses animations and scroll smoothing in `globals.css`.
- **Semantics** — Radix UI primitives supply roles and keyboard behavior; composite components add `aria-*` as needed.

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for patterns and checklists.

## Dark / light mode

Theme is class-based (`.dark` on `html` or a parent). `ThemeProvider` (`components/providers/theme-provider.tsx`) and `ThemeToggle` (`components/layout/theme-toggle.tsx`) integrate with `next-themes`.

| Surface | Light | Dark |
| ------- | ----- | ---- |
| Background | Luxury Cream `#F8F4EC` | Near-black `#121212` |
| Foreground | Charcoal `#1A1A1A` | Off-white `#F5F5F5` |
| Surface / cards | White | `#1A1A1A` / `#222222` elevated |
| Border | `#E4DFD3` | `#2E2E2E` |

Dark mode overrides semantic surface, shadow, and muted tokens in `.dark { … }` inside `globals.css`. Royal Purple and Champagne Gold remain stable across themes.

## Related brand docs

- [`../brand/README.md`](../brand/README.md) — Brand system index  
- [`../brand/COLORS.md`](../brand/COLORS.md) — Official + logo-sampled colors  
- [`../brand/LOGO.md`](../brand/LOGO.md) — Lockups and usage  
- [`../brand/VOICE.md`](../brand/VOICE.md) — Tagline, homepage/About copy framework

## Folder map

```
components/
├── ui/              # shadcn/ui primitives + brand extensions (Button, Dialog, …)
├── layout/          # App shell, container, grid, header/footer, theme toggle
├── navigation/      # Navbar, sidebar, mega menu, stepper, command palette
├── commerce/        # Product, cart, checkout, orders
├── dashboard/       # KPI cards, widgets, analytics chrome
├── charts/          # Recharts wrappers (line, bar, area, pie, donut)
├── cms/             # Content blocks (hero, FAQ, rich text, banners)
├── search/          # Search bar, filters, sort, results
├── media/           # Upload, gallery, lightbox, thumbnails
├── profile/         # Account forms, preferences, security
├── data/            # Tables, grids, empty/error/loading states
├── forms/           # Form helpers and specialized inputs
├── providers/       # ThemeProvider (app-level, not in public barrel)
└── marketing/       # Legacy/marketing-only (e.g. foundation-hero)

docs/design-system/  # This documentation + Storybook MDX
app/globals.css      # Design tokens (source of truth)
lib/motion.ts        # Shared motion + focus-ring utilities
.storybook/          # Storybook config, theme decorator
```

## Related docs

- [TOKENS.md](./TOKENS.md) — Color, type, spacing, radius, shadow, motion, z-index
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) — Focus, touch targets, ARIA, reduced motion
- [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) — Full component inventory (**147** components)
- [`../brand/GUIDELINES_INDEX.md`](../brand/GUIDELINES_INDEX.md) — Seven-volume guideline map

## Importing components

Prefer the barrel for app code:

```tsx
import { Button, ProductCard, KpiCard } from "@/components";
```

For tree-shaking or explicit paths:

```tsx
import { Button } from "@/components/ui/button";
```
