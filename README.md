# Cemerlang Toys Medan

Supplier mainan anak terpercaya sejak 2002 — grosir, harga bersahabat untuk reseller & toko mainan di seluruh Indonesia.

**Website:** [cemerlang-toys.vercel.app](https://cemerlang-toys.vercel.app)
**Stack:** Next.js 16 + React 19 + Prisma 7 + PostgreSQL (Neon / Docker self-host)
**Auth:** NextAuth v5 (Google OAuth, database sessions)
**Styling:** Tailwind CSS v4 + Framer Motion

---

## Quick Start

```bash
npm install
cp env.example.template .env.local   # isi AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, DATABASE_URL
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev                   # http://localhost:3000
```

## Docker Self-Host

```bash
docker compose up -d
# App: http://localhost:3001
# DB:  gunakan DATABASE_URL dari environment lokal; jangan tulis credential di repo
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type-checking |
| `npm test` | Run Vitest test suite |

## Project Structure

```
src/
├── app/           # Next.js App Router pages & API routes
│   ├── admin/     # Admin panel (produk, kategori, konten, galeri, member, whitelist)
│   ├── api/       # Route handlers (upload, auth, ai-suggest, categories)
│   ├── katalog/   # Product catalog with filtering
│   ├── keranjang/ # Cart page
│   ├── produk/    # Product detail pages
│   └── tentang/   # About page
├── components/    # React components (layout, product, admin, catalog, ui)
├── lib/           # Business logic & utilities
│   ├── cart-context.tsx   # Cart state (localStorage-persisted)
│   ├── whatsapp.ts        # WhatsApp order message builder
│   ├── phone.ts           # Phone number normalization
│   ├── admin.ts           # Admin guard (requireAdmin, requireAdminApi)
│   ├── utils.ts           # cn, formatRupiah, slugify
│   └── constants.ts       # Store config
├── types/         # TypeScript type augmentations (next-auth)
└── generated/     # Generated Prisma client
prisma/
├── schema.prisma  # Database schema (User, Product, Category, etc.)
└── seed.ts        # Seed data (12 categories, 24 products)
```

## Architecture Decisions

- **Ordering via WhatsApp** — no payment gateway; order links open WhatsApp chat with pre-filled message
- **Member-only pricing** — prices gated behind approved member status; non-members can still order (prices confirmed by CT Rangers)
- **Editable content** — homepage hero, about page, and footer content editable via admin panel
- **Dual deployment** — Vercel (production) + Docker Compose (local self-host)

## License

Private — © Cemerlang Toys Medan
