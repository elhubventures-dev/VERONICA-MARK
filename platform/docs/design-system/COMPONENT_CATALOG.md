# Component Catalog

Inventory of all production components under `components/` (excluding `*.stories.tsx`). Story files mirror each component for Storybook.

**Total: 147 components**

---

## UI (`components/ui/`) — 45

| Component | Description |
| --------- | ----------- |
| `accordion` | Expand/collapse sections with Radix accordion primitives |
| `alert` | Inline alert banner with title and description variants |
| `alert-dialog` | Modal confirmation dialog for destructive or critical actions |
| `aspect-ratio` | Container that locks media to a fixed aspect ratio |
| `avatar` | User avatar with image fallback and initials |
| `badge` | Small status or category label pill |
| `breadcrumb` | Hierarchical navigation trail with separators |
| `button` | Primary interactive button with brand variants and sizes |
| `button-group` | Horizontal or vertical grouping of related buttons |
| `calendar` | Date picker calendar built on react-day-picker |
| `card` | Surface container with header, content, footer slots |
| `checkbox` | Accessible checkbox with brand styling |
| `collapsible` | Show/hide content region with animated trigger |
| `command` | Command palette / searchable list (cmdk) |
| `dialog` | Modal overlay with focus trap and close control |
| `drawer` | Mobile-friendly slide-in panel from screen edge |
| `dropdown-menu` | Context menu with items, shortcuts, and submenus |
| `hover-card` | Preview card shown on hover or focus |
| `icon-button` | Square icon-only button meeting touch-target size |
| `input` | Text input field with border and focus ring |
| `input-otp` | One-time password / verification code input slots |
| `kbd` | Keyboard shortcut badge styling |
| `label` | Form field label associated with controls |
| `pagination` | Page navigation controls with prev/next |
| `popover` | Floating content anchored to a trigger |
| `progress` | Linear progress indicator bar |
| `radio-group` | Mutually exclusive option selector |
| `scroll-area` | Custom scrollable region with styled scrollbar |
| `select` | Dropdown select with keyboard navigation |
| `separator` | Visual divider line (horizontal or vertical) |
| `sheet` | Side panel overlay sliding from edge |
| `skeleton` | Loading placeholder with pulse animation |
| `slider` | Range slider for numeric value selection |
| `sonner` | Toast notification provider and `toast()` API |
| `spinner` | Indeterminate loading spinner with size variants |
| `status-dot` | Colored dot indicating online/status state |
| `switch` | Toggle switch for boolean settings |
| `table` | Semantic table with header, body, footer rows |
| `tabs` | Tabbed interface with keyboard navigation |
| `textarea` | Multi-line text input |
| `toggle` | Pressable toggle button (single) |
| `toggle-group` | Group of toggle buttons (single or multi) |
| `tooltip` | Short hint shown on hover or focus |
| `typography` | Display and body text primitives (H1–H4, Lead, Muted) |
| `visually-hidden` | Screen-reader-only content wrapper |

---

## Layout (`components/layout/`) — 10

| Component | Description |
| --------- | ----------- |
| `app-shell` | Full application chrome wrapping header, main, footer |
| `container` | Max-width centered content wrapper (`--content-max`) |
| `grid` | CSS grid layout with configurable columns and gap |
| `page-header` | Page title area with subtitle and action slot |
| `responsive-grid` | Breakpoint-aware grid for product and content tiles |
| `section` | Vertical section with optional title and padding |
| `site-footer` | Global site footer with links and brand mark |
| `site-header` | Global site header with navigation slot |
| `stack` | Flex stack for vertical or horizontal spacing |
| `theme-toggle` | Light/dark mode switch using next-themes |

---

## Navigation (`components/navigation/`) — 8

| Component | Description |
| --------- | ----------- |
| `command-palette` | Global search and quick-action command menu |
| `mega-menu` | Multi-column dropdown navigation with featured links |
| `mobile-nav` | Drawer-based navigation for small viewports |
| `nav-link` | Styled Next.js link with active state |
| `navbar` | Primary horizontal navigation bar |
| `pagination-nav` | SEO-friendly page navigation for listings |
| `sidebar` | Vertical admin or dashboard sidebar navigation |
| `stepper` | Multi-step flow indicator (checkout, onboarding) |

---

## Commerce (`components/commerce/`) — 22

| Component | Description |
| --------- | ----------- |
| `add-to-cart-button` | Primary CTA to add a product variant to cart |
| `address-card` | Display/select a saved shipping or billing address |
| `cart-drawer` | Slide-out cart summary with line items |
| `cart-item` | Single cart line with image, qty, and remove |
| `cart-summary` | Subtotal, shipping, tax, and total breakdown |
| `checkout-steps` | Checkout progress stepper (cart → payment → confirm) |
| `checkout-summary` | Order review panel during checkout |
| `coupon-input` | Promo code entry with apply/validation state |
| `empty-cart` | Empty cart illustration with continue-shopping CTA |
| `mini-cart` | Compact header cart dropdown preview |
| `order-card` | Order summary card for account order history |
| `order-status-badge` | Colored badge for order fulfillment status |
| `order-timeline` | Vertical timeline of order status events |
| `payment-method-card` | Display/select a saved payment method |
| `price` | Formatted price with compare-at and currency |
| `product-badge` | Product label (New, Sale, Limited, etc.) |
| `product-card` | Product tile for grid/list catalog views |
| `product-gallery` | Product image gallery with thumbnail selection |
| `quantity-selector` | Increment/decrement product quantity control |
| `shipping-estimator` | Shipping cost and delivery estimate form |
| `variant-selector` | Size/scent/variant option picker |
| `wishlist-button` | Toggle save-to-wishlist heart control |

