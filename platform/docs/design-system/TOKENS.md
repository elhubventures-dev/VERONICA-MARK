# Design Tokens

**Brand palette source of truth:** [`../brand/COLORS.md`](../brand/COLORS.md) (Volume II + logo analysis).  
**Runtime CSS:** [`app/globals.css`](../../app/globals.css). Tokens are CSS custom properties on `:root`, with dark-mode overrides under `.dark`. Tailwind v4 maps them through `@theme inline`.

> Official values below are live in `app/globals.css` (Phase B).

## Color

### Brand (official — Volume II)

| Token | Light value | Usage |
| ----- | ----------- | ----- |
| `--color-primary` | `#4B246A` | Royal Purple — primary buttons, brand chrome (~25% of UI) |
| `--color-primary-foreground` | `#FFFFFF` | Text on primary |
| `--color-secondary` | `#F8F4EC` | Luxury Cream — secondary surfaces (~65% canvas) |
| `--color-secondary-foreground` | `#1A1A1A` | Text on secondary |
| `--color-accent` | `#C7A25A` | Champagne Gold — premium accents only (~10% with charcoal) |
| `--color-accent-foreground` | `#1A1A1A` | Text on accent |
| `--color-neutral` | `#1A1A1A` | Charcoal Black — strong neutral |
| `--color-white` | `#FFFFFF` | Pure white |

### Gray scale

`--color-gray-50` through `--color-gray-900` — warm stone palette for borders, disabled states, and subtle hierarchy.

### Semantic

| Token | Value | Pair |
| ----- | ----- | ---- |
| `--color-success` | `#16A34A` | `--color-success-foreground` |
| `--color-warning` | `#F59E0B` | `--color-warning-foreground` |
| `--color-error` | `#DC2626` | `--color-error-foreground` |
| `--color-info` | `#2563EB` | `--color-info-foreground` |

### Surfaces

| Token | Light | Dark (`.dark`) |
| ----- | ----- | -------------- |
| `--color-background` | `#F8F4EC` | `#121212` |
| `--color-foreground` | `#1A1A1A` | `#F5F5F5` |
| `--color-surface` | `#FFFFFF` | `#1A1A1A` |
| `--color-surface-elevated` | `#FFFFFF` | `#222222` |
| `--color-muted` | `#F1EEE6` | `#222222` |
| `--color-muted-foreground` | `#5C5C5C` | `#B3B3B3` |
| `--color-border` | `#E4DFD3` | `#2E2E2E` |
| `--color-ring` | `#C7A25A` | `#C7A25A` |
| `--color-overlay` | `rgb(26 26 26 / 0.48)` | `rgb(0 0 0 / 0.64)` |

Usage mix target: **~65% cream / ~25% purple / ~10% charcoal + gold**. Gold is for focus rings, dividers, and luxury finishes — not large fills. Logo metallic gold ranges are documented in [`../brand/COLORS.md`](../brand/COLORS.md); UI uses flat `#C7A25A`.

## Typography

### Font families

| Token | Stack |
| ----- | ----- |
| `--font-display` | `"Playfair Display", ui-serif, Georgia, serif` |
| `--font-sans` | `"Inter", ui-sans-serif, system-ui, sans-serif` |
| `--font-alt` | `"Manrope", ui-sans-serif, system-ui, sans-serif` |

### Size scale

| Token | Size |
| ----- | ---- |
| `--font-size-xs` | 0.75rem (12px) |
| `--font-size-sm` | 0.875rem (14px) |
| `--font-size-base` | 1rem (16px) |
| `--font-size-lg` | 1.125rem (18px) |
| `--font-size-xl` | 1.25rem (20px) |
| `--font-size-2xl` | 1.5rem (24px) |
| `--font-size-3xl` | 1.875rem (30px) |
| `--font-size-4xl` | 2.25rem (36px) |
| `--font-size-5xl` | 3rem (48px) |
| `--font-size-6xl` | 3.75rem (60px) |

### Line height

| Token | Value |
| ----- | ----- |
| `--line-height-body` | `1.5` |
| `--line-height-heading` | `1.2` |

Headings (`h1`–`h3`) and `.font-display` use `--font-display` and `--line-height-heading` via base styles in `globals.css`.

## Spacing

4px base grid:

| Token | Value |
| ----- | ----- |
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.25rem (20px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |
| `--space-16` | 4rem (64px) |
| `--space-24` | 6rem (96px) |

### Layout

| Token | Value |
| ----- | ----- |
| `--content-max` | `1440px` |
| `--touch-target` | `2.75rem` (44px) |

## Radius

Standard corner radius is **12px** (`0.75rem`) for cards and controls.

| Token | Value |
| ----- | ----- |
| `--radius-sm` | 0.5rem (8px) |
| `--radius-md` | 0.75rem (12px) |
| `--radius-lg` | 0.75rem (12px) |
| `--radius-xl` | 0.75rem (12px) |
| `--radius-full` | `9999px` |

## Shadow

| Token | Light | Notes |
| ----- | ----- | ----- |
| `--shadow-subtle` | `0 8px 24px rgb(26 26 26 / 0.06)` | Cards, dropdowns |
| `--shadow-md` | `0 12px 32px rgb(26 26 26 / 0.08)` | Elevated panels |
| `--shadow-lg` | `0 20px 48px rgb(26 26 26 / 0.12)` | Modals, drawers |

Dark mode increases shadow opacity for depth on charcoal backgrounds.

## Motion

| Token | Value |
| ----- | ----- |
| `--duration-fast` | `150ms` |
| `--duration-normal` | `250ms` |
| `--duration-slow` | `400ms` |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` |

Framer Motion helpers in `lib/motion.ts` use the same easing curve (`luxuryEase`) and respect `prefers-reduced-motion` at call sites via `motionTransition()`.

## Z-index

Layering scale for overlays and floating UI:

| Token | Value | Typical use |
| ----- | ----- | ----------- |
| `--z-dropdown` | `50` | Menus, popovers |
| `--z-sticky` | `100` | Sticky headers |
| `--z-overlay` | `200` | Backdrops |
| `--z-modal` | `300` | Dialogs, drawers |
| `--z-toast` | `400` | Sonner toasts |
| `--z-tooltip` | `500` | Tooltips |

## Breakpoints

Registered in `@theme inline`:

| Token | Width |
| ----- | ----- |
| `--breakpoint-sm` | 640px |
| `--breakpoint-md` | 768px |
| `--breakpoint-lg` | 1024px |
| `--breakpoint-xl` | 1280px |
| `--breakpoint-2xl` | 1536px |
