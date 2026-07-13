# Scout: React Component Library

> Audit of all React components under `src/components/` — 26 files across 7 subdirectories plus 4 standalone files.

## TL;DR

The component tree is 8 server components and 18 client components, all using `cn()` from `@/lib/utils` (clsx + twMerge) with a shared palette of semantic Tailwind tokens (`ct-teal`, `ct-orange`, `ct-blue`, `ct-cream`, `ct-red`, `ct-green`). Form conventions are split: admin forms use `useActionState` + `SubmitButton` (or manual pending wiring), while interactive consumer components use `useState` for local micro-interactions. No shared form field primitives exist. Animation is Framer Motion (one reusable `FadeIn` wrapper) plus Lenis smooth scroll and CSS transitions on hover/expand states.

---

## Component Catalog

### Server Components (8)

| Component | Path | Props | Sub-components | Notes |
|---|---|---|---|---|
| `Header` | `layout/header.tsx` | none (async) | `CartLink`, `AuthStatus`, `MobileNav` | Composition root for the nav bar; sticky with backdrop blur |
| `Footer` | `layout/footer.tsx` | none (async) | none | Only layout component that queries DB directly (cached Prisma `siteContent`) |
| `ProductCard` | `product-card.tsx` | `productId, slug, name, categoryName, imageUrl?, price?, discountPrice?, unit?, stockStatus` | `ProductCardQuickAdd` | Server card wrapping a client quick-add child |
| `CategoryCard` | `category-card.tsx` | `name, slug, icon?` | `CategoryIcon` | Link card for catalog landing page |
| `CategoryIcon` | `category-icon.tsx` | `name?, ...LucideProps` | none | Lucide icon map (20 icons); fallback to `Boxes` |
| `FilterBar` | `catalog/filter-bar.tsx` | `categories, activeCategory?, activeAge?, activeStock?` | `CategoryIcon` | Server-driven filtering via `<form method="get">` with `<select>` elements |
| `ProductAccessCta` | `product/product-access-cta.tsx` | `loggedIn` | none | Membership gate CTA card |
| `GoogleIcon` | `icons/google-icon.tsx` | `className?` | none | Inline SVG for Google auth button |

### Client Components (18)

| Component | Path | Props | Key hooks | Notes |
|---|---|---|---|---|
| `AuthStatus` | `layout/auth-status.tsx` | `variant?` | `useSession`, `signOut`, `useState` | Full auth state machine (loading skeleton → login CTA → user info + admin link + status badge + logout) |
| `CartLink` | `layout/cart-link.tsx` | `className?` | `useCart` | Badge with `99+` cap on `totalItems` |
| `MobileNav` | `layout/mobile-nav.tsx` | `authSlot` | `useState` | Slide-down drawer via `max-height` CSS transition |
| `ProductCardQuickAdd` | `product-card-quick-add.tsx` | `productId, slug, name, imageUrl?, price?, unit?` | `useCart`, `useState` | Quantity stepper + add-to-cart with 1200ms "Ditambahkan" feedback |
| `ProductGallery` | `product/product-gallery.tsx` | `images, alt` | `useState` | Thumbnail strip carousel |
| `ProductOrderPanel` | `product/product-order-panel.tsx` | `productId, slug, productName, imageUrl?, basePrice, discountPrice?, unit?, variants, outOfStock, isMember` | `useCart`, `useState` | Full order panel: variant selector, quantity, add-to-cart with 1500ms feedback; price hidden for non-members |
| `AdminNav` | `admin/admin-nav.tsx` | none | `usePathname` | 8-item sidebar nav with active detection via pathname prefixes |
| `SubmitButton` | `ui/submit-button.tsx` | `pendingLabel?, ...ButtonHTMLAttributes` | `useFormStatus` | `useFormStatus` wrapper; shows `Loader2` spinner or custom `pendingLabel` |
| `FadeIn` | `motion/fade-in.tsx` | `children, delay?, className?` | none (Framer Motion) | `motion.div` with `whileInView` fade-up |
| `SmoothScroll` | `providers/smooth-scroll.tsx` | none | `useEffect` | Lenis `requestAnimationFrame` loop; renders `null` |
| `SessionProvider` | `providers/session-provider.tsx` | `children` | none | NextAuth `SessionProvider` passthrough |
| `WhitelistForm` | `admin/whitelist-form.tsx` | none | `useActionState` | Inline form; uses `pending` from `useActionState` directly (no `SubmitButton`) |
| `CategoryForm` | `admin/category-form.tsx` | `action, defaultValues?, submitLabel` | `useActionState` | Reusable create/edit form; hardcoded `ICON_OPTIONS` subset |
| `GalleryForm` | `admin/gallery-form.tsx` | none | `useActionState`, `useState` | File upload via `/api/upload`; consumes `SubmitButton` |
| `SiteContentForm` | `admin/site-content-form.tsx` | `defaultValues` | `useActionState` | Multi-section form (Hero, CTA, Footer); consumes `SubmitButton`; green success banner |
| `AboutContentForm` | `admin/about-content-form.tsx` | `defaultValues` | `useActionState` | Largest form: 8 sections (Hero, Cerita, VisiMisi, ValueProps, Stats, Keunggulan, CaraOrder, FAQ, Contact); consumes `SubmitButton`; green success banner |
| `ProductForm` | `admin/product-form.tsx` | `action, categories, submitLabel, defaultValues?` | `useActionState`, `useState`, `useRef`, `useEffect` | Most complex form: AI suggest, file upload with drag-drop, dynamic images/variants arrays; manually wires `pending` |
| `RegistrationForm` | `daftar/registration-form.tsx` | `name?, email?, image?` | `useActionState` | Multi-field registration; manually wires `pending`; defines `initialState` locally |

