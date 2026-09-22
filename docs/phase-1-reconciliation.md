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
- **ACTIVE engineering baseline:** `origin/main` after the approved push. Local
  `main` and `origin/main` are synchronized at the authoritative SHA reported
  in the Phase 1C release notes.

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
an existing immutable image/release pattern for 21Kent. The Cemerlang release
candidate now has a separate compose contract, healthcheck, persistent upload
mount, and internal smoke proof. It still has no active public Caddy host or
DNS entry.

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
- The existing 21Kent backup architecture is a two-stage pattern: a systemd
  pre-backup creates a validated PostgreSQL dump, then the Hermes full-backup
  workflow creates a VPS archive and publishes it to a Syncthing `sendonly`
  folder named `21Kent VPS Backups`, with an `aspri-nas` peer configured. This
  is the reusable reference pattern; Cemerlang must use a dedicated artifact
  name and directory within that contract.
- A Cemerlang artifact was created at
  `cemerlang-toys/20260922T150943Z/` in the existing Syncthing send-only
  folder. Syncthing reported the folder idle and fully in sync with the NAS
  peer. The NAS receive-only path was independently located through the
  existing Agent Bus, and all four files were found there with matching
  checksums. The database dump and uploads archive were then transferred from
  that NAS path and restored in isolation successfully.
- The older encrypted contact-backup script is not active on the host: `age` is
  absent, its service is not loaded, and its env file has no destination or
  recipient values. The verified Cemerlang artifact therefore has Syncthing
  transport encryption only; artifact-level encryption is not present.
- A recurring Cemerlang backup schedule and dedicated retention/prune job are
  not yet active. The single-artifact backup/restore proof is PASS, but public
  cutover remains blocked until recurring generation and retention are wired to
  the existing operational schedule.
- A target VPS logical dump was also created from PostgreSQL 16.14 (33,479
  bytes, checksum recorded outside the repository) and restored into isolated
  PostgreSQL 18 successfully. Representative counts were 24 products, 12
  categories, 24 product images, and 1 user.
- A representative upload archive was created, extracted to an isolated
  temporary directory, and checksum-verified successfully. This proves the
  archive procedure locally, not NAS replication.

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
- Exact NAS-side Cemerlang path and artifact/restore proof: VERIFIED for the
  test artifact through Agent Bus and the Synology receive-only folder.
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

## Phase 1B validation record

- Runtime security patch: Next `16.2.9 -> 16.3.5`, next-auth
  `5.0.0-beta.31 -> beta.32`, and Prisma adapter `2.11.2 -> 2.11.3`.
  The audited production dependency set now has zero critical findings; the
  remaining findings are Prisma tooling/transitive advisories and are deferred
  without a Prisma downgrade.
- Middleware convention was migrated to `src/proxy.ts`; auth cookie checks and
  admin/login redirects were preserved. The build no longer emits the
  middleware deprecation warning.
- The root app and admin layout are explicitly runtime-only so Docker builds do
  not require a reachable database or production credential. This fixed the
  release build failure caused by the placeholder build-time database URL.
- Image `cemerlang-toys:3024fb1684a8b21a37db27f7f732576f7db9b44f` built on the
  VPS successfully from the exact local commit. It started on the internal
  `proxy` network with localhost-only port `13001`, became healthy, passed all
  required public route checks, returned `307` for unauthenticated `/admin`,
  and returned `405` for the expected GET `/api/upload` method restriction.
  The RC container was removed after testing; no Caddy or DNS change occurred.

## Phase 1C operational status

- **ACTIVE:** environment contract template with `AUTH_GOOGLE_ID` /
  `AUTH_GOOGLE_SECRET`, domain-portable `SITE_URL`/`AUTH_URL`, admin allowlist,
  and optional AI variables. No credential values are committed.
- **ACTIVE:** candidate Caddy block for `cemerlangtoys.21kent.com`; validating
  the existing Caddyfile plus this block passed without changing active Caddy.
- **ACTIVE:** release and rollback procedure uses immutable Git-SHA images,
  the existing `proxy` network, host-backed uploads, protected env files, and
  a health/smoke gate. Vercel remains transitional and untouched.
- **DEFERRED MAINTENANCE ACTION:** shared PostgreSQL administrative credential
  rotation. The exact procedure is documented in
  `deploy/postgres-root-rotation.md`; rotation was not attempted because it
  affects shared recovery infrastructure.
- **PASS:** one Cemerlang artifact reached NAS, checksum verification passed,
  and database/uploads restore from the NAS copy passed.
- **FOUNDATION BLOCKER:** recurring Cemerlang backup scheduling and effective
  retention are not yet installed. The one-off proof must not be mistaken for
  an operational backup contract.
