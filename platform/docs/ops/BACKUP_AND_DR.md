# Database Backup & Disaster Recovery

## Neon PostgreSQL
### Backup strategy
| Control | Recommendation |
| --- | --- |
| PITR | Enable on production branch (Neon paid tier) |
| Snapshots | Weekly logical snapshot before major migrations |
| Branches | Create ephemeral branch for risky schema experiments |
| Retention | Align with business RPO (suggest ≤ 24h for v1.0 commerce) |

### Backup verification (monthly)
1. Create restore branch from PITR timestamp.
2. Run `pnpm exec prisma migrate status` against restored URL.
3. Spot-check order/customer tables.
4. Tear down restore branch.

### Manual dump (optional ops laptop)
```bash
# Requires Neon unpooled connection string
pg_dump "$DATABASE_URL_UNPOOLED" --format=custom --file="vm-$(date +%Y%m%d).dump"
```

### Restore
```bash
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL_UNPOOLED" vm-YYYYMMDD.dump
pnpm exec prisma migrate deploy
```

## Supabase Storage
- Enable bucket versioning if available for critical brand assets.
- Keep a quarterly export of essential brand logos/banners.
- Document bucket name: `veronica-mark-media`.

## Application (Vercel)
- Immutable deployments; roll back via Vercel Instant Rollback.
- Keep previous successful deployment pinned during peak campaigns.

## RTO / RPO targets (v1.0)
| Metric | Target |
| --- | --- |
| RPO | ≤ 24 hours (Neon PITR preferred ≤ 1 hour) |
| RTO | ≤ 4 hours (rollback + restore branch) |

## Incident runbook (short)
1. Declare incident; freeze deploys.
2. If data corruption: restore Neon PITR branch → validate → swap connection strings or promote branch.
3. If bad release: Vercel rollback.
4. If storage outage: serve cached CDN images; pause uploads.
5. Communicate status; write postmortem.