---

## Reusable Patterns

### 1. `cn()` Utility

Every component imports `cn` from `@/lib/utils` (clsx + twMerge). Conditional classes are built inline with `cn()` rather than template literals. This is the single universal pattern — no component deviates.

### 2. Color Token Palette

Semantic custom colors used throughout, never hardcoded hex values:

- `ct-teal` / `ct-teal-dark` — primary brand, buttons, active states
- `ct-orange` / `ct-orange-dark` — accents, badge background, secondary CTAs
- `ct-blue` — informational, heading text, admin section titles
- `ct-cream` — page background, product image backdrops
- `ct-red` — error states, "Stok Habis" badge
- `ct-green` — success states, "Tersedia" badge, added-to-cart feedback

### 3. Card Wrapper Convention

Repeating card wrapper used across layout pages, category cards, product cards, and admin form sections:

```
rounded-2xl border border-ct-teal/10 bg-white shadow-sm
```

With hover lift on interactive cards: `hover:-translate-y-1 hover:shadow-md`.

### 4. Form Patterns

**useActionState convention**: All admin forms and the registration form use React 19's `useActionState`. Each defines `initialState` as `{}` (typed from the action file), destructures `[state, formAction, pending]`, and passes `formAction` as the `<form action>` prop.

**SubmitButton vs manual pending**: Three approaches coexist:
- `SubmitButton` component (with `pendingLabel="Menyimpan..."`): `gallery-form.tsx`, `site-content-form.tsx`, `about-content-form.tsx`
- Manual `pending` wiring (no `SubmitButton`): `category-form.tsx`, `product-form.tsx`, `registration-form.tsx`, `whitelist-form.tsx`

The manual pattern:
```tsx
<button type="submit" disabled={pending}
  className="...disabled:opacity-60">
  {pending ? "Menyimpan..." : submitLabel}
</button>
```

### 5. Error Display

Identical across all admin forms:
```tsx
<p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
  {state.error}
</p>
```

`GalleryForm` also shows `uploadError` with identical styling. `ProductForm` uses `text-ct-red` for inline errors (AI, upload, category creation).

### 6. Success Display

`SiteContentForm` and `AboutContentForm` add:
```tsx
<p className="rounded-lg bg-ct-green/10 px-4 py-2 text-sm font-medium text-ct-green">
  Tersimpan.
</p>
```

### 7. Loading States

- **Spinner**: `Loader2` from lucide-react with `animate-spin` — universal. Used in `SubmitButton`, `AuthStatus` (sign-out), `ProductForm` (AI loading, image upload), `GalleryForm` (upload).
- **Skeleton pulse**: `AuthStatus` uses `animate-pulse rounded-full bg-ct-teal/10` placeholder during `useSession` loading.
- **Disabled styling**: `opacity-60` on submit buttons during pending, `cursor-wait` or `cursor-not-allowed` where appropriate.

### 8. Button Conventions

- **Primary**: `rounded-full bg-ct-teal text-white hover:bg-ct-teal-dark` — universal for submit CTAs
- **Secondary outline**: `rounded-full border border-ct-teal/20 hover:border-ct-teal` — used by `MobileNav` login link (via `AuthStatus` variant)
- **Tag/badge**: `rounded-full bg-ct-teal/10 text-ct-teal` — admin panel link, category icon circles
- **Disabled**: `disabled:opacity-60` on all form submits; `cursor-not-allowed bg-foreground/30` on out-of-stock product CTA

