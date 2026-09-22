import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { cn, formatRupiah } from "@/lib/utils";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { SearchInput } from "@/components/admin/ui/search-input";
import { DeleteButton } from "@/components/admin/ui/delete-button";
import {
  deleteProduct,
} from "./actions";

const PAGE_SIZE = 20;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProdukPage(
  props: PageProps<"/admin/produk">
) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const q = firstParam(searchParams.q)?.trim() ?? "";
  const page = Math.max(1, Number(firstParam(searchParams.page)) || 1);

  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { order: "asc" }, take: 1 },
      },
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
      <PageHeader title="Kelola Produk">
        <Link
          href="/admin/produk/baru"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 font-semibold text-[var(--text-on-brand)] shadow-sm transition-colors hover:bg-[var(--brand-hover)]"
        >
          <Plus size={18} />
          Tambah Produk
        </Link>
      </PageHeader>

      <SearchInput
        placeholder="Cari nama produk..."
        defaultValue={q}
        action="/admin/produk"
        className="max-w-sm"
      />

      <div className="mt-6 space-y-2">
        {products.length === 0 ? (
          <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--text-muted)]"
            style={{ borderRadius: "var(--radius-lg)" }}>
            Belum ada produk.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--bg)]">
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
                <p className="truncate font-semibold text-[var(--text-primary)]">
                  {product.name}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {product.category.name}
                  {product.price
                    ? ` · ${formatRupiah(product.discountPrice ?? product.price)}`
                    : ""}
                </p>
              </div>

              <StatusBadge
                variant={
                  product.stockStatus === "OUT_OF_STOCK" ? "danger" : "success"
                }
              >
                {product.stockStatus === "OUT_OF_STOCK"
                  ? "Stok Habis"
                  : "Tersedia"}
              </StatusBadge>

              <StatusBadge
                variant={product.published ? "success" : "muted"}
              >
                {product.published ? "Published" : "Draft"}
              </StatusBadge>

              <Link
                href={`/admin/produk/${product.id}`}
                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--brand-muted)] hover:text-[var(--brand)]"
                aria-label="Edit"
              >
                <Pencil size={18} />
              </Link>

              <DeleteButton
                itemLabel={`Produk "${product.name}"`}
                onDelete={async () => {
                  "use server";
                  await deleteProduct(product.id);
                }}
              />
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
                p === page
                  ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                  : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--brand-muted)]"
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
