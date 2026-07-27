# Stage 6 — Customer Dashboard Usability Review

Review date: 2026-07-24  
Scope: Authenticated customer area under `app/account/**`  
Verdict: **Pass for Stage 6** — complete, responsive account workspace with recovery paths and dark mode. Persistence is demo-backed until later API wiring.

## Coverage checklist

| Surface | Route | Usability notes |
| --- | --- | --- |
| Dashboard home | `/account` | KPIs, recent orders, updates, quick links, recommendations |
| Orders | `/account/orders`, `/account/orders/[orderNumber]` | Status, timeline, invoice + return CTAs |
| Invoices | `/account/invoices`, `/account/invoices/[orderNumber]` | Print action; clear totals |
| Wishlist | `/account/wishlist` | Empty → shop CTA; PDP links |
| Rewards | `/account/rewards` | Tier progress + ledger |
| Wallet | `/account/wallet` | Balance + credit/debit history |
| Coupons | `/account/coupons` | Copy code; available vs used |
| Addresses | `/account/addresses` | Add/edit/default/remove (local demo) |
| Profile | `/account/profile` | Prefill form + save toast |
| Notifications | `/account/notifications` | Unread emphasis + All/Unread filter |
| Returns | `/account/returns`, `/account/returns/[id]` | Status detail + recovery |
| Referral | `/account/referral` | Code/URL copy + invite form |
| Security | `/account/security` | Password, 2FA toggle, sessions |
| Settings | `/account/settings` | Notification prefs + **ThemeToggle** dark mode |
| Analytics | `/account/analytics` | YTD KPIs, spend bars, category mix |
| Shell | layout + `AccountShell` | Sidebar (desktop), drawer (mobile), skip link, sign out |

## Flow & IA

- **Navigation**: Grouped sidebar (Overview / Shopping / Benefits / Account) matches mental model; mobile drawer closes on route change and Escape.
- **Discoverability**: Storefront header includes Account icon → `/account` (auth gate redirects guests to sign-in).
- **Order loop**: List → detail → invoice / track / request return — no dead ends.
- **Empty states**: Shared `AccountEmptyState` with shop/continue CTAs on sparse lists.
- **Feedback**: Forms use sonner toasts for save/copy/invite actions.
- **Dark mode**: Header ThemeToggle + Settings appearance section (light / dark / system).
- **Responsive**: Collapsible desktop sidebar; stacked forms and KPI grids on small screens.

## Accessibility

- Skip link to `#account-main`
- Icon buttons labelled; switches have `aria-label`
- Active nav via `aria-current="page"`
- Focusable main landmark; dialog semantics on mobile nav overlay

## Known Stage 6 boundaries (not blockers)

1. Account data uses production-shaped **demo fixtures** (`lib/account/demo-data.ts`) — Prisma models exist but live sync is deferred.
2. Profile/addresses/settings/security mutations are optimistic UI (toast only).
3. Account wishlist is independent of storefront `localStorage` wishlist until sync stage.
4. Tracking opens an external tracker with the demo tracking number.

## Stop criteria

Stage 6 complete. Do not start Stage 7 unless explicitly requested.
