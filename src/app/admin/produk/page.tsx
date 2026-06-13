import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { cn, formatRupiah } from "@/lib/utils";
import { deleteProduct, toggleProductPublished } from "./actions";

const PAGE_SIZE = 20;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProdukPage(props: PageProps<"/admin/produk">) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const q = firstParam(searchParams.q)?.trim() ?? "";
  const page = Math.max(1, Number(firstParam(searchParams.page)) || 1);

  const where = q ? { name: { contains: q } } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/produk${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-ct-blue">Kelola Produk</h1>
        <Link
          href="/admin/produk/baru"
          className="inline-flex items-center gap-2 rounded-full bg-ct-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark"
        >
          <Plus size={18} />
          Tambah Produk
        </Link>
      </div>

      <form action="/admin/produk" className="mt-4">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cari nama produk..."
          className="w-full max-w-sm rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </form>

      <div className="mt-6 space-y-2">
        {products.length === 0 ? (
          <p className="rounded-2xl border border-ct-teal/10 bg-white p-6 text-center text-foreground/60">
            Belum ada produk.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-xl border border-ct-teal/10 bg-white px-4 py-3"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ct-cream">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ct-blue">{product.name}</p>
                <p className="text-sm text-foreground/60">
                  {product.category.name}
                  {product.price ? ` · ${formatRupiah(product.discountPrice ?? product.price)}` : ""}
                </p>
              </div>

              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold text-white",
                  product.stockStatus === "OUT_OF_STOCK" ? "bg-ct-red" : "bg-ct-green"
                )}
              >
                {product.stockStatus === "OUT_OF_STOCK" ? "Stok Habis" : "Tersedia"}
              </span>

              <form
                action={async () => {
                  "use server";
                  await toggleProductPublished(product.id, !product.published);
                }}
              >
                <button
                  type="submit"
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    product.published
                      ? "bg-ct-teal/10 text-ct-teal-dark"
                      : "bg-foreground/10 text-foreground/50"
                  )}
                >
                  {product.published ? "Published" : "Draft"}
                </button>
              </form>

              <Link
                href={`/admin/produk/${product.id}`}
                className="rounded-full p-2 text-foreground/50 hover:bg-ct-teal/10 hover:text-ct-teal-dark"
                aria-label="Edit"
              >
                <Pencil size={18} />
              </Link>

              <form
                action={async () => {
                  "use server";
                  await deleteProduct(product.id);
                }}
              >
                <button
                  type="submit"
                  className="rounded-full p-2 text-foreground/50 hover:bg-ct-red/10 hover:text-ct-red"
                  aria-label="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                p === page ? "bg-ct-teal text-white" : "bg-white text-foreground/70 hover:bg-ct-teal/10"
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
