# Prisma migration policy

The first migration is `00000000000000_baseline`. It was generated with:

```text
npx prisma migrate diff --from-empty --to-schema=prisma/schema.prisma --script
```

It was applied to an isolated empty PostgreSQL 18 database successfully. A
read-only `prisma migrate diff` against the audited Neon database returned
`No difference detected`.

Do not run `prisma db push` against a shared or production database. Future
schema changes must be reviewed migrations, validated against an empty test
database and a restored backup, then applied through the dedicated migration
role during an approved release window.

The baseline describes the Cemerlang `public` schema. Neon-managed
`neon_auth` tables are not part of the current Prisma application schema and
were preserved in the source backup, but were not restored to the PostgreSQL 16
VPS target.
