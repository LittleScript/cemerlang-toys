#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${CEMERLANG_ENV_FILE:-/opt/cemerlang-secrets/backup.env}"
test -r "$ENV_FILE" || { echo "Cemerlang backup env file is not readable" >&2; exit 1; }
command -v age >/dev/null || { echo "age is required" >&2; exit 1; }
command -v sha256sum >/dev/null || { echo "sha256sum is required" >&2; exit 1; }

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

: "${CEMERLANG_BACKUP_DIR:?CEMERLANG_BACKUP_DIR is required}"
: "${CEMERLANG_AGE_RECIPIENT:?CEMERLANG_AGE_RECIPIENT is required}"
: "${CEMERLANG_UPLOAD_DIR:?CEMERLANG_UPLOAD_DIR is required}"
: "${CEMERLANG_RETENTION_DAYS:=90}"

case "$CEMERLANG_BACKUP_DIR" in
  /opt/cemerlang-toys|/opt/cemerlang-toys/*|/var/lib/docker|/var/lib/docker/*)
    echo "backup destination must be off-host storage" >&2
    exit 1
    ;;
esac

test -d "$CEMERLANG_UPLOAD_DIR" || { echo "upload directory is missing" >&2; exit 1; }
mkdir -p "$CEMERLANG_BACKUP_DIR"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
work_dir="$(mktemp -d "$CEMERLANG_BACKUP_DIR/.cemerlang-${timestamp}.XXXXXX")"
trap 'rm -rf "$work_dir"' EXIT

docker exec postgres pg_dump --format=custom --no-owner --no-acl cemerlang \
  | age --encrypt --recipient "$CEMERLANG_AGE_RECIPIENT" --output "$work_dir/database.dump.age"
tar -C "$CEMERLANG_UPLOAD_DIR" -czf "$work_dir/uploads.tar.gz" .
sha256sum "$work_dir/database.dump.age" "$work_dir/uploads.tar.gz" > "$work_dir/SHA256SUMS"

final_dir="$CEMERLANG_BACKUP_DIR/cemerlang-${timestamp}"
mv "$work_dir" "$final_dir"
find "$CEMERLANG_BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -name 'cemerlang-*' -mtime "+$CEMERLANG_RETENTION_DAYS" -exec rm -rf -- {} +
echo "encrypted Cemerlang backup created"