---

## Dashboard (`components/dashboard/`) — 12

| Component | Description |
| --------- | ----------- |
| `activity-feed` | Recent events list for admin dashboards |
| `analytics-card` | Generic analytics metric card wrapper |
| `chart-widget` | Dashboard card shell with embedded chart slot |
| `conversion-funnel` | Funnel visualization of step conversion rates |
| `dashboard-header` | Dashboard page title with action buttons |
| `date-range-picker` | Start/end date filter for analytics |
| `kpi-card` | Key metric card with trend indicator |
| `metric-sparkline` | Inline sparkline for KPI trend preview |
| `progress-ring` | Circular progress / goal completion ring |
| `revenue-widget` | Revenue summary widget with period comparison |
| `stat-widget` | Single-stat summary tile |
| `traffic-widget` | Traffic source breakdown list |

---

## Charts (`components/charts/`) — 6

| Component | Description |
| --------- | ----------- |
| `area-chart` | Stacked or filled area time-series chart |
| `bar-chart` | Vertical or horizontal bar chart |
| `chart-container` | Responsive Recharts wrapper with theme tokens |
| `donut-chart` | Donut/pie chart with center label slot |
| `line-chart` | Multi-series line chart for trends |
| `pie-chart` | Proportional pie chart for category splits |

---

## CMS (`components/cms/`) — 8

| Component | Description |
| --------- | ----------- |
| `banner-block` | Informational or promotional inline banner |
| `cms-block` | Generic CMS block wrapper with admin label |
| `content-section` | Titled content region with optional action |
| `faq-accordion` | FAQ list using accordion pattern |
| `hero-block` | Full-width hero with headline, CTA, and image |
| `media-block` | CMS image/video block with caption |
| `promo-banner` | Promotional strip with headline and CTA link |
| `rich-text` | Sanitized HTML rich-text renderer |

---

## Search (`components/search/`) — 9

| Component | Description |
| --------- | ----------- |
| `active-filters` | Row of applied filter chips with clear-all |
| `faceted-filter` | Checkbox facet group for catalog filtering |
| `filter-chip` | Removable single filter tag |
| `filter-panel` | Sidebar filter container with footer actions |
| `price-range-filter` | Dual-handle price range slider |
| `search-bar` | Primary catalog search input with submit |
| `search-empty` | No-results state with query and clear action |
| `search-results` | Result list/grid with count and query highlight |
| `sort-select` | Sort order dropdown (price, newest, etc.) |

---

## Media (`components/media/`) — 6

| Component | Description |
| --------- | ----------- |
| `avatar-upload` | Profile photo upload with preview and remove |
| `dropzone` | Drag-and-drop file upload target area |
| `file-upload` | Button-triggered file picker with file list |
| `image-thumbnail` | Selectable image thumb with hover overlay |
| `media-gallery` | Responsive grid gallery with selection |
| `media-lightbox` | Full-screen image viewer dialog |

---

## Profile (`components/profile/`) — 6

| Component | Description |
| --------- | ----------- |
| `address-form` | Shipping/billing address entry form |
| `notification-preferences` | Email/push notification toggle panel |
| `preference-toggles` | Generic settings toggle list |
| `profile-form` | Name, email, and account details form |
| `profile-header` | Account header with avatar and tier badge |
| `security-settings` | Password change and 2FA settings panel |

---

## Data (`components/data/`) — 6

| Component | Description |
| --------- | ----------- |
| `confirm-action` | Alert dialog wrapper for confirm/cancel flows |
| `data-grid` | Card-based grid for structured data items |
| `data-table` | Sortable TanStack table with pagination hooks |
| `empty-state` | Empty dataset illustration with optional CTA |
| `error-state` | Error feedback with retry action |
| `loading-state` | Skeleton or spinner loading placeholder |

---

## Forms (`components/forms/`) — 8

| Component | Description |
| --------- | ----------- |
| `currency-input` | Money amount input with currency prefix |
| `fieldset` | Grouped form fields with legend and description |
| `form` | react-hook-form primitives (FormField, FormItem, etc.) |
| `form-section` | Titled subsection within a long form |
| `number-input` | Numeric stepper with increment/decrement buttons |
| `password-input` | Password field with show/hide toggle |
| `phone-input` | Phone number input with country prefix select |
| `search-input` | Input with search icon and Enter-to-submit |

---

## Providers (`components/providers/`) — 1

| Component | Description |
| --------- | ----------- |
| `theme-provider` | next-themes provider for class-based dark mode |

---

## Summary by category

| Category | Count |
| -------- | ----- |
| UI | 45 |
| Layout | 10 |
| Navigation | 8 |
| Commerce | 22 |
| Dashboard | 12 |
| Charts | 6 |
| CMS | 8 |
| Search | 9 |
| Media | 6 |
| Profile | 6 |
| Data | 6 |
| Forms | 8 |
| Providers | 1 |
| **Total** | **147** |

> **Note:** `components/marketing/foundation-hero.tsx` exists for legacy marketing pages and is excluded from the public barrel export.
