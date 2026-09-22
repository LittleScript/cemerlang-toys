# Cemerlang VPS release preparation

This directory contains release artifacts only. Nothing here performs DNS
cutover or changes Caddy automatically.

## Runtime contract

- Image: `cemerlang-toys:<git-sha>`
- Compose: `docker-compose.release.yml`
- Docker network: existing external `proxy`
- Database: `postgres` service, database `cemerlang`, application role
  `cemerlang_app`
- Secrets: `/opt/cemerlang-secrets/app.env` and `runtime.env`
- Mutable uploads: `/opt/cemerlang-toys/uploads`
- Health: container HTTP healthcheck against `/`
- Temporary origin: `https://cemerlangtoys.21kent.com` (configuration only;
  no DNS/Caddy activation is performed by this repository)
- Expected Google callback: `https://cemerlangtoys.21kent.com/api/auth/callback/google`

The production compose file is intentionally separate from `21KentWebsite`.
The image tag must be an immutable commit SHA; `latest` is not an accepted
release tag.

## Release sequence

1. Build and tag the image from the validated commit SHA.
2. Verify the image and compose configuration before starting it.
3. Create/verify the persistent upload directory and backup status.
4. Start the container on `proxy` without changing Caddy.
5. Wait for Docker health to become healthy.
6. Run internal route/database/image/auth smoke tests.
7. Only after owner approval, add the Caddy host and DNS record.

## Backup contract

The intended backup job must create a dedicated Cemerlang artifact containing
both the PostgreSQL logical dump and `/opt/cemerlang-toys/uploads`, write a
checksum manifest, and publish it into the existing Syncthing send-only backup
folder for the NAS peer. The active 21Kent full-backup path currently proves
encrypted Syncthing transport, not encrypted-at-rest artifacts; the separate
`age` contact-backup unit is not active on the audited VPS. The repository
script is therefore a template and is not activated by this project. A release
is not backup-ready until the owner-approved encryption/retention policy is
selected, a NAS copy is checksum-verified, and that copy is restored into an
isolated database and directory.

## Rollback

Keep the previous image tag and database/upload backup marker. Roll back by
starting the previous image tag with the same persistent upload directory and
database, then validate health and route smoke. Never roll back by deleting the
database or uploads.

OAuth is not considered verified until the real hostname callback has been
tested. `SITE_URL`, `AUTH_URL`, and canonical metadata must remain environment
configuration so a future dedicated domain does not require business-code edits.

The current upload code does not read a storage-path environment variable; it
writes to `public/uploads`. The VPS release bind-mount maps that path to
`/opt/cemerlang-toys/uploads`, keeping mutable data outside the image. Any
future path configurability should be a separate, tested change.