### 9. Form Input Convention

Every label-input pair across all 12 forms:
```tsx
<label htmlFor="fieldName" className="mb-1 block text-sm font-medium text-foreground/80">
  Label Text
</label>
<input
  id="fieldName"
  name="fieldName"
  type="text"
  className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
/>
```

Identical structure, identical classes. No `<FormField>` abstraction exists — every instance is hand-written.

### 10. Micro-interaction Feedback (Checkmark)

Two components flash a green checkmark after adding to cart:
- `ProductCardQuickAdd`: 1200ms timeout, shows "Ditambahkan"
- `ProductOrderPanel`: 1500ms timeout, shows "Ditambahkan ke Keranjang"

Both toggle button color to `bg-ct-green` and swap icon from `ShoppingCart` to `Check`.

---

## Component Hierarchy

```
Root Layout
├── SessionProvider (NextAuth passthrough)
├── SmoothScroll (Lenis rAF loop, renders null)
├── Header (server, async)
│   ├── CartLink (client, useCart)
│   ├── AuthStatus (client, useSession + signOut)
│   └── MobileNav (client, authSlot = <AuthStatus variant="mobile" />)
├── [page content]
│   ├── FilterBar (server, uses CategoryIcon)
│   ├── CategoryCard (server, uses CategoryIcon)
│   ├── ProductCard (server)
│   │   └── ProductCardQuickAdd (client, useCart)
│   ├── ProductGallery (client, standalone)
│   ├── ProductOrderPanel (client, standalone, useCart)
│   └── ProductAccessCta (server, standalone)
├── Admin Layout
│   ├── AdminNav (client, usePathname)
│   └── [admin forms] (client, useActionState)
│       ├── ProductForm (most complex — AI, upload, dynamic arrays)
│       ├── CategoryForm (reusable create/edit)
│       ├── SiteContentForm → SubmitButton
│       ├── AboutContentForm → SubmitButton
│       ├── GalleryForm → SubmitButton
│       └── WhitelistForm
├── RegistrationForm (client, useActionState)
└── Footer (server, async — cached Prisma query)
```

### Provider Tree

Both providers are client-only and render at layout level:

1. `SessionProvider` — wraps NextAuth's `SessionProvider` from `next-auth/react`. Pure passthrough, no logic.
2. `SmoothScroll` — mounts Lenis in a `useEffect`, runs `requestAnimationFrame` calling `lenis.raf(time)`, destroys on unmount. Renders `null`.

---

## Animation Approach

### Framer Motion

Single reusable wrapper: `FadeIn` (`motion/fade-in.tsx:6`).

```tsx
<motion.div
  initial={{ y: 24 }}
  whileInView={{ y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.6, delay, ease: "easeOut" }}
/>
```

Used by wrapping page-level content blocks (in page files, not imported by any component). One-shot in-view fade-up — no staggered children, no exit animations, no variants.

### Lenis Smooth Scroll

`SmoothScroll` provider (`providers/smooth-scroll.tsx:6`) runs a persistent `requestAnimationFrame` loop feeding `lenis.raf(time)`. Pure side effect — the component renders `null`. Cleanup on unmount calls `cancelAnimationFrame` and `lenis.destroy()`.

### CSS Transitions

No custom Tailwind `@keyframes` animations found. All motion is via utility classes:

- `transition-colors` — hover states on links, buttons, nav items
- `transition-[max-height] duration-300` — mobile nav drawer open/close
- `transition-transform duration-300 group-hover:scale-105` — product card image zoom on hover
- `transition-all` — category/product card hover lift (`hover:-translate-y-1 hover:shadow-md`)

---

## Import / Dependency Table

