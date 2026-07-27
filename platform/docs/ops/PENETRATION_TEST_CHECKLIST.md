# Penetration test — ops checklist (P0 #4)

Authorized engagement only. Do **not** run intrusive scans against production without written approval.

## Before engagement
- [ ] Written scope approval (storefront, auth, account, brand, admin, public APIs)
- [ ] Non-production credentials provisioned (rotate after test)
- [ ] Staging URL + freeze window agreed
- [ ] Emergency contact / rollback owner named

## Execute
- [ ] Follow [PENETRATION_TEST_PLAN.md](./PENETRATION_TEST_PLAN.md) cases (auth, tenancy, injection, business logic)
- [ ] Capture evidence for each High/Critical finding

## After engagement
- [ ] Triage findings (Critical → High → Medium)
- [ ] Open tracked remediation tickets linked to this checklist
- [ ] Re-test Critical/High before wide public traffic
- [ ] Rotate any credentials shared with testers
- [ ] Update [SECURITY_AUDIT_STAGE10.md](./SECURITY_AUDIT_STAGE10.md) with disposition

## Status
**Not started** — engineering prep complete; schedule vendor/internal authorized test.
