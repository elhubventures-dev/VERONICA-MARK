# PWA — install + offline shell

Backlog item 21 ships an installable storefront PWA with a branded offline fallback, gated by the `storefront.pwa` feature flag.

## Feature flag

| Key | Default (seed) | Scope |
|---|---|---|
| `storefront.pwa` | `true` in DEVELOPMENT, `false` in STAGING/PRODUCTION | Storefront service worker registration + install prompt |

Toggle from **Super Admin → Feature flags** (Enable/Disable writes Prisma for the current deployment environment).

Environment mapping:

- `VERCEL_ENV=production` → `PRODUCTION`
- `VERCEL_ENV=preview` → `STAGING`
- Local / test → `DEVELOPMENT`

## What ships

- Web app manifest: `app/manifest.ts`
- Service worker (Serwist + Turbopack): `app/sw.ts`, served at `/serwist/sw.js`
- Offline fallback page: `/~offline`
- Install prompt: bottom bar on storefront routes (suppressed on checkout/cart/account/auth)
- PWA icons: `public/brand/pwa/icon-192.png`, `icon-512.png`, `maskable-512.png`

When the flag is **off**, the storefront unregisters any existing service workers and hides the install prompt.

## Ops notes

- PWA install requires **HTTPS** (or `localhost`). Opening the Network URL from a phone (`http://192.168.x.x:3000`) is **not** a secure context — Chrome will not fire `beforeinstallprompt`. The storefront still shows a manual “Add to Home Screen / Install app” hint when the flag is on.
- Ensure the flag exists locally: run `pnpm db:seed`, or enable **storefront.pwa** under Super Admin → Feature flags. Missing rows default to off.
- Validate with a **production build** (`pnpm build && pnpm start`); dev mode does not mirror full SW caching behavior.
- After enabling in staging/production, hard-refresh or clear site data if a prior SW was registered during testing.

## Manual QA checklist

1. With flag on (local dev after seed): Lighthouse PWA installability passes on home.
2. Offline navigation shows `/~offline` with recovery actions.
3. With flag off: no install banner; service workers unregister.
4. Admin Enable/Disable persists and revalidates `/admin/feature-flags`.
