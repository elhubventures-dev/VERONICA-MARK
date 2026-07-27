# Stage 4 Security Audit — Enterprise Authentication

**Status:** Complete — stop pending approval before Stage 5.

**Verified:** `pnpm typecheck` · `pnpm test` (11 tests incl. auth suite) · `pnpm build` ✅

---

## Scope covered

| Requirement | Implementation |
| --- | --- |
| Google Login | Auth.js Google provider when `AUTH_GOOGLE_*` set; creates Customer profile + RBAC assignment |
| Email Login | Credentials provider + bcrypt(12) |
| Password Reset | `PasswordResetToken` hashed tokens, email link, single-use |
| Email Verification | `VerificationToken` hashed tokens + confirm page |
| Session / JWT | Auth.js JWT strategy, 7-day max age |
| Secure Cookies | httpOnly session cookies; `secure` in production; CSRF `sameSite=strict` |
| RBAC | Guest · Customer · Brand Manager · Super Admin |
| Middleware | Route protection + CSRF seed + guest id cookie |
| Permissions | `UserRoleAssignment` → Role → Permission; SUPER_ADMIN bypass |
| Route Guards | Middleware + `requireAuth` / `RoleGate` / `requirePermission` |
| Activity / Security logs | `logSecurityEvent` → Pino + AuditLog when userId present |
| Rate Limiting | Upstash Redis + in-memory fallback per auth action |
| CSRF | Double-submit cookie + form token; required on mutating server actions |

---

## Pages

- `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`
- `/auth/verify-email`, `/auth/verify-email/confirm`
- `/auth/error`, `/auth/sign-out`
- Protected shells: `/account`, `/brand`, `/admin`, `/forbidden`

Reusable components under `components/auth/*`.

---

## Findings

### Pass

1. **Password policy** enforced server-side (length + complexity) before bcrypt hash.
2. **Reset / verify tokens stored hashed**; raw token only in email links.
3. **Password reset does not reveal** whether an email exists.
4. **Rate limits** on register / forgot / reset / sign-in paths.
5. **CSRF required** on register, reset, resend verification, sign-out actions.
6. **Middleware RBAC** blocks Customer from `/brand` and `/admin`.
7. **Security events** logged for success/failure auth lifecycle.
8. **Guest cookie** (`vm_guest_id`) issued for future cart merge without elevating privileges.
9. **Next.js security headers** already set in `next.config.ts` (CSP, frame, nosniff, etc.).

### Accepted risks / follow-ups

| ID | Severity | Item | Recommendation |
| --- | --- | --- | --- |
| A1 | Medium | Transactional email currently **logs links in development**; no production ESP wired | Wire Resend/SES before GA; keep URL logging out of production |
| A2 | Low | Email verification confirm is CSRF-exempt (token-in-URL GET) | Keep; token entropy is the control — document for pen-test |
| A3 | Medium | Credentials sign-in relies on Auth.js CSRF for `/api/auth/*` only | Keep; do not bypass Auth.js CSRF |
| A4 | Low | In-memory rate limit is per-instance | Require Upstash Redis in staging/production |
| A5 | Medium | Brand Manager brand-scoping is role-level; data filters must use `BrandManagerProfile.brandId` in services | Enforce in Stage 5 commerce/admin APIs |
| A6 | Info | Google account linking disabled (`allowDangerousEmailAccountLinking: false`) | Correct default; support explicit link flow later if needed |
| A7 | Low | Session is JWT (stateless); server-side revocation is limited | Add token version / denylist if forced logout-all is required |

### Residual risk statement

Auth is **production-capable for Alpha** once Neon is migrated/seeded and Google + email provider secrets are configured. Do not expose password-reset or verification emails via logs in production environments.

---

## Configuration checklist

```env
AUTH_SECRET=         # openssl rand -base64 32 (≥32 chars)
AUTH_URL=            # https://your-domain
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=
```

---

## Stop

Stage 4 authentication is complete. Await approval before Stage 5.
