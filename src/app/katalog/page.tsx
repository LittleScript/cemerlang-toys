import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { FilterBar } from "@/components/catalog/filter-bar";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 12;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function KatalogPage(props: PageProps<"/katalog">) {
  const searchParams = await props.searchParams;

  const kategori = firstParam(searchParams.kategori);
  const q = firstParam(searchParams.q)?.trim() ?? "";
  const usia = firstParam(searchParams.usia);
  const stok = firstParam(searchParams.stok);
  const sort = firstParam(searchParams.sort) ?? "terbaru";
  const page = Math.max(1, Number(firstParam(searchParams.page)) || 1);

  const where: Prisma.ProductWhereInput = {
    published: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { aliases: { some: { active: true, value: { contains: q, mode: "insensitive" as const } } } },
            { category: { name: { contains: q, mode: "insensitive" as const } } },
            { variants: { some: { sku: { contains: q, mode: "insensitive" as const } } } },
          ],
        }
      : {}),
    ...(kategori ? { category: { slug: kategori } } : {}),
    ...(usia ? { ageRange: usia } : {}),
    ...(stok ? { stockStatus: stok } : {}),
  };

  const [categories, products, total] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        stockStatus: true,
        category: { select: { name: true } },
        images: { orderBy: { order: "asc" }, take: 1, select: { url: true, alt: true } },
        variants: { select: { id: true } },
        packageLevels: {
          where: { isDefaultSellingUnit: true },
          select: { label: true, contentQuantity: true, contentUnit: true, minimumOrderQuantity: true },
          take: 1,
        },
      },
      orderBy:
        sort === "nama"
          ? { name: "asc" }
          : sort === "stok"
            ? { stockStatus: "asc" }
            : { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori) params.set("kategori", kategori);
    if (usia) params.set("usia", usia);
    if (stok) params.set("stok", stok);
    if (sort !== "terbaru") params.set("sort", sort);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/katalog${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <FadeIn className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ct-blue">Katalog Produk</h1>
        <p className="mt-2 text-foreground/70">
          Temukan produk grosir, susun Daftar Belanja, lalu kirim pertanyaan atau permintaan
          melalui WhatsApp.
        </p>
      </FadeIn>

      <form className="mb-6 flex gap-2" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nama produk atau nama umum..."
          aria-label="Cari produk"
          className="min-w-0 flex-1 rounded-lg border border-ct-teal/20 bg-white px-4 py-3 focus:border-ct-teal focus:outline-none"
        />
        {kategori ? <input type="hidden" name="kategori" value={kategori} /> : null}
        {usia ? <input type="hidden" name="usia" value={usia} /> : null}
        {stok ? <input type="hidden" name="stok" value={stok} /> : null}
        {sort !== "terbaru" ? <input type="hidden" name="sort" value={sort} /> : null}
        <button className="rounded-lg bg-ct-teal px-5 py-3 font-semibold text-white" type="submit">
          Cari
        </button>
      </form>

      <FadeIn delay={0.05} className="mb-8">
        <FilterBar
          categories={categories}
          activeCategory={kategori}
          activeAge={usia}
          activeStock={stok}
          activeQuery={q}
          activeSort={sort}
        />
      </FadeIn>

      <p className="mb-4 text-sm text-foreground/60">
        {total} {total === 1 ? "produk" : "produk"} ditemukan
      </p>

      {products.length === 0 ? (
        <p className="py-16 text-center text-foreground/60">
          Belum ada produk untuk filter ini.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product, index) => (
            <FadeIn key={product.id} delay={(index % PAGE_SIZE) * 0.03}>
              <ProductCard
                productId={product.id}
                slug={product.slug}
                name={product.name}
                categoryName={product.category.name}
                imageUrl={product.images[0]?.url}
                stockStatus={product.stockStatus}
                variantCount={product.variants.length}
                packageLevel={product.packageLevels[0]}
              />
            </FadeIn>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                p === page
                  ? "bg-ct-teal text-white"
                  : "bg-white text-foreground/70 hover:bg-ct-teal/10"
              )}
            >
              {p}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
