# PostgreSQL administrative credential rotation

Status: DEFERRED MAINTENANCE ACTION. The active shared PostgreSQL container
still has an administrative credential referenced by its active compose file.
The Cemerlang application does not use that credential: it uses the dedicated
`cemerlang_app` role, while controlled schema work uses `cemerlang_migrator`.

## Why this is deferred

The root credential belongs to shared infrastructure, not only Cemerlang. A
rotation must update the active compose source and every recovery/maintenance
consumer atomically. The active service is healthy and the current audit did
not find a runtime application using root, but an incomplete rotation could
break container recreation or emergency recovery.

## Safe maintenance procedure

1. Freeze changes and record the current PostgreSQL container/image/volume
   identifiers. Inventory compose files, environment files, scheduled jobs,
   backup scripts, health checks, and manual maintenance tooling.
2. Create and independently validate logical backups for every active database,
   including Cemerlang and 21Kent services. Confirm an isolated restore path.
3. Change the administrative password inside PostgreSQL using an interactive
   protected session; never put it in shell history, Git, or documentation.
4. Update the single active compose secret source and any verified recovery
   copy with restrictive permissions. Do not recreate the container until the
   new secret is present and readable by the intended operator.
5. Recreate only the PostgreSQL container against the existing persistent
   volume; do not remove the volume. Verify every database, role, application
   connection, backup job, and health check.
6. Retain a sealed recovery record according to the VPS secret-management
   policy, then remove unnecessary plaintext copies after recovery is proven.
7. If any consumer cannot be inventoried or verified, stop and roll back the
   compose-secret change without changing application databases.

The rotation remains a cutover-independent maintenance action, but it should
be scheduled separately because it affects shared infrastructure.
