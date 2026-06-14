import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryForm } from "@/components/admin/category-form";
import { SubmitButton } from "@/components/ui/submit-button";
import { createCategory, deleteCategory } from "./actions";

export default async function AdminKategoriPage(props: PageProps<"/admin/kategori">) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const error = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Kelola Kategori</h1>

      {error === "kategori-dipakai" ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          Kategori tidak bisa dihapus karena masih dipakai oleh produk.
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-foreground">Tambah Kategori</h2>
        <div className="mt-3">
          <CategoryForm action={createCategory} submitLabel="Tambah Kategori" />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-ct-teal/10 bg-white px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ct-teal/10 text-ct-teal-dark">
                <CategoryIcon name={category.icon} size={20} />
              </span>
              <div>
                <p className="font-semibold text-ct-blue">{category.name}</p>
                <p className="text-sm text-foreground/60">
                  /{category.slug} &middot; {category._count.products} produk &middot; urutan {category.order}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/kategori/${category.id}`}
                className="rounded-full p-2 text-foreground/50 hover:bg-ct-teal/10 hover:text-ct-teal-dark"
                aria-label="Edit"
              >
                <Pencil size={18} />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteCategory(category.id);
                }}
              >
                <SubmitButton
                  className="rounded-full p-2 text-foreground/50 hover:bg-ct-red/10 hover:text-ct-red"
                  aria-label="Hapus"
                >
                  <Trash2 size={18} />
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
