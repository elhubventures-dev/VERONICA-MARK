# Accessibility

VERONICA MARK targets **WCAG 2.2 Level AA** (Brand Guidelines Volume V). This document describes built-in patterns; validate pages with Storybook’s a11y addon, axe, and manual keyboard testing before release.

## Focus rings

### Global baseline

`app/globals.css` applies a visible focus indicator for keyboard users:

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Champagne Gold (`--color-accent` / `#C7A25A`) provides high visibility on both cream and charcoal backgrounds.

### Component utility

Interactive components also use `focusRingClass` from `lib/motion.ts`:

```
focus-visible:ring-2
focus-visible:ring-[var(--color-accent)]
focus-visible:ring-offset-2
focus-visible:outline-none
```

Applied on buttons, icon buttons, password toggles, number steppers, filter chips, and other custom controls. shadcn/Radix primitives inherit the same accent ring via Tailwind classes on `Button`, `Input`, etc.

**Do not** remove focus styles for aesthetics. Use `:focus-visible` (not `:focus`) so pointer clicks stay clean while keyboard users retain indicators.

## Touch targets

Minimum interactive size is **44×44 CSS pixels**, encoded as:

- CSS token: `--touch-target: 2.75rem`
- Default button size: `h-11` (44px) in `buttonVariants`
- Icon button size: `h-11 w-11`
- Number input steppers: `size-11` (44px)

When placing compact controls (`size="sm"`, `h-9`), ensure adequate spacing so adjacent targets are not closer than 8px and consider increasing hit area with padding on mobile.

## Reduced motion

`globals.css` respects `prefers-reduced-motion: reduce`:

- Disables smooth scroll on `html`
- Sets animation and transition durations to `0.01ms` globally

Framer Motion usage should call `motionTransition(reduceMotion)` from `lib/motion.ts` or check `useReducedMotion()` before animating layout, hero reveals, or drawer slides.

Storybook’s theme decorator does not override this — test with OS “Reduce motion” enabled.

## ARIA patterns

### Radix UI primitives

Components under `components/ui/` built on Radix ship with correct roles, focus traps, and keyboard maps:

| Component | Behavior |
| --------- | -------- |
| `Dialog` / `AlertDialog` / `Sheet` / `Drawer` | Focus trap, `aria-modal`, Escape to close |
| `DropdownMenu` / `Popover` | `aria-expanded`, roving focus |
| `Tabs` | `role="tablist"`, arrow-key navigation |
| `Accordion` | `aria-expanded` on triggers |
| `Tooltip` | Hover/focus pairing via Radix |
| `Select` / `RadioGroup` / `Checkbox` / `Switch` | Associated labels, checked state |

Prefer composing these primitives over raw `<div onClick>` for interactive widgets.

### Composite components

Domain components add semantics where Radix leaves gaps:

| Pattern | Example |
| ------- | ------- |
| `aria-label` on icon-only controls | Password show/hide, sort select, filter remove |
| `aria-hidden` on decorative icons | KPI trends, empty states, upload icons |
| `aria-busy` / loading labels | `LoadingState`, `Spinner` |
| `aria-invalid` + `aria-describedby` | `FormControl` in `forms/form.tsx` |
| `aria-label` on filter groups | `ActiveFilters`, `PriceRangeFilter` |
| Landmark labels | `Navbar` `label="Primary"`, search regions |

### Visually hidden text

Use `VisuallyHidden` (`components/ui/visually-hidden.tsx`) for screen-reader-only labels when visible design omits text (e.g. icon toolbar buttons).

### Live regions

Use `aria-live="polite"` for cart updates, toast notifications (Sonner), and async search result counts when implementing page-level features.

## Forms

- Every input must have an associated `<Label>` or `aria-label`.
- Error messages link via `aria-describedby` through the `FormMessage` primitive.
- Required fields: indicate visually and with `aria-required` where applicable.
- OTP inputs: use `InputOTP` with grouped slots for predictable screen-reader traversal.

## Color and contrast

- Body text uses `--color-foreground` on `--color-background` (black on cream / off-white on charcoal).
- Muted copy uses `--color-muted-foreground`; verify contrast if text is smaller than 18px regular / 14px bold.
- Do not rely on color alone for state — pair with icons, labels, or `StatusDot` variants.

## Storybook a11y addon

Run `pnpm storybook` and open the **Accessibility** panel on each story. The project enables `@storybook/addon-a11y` with `test: "todo"` in preview — treat violations as backlog items before marking stories production-ready.

## Checklist (new components)

1. Keyboard reachable and operable without a mouse
2. Visible `:focus-visible` or `focusRingClass`
3. Minimum 44px touch target for primary actions on mobile
4. Accessible name (`label`, `aria-label`, or `aria-labelledby`)
5. Decorative SVGs marked `aria-hidden`
6. Animations respect `prefers-reduced-motion`
7. Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI boundaries
