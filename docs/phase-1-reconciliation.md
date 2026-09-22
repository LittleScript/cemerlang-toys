# Phase 1 — Production and Product Truth Reconciliation

Status: ACTIVE working record, 2026-09-22. This document records the evidence
and migration boundary for the self-hosted target. It is not a deployment
procedure and must not be treated as authorization to change production.

## Source of truth

- **ACTIVE target:** standalone Cemerlang Toys application on the existing
  21Kent VPS, Dockerized, behind Caddy at `cemerlangtoys.21kent.com`.
- **LEGACY / TRANSITIONAL:** the current Vercel project. Keep it available as
  a reference until the VPS release is proven healthy.
- **SUPERSEDED constraint:** Vercel-specific persistence or filesystem behavior
  must not drive the target architecture.
- **UNKNOWN:** the exact Git SHA used by the current Vercel deployment. Route
  evidence is consistent with `origin/main` or another older source because
  production lacks `/tentang`, which exists only in the local line of work.
- **ACTIVE engineering baseline:** local `main` at the audited HEAD. It is not
  yet a shared or released source of truth because it is 21 commits ahead of
  `origin/main`.

## Verified data state

The read-only database audit against the database referenced by the local
`.env` returned the current Prisma model tables: 24 products, 12 categories,
24 product images, 3 variants, 1 user, 1 account, 1 session, 1 site-content
row, and 3 whitelist rows. One product image uses Vercel Blob; the other 23
image records are remote HTTP URLs. No PII or credentials are recorded here.

The VPS already has a `cemerlang` database, but it currently has no tables.
This is an empty target, not a migrated production database. The source of
truth for the 24-product dataset must still be formally confirmed before any
cutover.

The conservative migration classification is **LIKELY AUTHORITATIVE LEGACY
DATA** with high confidence, not mathematical proof: the dataset matches the
current Prisma schema, application runtime, public product route behavior,
catalog workflow, member records, and content rows. It remains a website
dataset and is not evidence of the total business inventory.

## Target deployment shape

The future application should be a separate release from `21KentWebsite`:

```text
DNS -> Caddy on 21Kent VPS -> cemerlang-toys:<git-sha> -> existing PostgreSQL
                                      |
                                      +-> persistent host upload directory
                                          -> encrypted database + upload backup
                                             -> existing NAS/backup pipeline
```

The existing VPS has Docker, Caddy, a persistent PostgreSQL 16 container and
an existing immutable image/release pattern for 21Kent. It does not yet have a
Cemerlang service, Caddy host entry, release directory, backup job, or health
check. Those are prerequisites for migration, not changes made in this phase.

The current repository Dockerfile is a viable starting point for a standalone
Next.js image, but the current compose file is local-development oriented: it
starts a second PostgreSQL instance, uses a fixed development password, has no
health check for the app, and does not define a VPS backup contract.

## Safe migration sequence

1. Confirm the authoritative legacy data source and obtain an encrypted,
   restorable backup. Do not use `prisma db push` as the migration mechanism.
2. Create a Prisma migration baseline from the existing production schema,
   without applying it to the empty VPS database until the schema is reviewed.
3. Provision a dedicated database role/database on the existing PostgreSQL
   service with least privilege. Keep it separate from the 21Kent website and
   do not use the shared root role for the app.
4. Define and test encrypted database backups plus an upload-directory backup
   into the existing NAS/backup architecture. Verify restore before cutover.
5. Build an immutable `cemerlang-toys:<git-sha>` image and run it on the VPS
   `proxy` network with a persistent, host-backed upload directory.
6. Add an explicit app health check, then add the Caddy host only after the
   container is healthy. Keep Vercel serving as the rollback/reference path.
7. Configure the temporary hostname, `AUTH_URL`, trusted-host behavior, and
   Google OAuth origin/callback only during the approved cutover window.
8. Smoke-test public routes, auth callback behavior, image persistence,
   database reads/writes, backup/restore, and rollback before declaring the VPS
   authoritative.

## Storage decision

The current upload route writes validated files to `public/uploads`, and the
runtime serves them through `/uploads/[...path]`. This can work on the VPS only
with a persistent host-backed directory, authenticated admin writes, atomic
temporary-file-to-final-file moves, file-size/type validation, and an explicit
backup contract. Vercel Blob is not currently the canonical implementation:
the token is not referenced by active upload code, and only one legacy image
record points to a Blob URL.

The recommended first target is persistent VPS storage backed up to NAS, unless
the existing backup/restore test shows that object storage is operationally
safer. No asset migration has been performed.

The VPS bind mount `/opt/cemerlang-toys/uploads` has been created with owner
UID/GID 1001 and mode 0750. A write, container replacement, read-only remount,
checksum comparison, and cleanup test passed. NAS replication is not yet
verified because no Cemerlang NAS destination is mounted/configured.

The upload route now writes to a UUID filename through a temporary file and
atomic rename, and the read route accepts only the generated UUID filename
shape. The application image does not own mutable upload data.

## Backup and restore evidence

- A Neon custom-format backup was created with PostgreSQL 18.6 because the
  Neon server reported 18.6 and the VPS PostgreSQL client is 16.14.
- The backup size was 50,871 bytes and its SHA-256 was recorded outside the
  repository. `pg_restore --list` validated 105 archive entries.
- Full restore into isolated PostgreSQL 18 succeeded and reproduced the public
  dataset counts.
- The VPS PostgreSQL 16 server rejected the PostgreSQL 18 archive preamble
  (`transaction_timeout`). The safe adaptation was to apply the Prisma baseline
  to the empty VPS database and restore only public data after filtering the
  incompatible statement. Public row counts and relations then validated.
- The existing VPS backup script is not currently operationally ready: the
  host has no `age` executable and its env file has no configured age recipient
  or Cemerlang destination. No backup is marked READY until an off-host/NAS
  destination, encryption tool, scheduled job, and restore test exist.

## Domain portability

The application must read its canonical site origin from configuration (the
template uses `SITE_URL`), not embed the temporary hostname in business logic.
Future domain migration should require DNS, Caddy host configuration, auth
trusted-origin/OAuth settings, canonical metadata, sitemap/robots origin, and
redirects only.

## Open gates

- Exact Vercel deployment SHA: UNKNOWN.
- Whether the audited Neon database is definitely the Vercel runtime database:
  UNKNOWN until Vercel environment metadata or runtime evidence is checked.
- Current OAuth authorized origins/callbacks and production `AUTH_URL`: UNKNOWN.
- Existing NAS destination and restore-test contract for Cemerlang uploads:
  UNKNOWN.
- Owner approval of factual marketing claims: required before SEO structured
  data or new public copy is authored.

## Security and secrets

The active `/opt/docker-compose.yml` on the VPS contains a plaintext PostgreSQL
root password. The active PostgreSQL container uses that root credential, but
the audited production applications use separate roles (`contact_app` and
`glitchtip`). Rotation was not performed because the root credential is still a
shared administrative dependency and recovery/cutover coordination is not yet
complete. The value is intentionally not recorded.

The VPS now has dedicated Cemerlang roles and protected secret files:

- `cemerlang_owner`: NOLOGIN schema/database owner
- `cemerlang_migrator`: login role for controlled migrations
- `cemerlang_app`: least-privilege application role
- `/opt/cemerlang-secrets/app.env`: root:docker, mode 0640
- `/opt/cemerlang-secrets/migrator.env`: root:root, mode 0600

The legacy root credential still needs a coordinated rotation and audit of all
remaining consumers.
