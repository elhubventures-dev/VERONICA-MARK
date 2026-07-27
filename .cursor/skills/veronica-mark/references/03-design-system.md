# Volume 3 — UI Design System

Source: VERONICA_MARK_UI_Design_System.docx (Enterprise Design System v1.0)

## Brand Foundation
Luxury, premium, modern. Visual principles: elegance, clarity, consistency, accessibility, performance. This is the design authority for the storefront — favor restraint over decoration in every component decision.

## Color System (authoritative — use these tokens, not ad-hoc hex values)
- Primary: Royal Purple `#5B2E91`
- Secondary: Cream `#F8F5EE`
- Accent: Gold `#C9A227`
- Neutral: Black `#111111`, White `#FFFFFF`, Gray scale 50–900
- Semantic: Success `#16A34A`, Warning `#F59E0B`, Error `#DC2626`, Info `#2563EB`

## Typography
- Display: **Playfair Display**
- Primary UI: **Inter**
- Alternative: **Manrope**
- Scale (px): 12, 14, 16, 18, 20, 24, 30, 36, 48, 60
- Line height: 1.5 body / 1.2 headings

## Spacing & Layout
- Base unit: 4px
- Scale (px): 4, 8, 12, 16, 24, 32, 40, 48, 64, 96
- Max content width: 1440px
- 12-column responsive grid

## Components
Buttons, Inputs, Selects, Checkboxes, Radios, Cards, Product Cards, Navigation, Breadcrumbs, Modals, Drawers, Tables, Badges, Alerts, Tabs, Accordions, Pagination, Toasts, Skeletons, Carousels, Charts.
**Build these with shadcn/ui + Tailwind CSS tokens** — don't hand-roll primitives shadcn already provides.

## Icons & Imagery
- Icon set: **Lucide**
- Product imagery ratios: 1:1 and 4:5
- Rounded corners: 12px
- Subtle shadows; motion via Framer Motion only

## Dark & Light Themes
- **Light:** cream backgrounds, dark text, gold highlights
- **Dark:** charcoal backgrounds `#121212`, light typography, muted surfaces, gold + purple accents
- Theme choice persisted per user

## Responsive Breakpoints (authoritative for Tailwind config)
640 / 768 / 1024 / 1280 / 1536 px. Mobile-first. Collapsible nav, adaptive grids (1/2/3/4/5 columns), 44px minimum touch targets.

> This is the canonical breakpoint set for implementation. The UX Specification volume lists a coarser set (768/1024/1440) for describing layout behavior narratively — when writing actual CSS/Tailwind config, use the breakpoints in this document.

## Accessibility
WCAG 2.2 AA. Keyboard navigation, visible focus states, ARIA labels, sufficient contrast, reduced-motion support.

## Design Tokens
Centralize colors, spacing, typography, radii, shadows, z-index, animation durations, and breakpoints as Tailwind config tokens — never hardcode raw values in components.
