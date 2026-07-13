import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryForm } from "@/components/admin/category-form";
import { PageHeader } from "@/components/admin/ui/page-header";
import { DeleteButton } from "@/components/admin/ui/delete-button";
import { createCategory, deleteCategory } from "./actions";

export default async function AdminKategoriPage(
  props: PageProps<"/admin/kategori">
) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const error = Array.isArray(searchParams.error)
    ? searchParams.error[0]
    : searchParams.error;

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <PageHeader title="Kelola Kategori" />

      {error === "kategori-dipakai" ? (
        <p className="mt-4 rounded-lg bg-[var(--danger-muted)] px-4 py-2 text-sm font-medium text-[var(--danger)]">
          Kategori tidak bisa dihapus karena masih dipakai oleh produk.
        </p>
      ) : null}

      <div
        className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <h2 className="font-heading font-semibold text-[var(--text-primary)]">
          Tambah Kategori
        </h2>
        <div className="mt-3">
          <CategoryForm
            action={createCategory}
            submitLabel="Tambah Kategori"
          />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-muted)] text-[var(--brand)]">
                <CategoryIcon name={category.icon} size={20} />
              </span>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">
                  {category.name}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  /{category.slug} &middot; {category._count.products} produk
                  &middot; urutan {category.order}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/kategori/${category.id}`}
                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--brand-muted)] hover:text-[var(--brand)]"
                aria-label="Edit"
              >
                <Pencil size={18} />
              </Link>
              <DeleteButton
                itemLabel={`Kategori "${category.name}"`}
                onDelete={async () => {
                  "use server";
                  await deleteCategory(category.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
