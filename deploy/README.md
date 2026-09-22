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

## Rollback

Keep the previous image tag and database/upload backup marker. Roll back by
starting the previous image tag with the same persistent upload directory and
database, then validate health and route smoke. Never roll back by deleting the
database or uploads.

OAuth is not considered verified until the real hostname callback has been
tested. `SITE_URL`, `AUTH_URL`, and canonical metadata must remain environment
configuration so a future dedicated domain does not require business-code edits.
