#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${CEMERLANG_ENV_FILE:-/opt/cemerlang-secrets/migrator.env}"
OUTBOX="${CEMERLANG_BACKUP_OUTBOX:-/home/ubuntu/.hermes/backups/syncthing-outbox}"
UPLOAD_DIR="${CEMERLANG_UPLOAD_DIR:-/opt/cemerlang-toys/uploads}"
DATABASE_NAME="${CEMERLANG_DATABASE_NAME:-cemerlang}"
RELEASE_SHA="${CEMERLANG_RELEASE_SHA:-unknown}"

test -r "$ENV_FILE" || { echo "Cemerlang backup env is not readable" >&2; exit 1; }
test -d "$UPLOAD_DIR" || { echo "Cemerlang upload directory is missing" >&2; exit 1; }
command -v docker >/dev/null || { echo "docker is required" >&2; exit 1; }
command -v sha256sum >/dev/null || { echo "sha256sum is required" >&2; exit 1; }
command -v tar >/dev/null || { echo "tar is required" >&2; exit 1; }

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a
: "${DATABASE_URL:?DATABASE_URL is required}"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
work="$(mktemp -d "/tmp/cemerlang-backup-${timestamp}.XXXXXX")"
artifact="$work/cemerlang-toys/$timestamp"
final_parent="$OUTBOX/cemerlang-toys"
final="$final_parent/$timestamp"
trap 'rm -rf "$work"' EXIT

mkdir -p "$artifact"
pg_url="$(printf '%s' "$DATABASE_URL" | sed 's/@postgres:/@127.0.0.1:/')"
docker exec postgres pg_dump "$pg_url" --format=custom --no-owner --no-acl > "$artifact/database.dump"
tar -C "$UPLOAD_DIR" -czf "$artifact/uploads.tar.gz" .
printf 'release_sha=%s\ncreated_at=%s\ndatabase=%s\nuploads=%s\n' \
  "$RELEASE_SHA" "$timestamp" "$DATABASE_NAME" "$UPLOAD_DIR" > "$artifact/metadata.txt"
( cd "$artifact" && sha256sum database.dump uploads.tar.gz metadata.txt > SHA256SUMS )

mkdir -p "$final_parent"
chown -R 1001:1001 "$work/cemerlang-toys"
chmod 0750 "$work/cemerlang-toys" "$artifact"
chmod 0640 "$artifact"/*
mv "$artifact" "$final"
echo "CEMERLANG_BACKUP_OK $timestamp"