| Component | Imports from `@/` | External libraries |
|---|---|---|
| `Header` | `lib/constants` (NAV_LINKS, SITE_NAME) | next/image, next/link |
| `Footer` | `lib/prisma`, `lib/constants`, `lib/site-content` | next/image, next/link, lucide-react, react (cache) |
| `MobileNav` | `lib/constants`, `lib/utils` | next/link, lucide-react, react |
| `AuthStatus` | `lib/utils` | next/image, next/link, next-auth/react, lucide-react, react |
| `CartLink` | `lib/cart-context`, `lib/utils` | next/link, lucide-react |
| `ProductCard` | none (relative import: `product-card-quick-add`) | next/image, next/link |
| `ProductCardQuickAdd` | `lib/cart-context`, `lib/utils` | lucide-react, react |
| `CategoryCard` | `components/category-icon` | next/link |
| `CategoryIcon` | none | lucide-react |
| `FilterBar` | `components/category-icon`, `lib/utils` | next/link |
| `ProductGallery` | `lib/utils` | next/image, react |
| `ProductOrderPanel` | `lib/cart-context`, `lib/utils` | next/link, lucide-react, react |
| `ProductAccessCta` | none | next/link, lucide-react |
| `SubmitButton` | `lib/utils` | react-dom, lucide-react, react |
| `FadeIn` | none | framer-motion, react |
| `SmoothScroll` | none | lenis, react |
| `SessionProvider` | none | next-auth/react, react |
| `AdminNav` | `lib/utils` | next/link, next/navigation, lucide-react |
| `ProductForm` | `app/admin/produk/actions`, `lib/constants` | lucide-react, react |
| `CategoryForm` | `app/admin/kategori/actions`, `components/category-icon` | react |
| `WhitelistForm` | `app/admin/whitelist/actions` | react |
| `SiteContentForm` | `components/ui/submit-button`, `app/admin/konten/actions`, `lib/site-content` | react |
| `AboutContentForm` | `components/ui/submit-button`, `app/admin/tentang/actions`, `lib/about-content` | react |
| `GalleryForm` | `components/ui/submit-button`, `app/admin/galeri/actions` | next/image, lucide-react, react |
| `RegistrationForm` | `app/daftar/actions` | next/image, lucide-react, react |
| `GoogleIcon` | none | none (inline SVG) |

---

## Gaps & Inconsistencies

1. **SubmitButton adoption is inconsistent.** `WhitelistForm`, `CategoryForm`, `ProductForm`, and `RegistrationForm` all manually wire `pending` on their submit buttons instead of using the shared `SubmitButton` primitive. `WhitelistForm` could be a one-line swap; the others have slightly varied button styling that would need reconciling.

2. **No shared form field primitives.** Every label+input pair across all 12 forms is hand-written with identical markup and classes. A `<FormField>` component that renders a label, input, and optional error could remove ~80 lines of duplicated JSX.

3. **`ProductForm` is the outlier in complexity.** 581 lines — nearly 5x the size of the next largest component (`AboutContentForm` at 423 lines). It manages 7 independent state slices (`images`, `variants`, `uploadingIndex`, `uploadError`, `aiLoading`, `aiError`, `newCategory*`), plus imperative refs to 5 DOM inputs. This is the most likely source of bugs as features are added to the product admin.

4. **`CategoryIcon` vs `CategoryForm` icon lists will drift apart.** `category-icon.tsx:25-46` defines 20 icons via `ICONS` object and exports `CATEGORY_ICON_NAMES` (all 20). But `category-form.tsx:7-20` maintains its own hardcoded `ICON_OPTIONS` array with only 12 of those 20. When a new icon is added to `ICONS`, the admin form dropdown won't include it unless the form's array is manually updated.

5. **`RegistrationForm` defines `initialState` locally** (`daftar/registration-form.tsx:14`) while admin forms import it from their action files. If the `RegistrationState` type gains new fields, the component's `initialState = {}` won't fail — it just silently produces an incomplete state.

6. **Error styling inconsistency in `ProductForm`.** Most forms use `bg-red-50` + `text-red-600` for errors. `ProductForm` uses `text-ct-red` without background for inline errors (AI suggestion, upload, category creation). The spacing is also inconsistent: some errors get rounded containers, others don't.

7. **`Footer` is the only layout component that fetches data.** It queries `prisma.siteContent` directly with React's `cache()`. No other layout component touches the database — they receive data via props or URL params. This is intentional (the footer needs runtime-editable content), but means `Footer` can't be purely static-rendered.

8. **No barrel exports.** There is no `index.ts` in any component directory. Every import uses the full relative path. This is a deliberate choice for a small project and not flagged as debt.

9. **`product-card.tsx` uses `eslint-disable` for `<img>`** on the drag-drop preview in `ProductForm` (`admin/product-form.tsx:422`). This is correct — the image is a client-side preview URL, not a static asset — but the eslint-disable is a fragile marker that could mask real issues if copied elsewhere.

---

## Verification Checklist

- [x] Scout report exists at `docs/agents/scout-components.md`
- [x] Report catalogs all 26 components with server/client split, props, sub-components used
- [x] Report documents 10 reusable patterns (cn() usage, color tokens, card wrappers, form conventions, error display, success display, loading states, button conventions, input convention, micro-interactions)
- [x] Report includes component hierarchy diagram (text tree)
- [x] Report documents animation approach (Framer Motion, Lenis, CSS transitions)
- [x] Report notes 9 gaps and inconsistencies
- [x] Report includes dependency/import table

---
*Last updated: foun during component library scout.*
