import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategory } from "../actions";

export default async function AdminKategoriEditPage(props: PageProps<"/admin/kategori/[id]">) {
  await requireAdmin();

  const { id } = await props.params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Edit Kategori</h1>

      <div className="mt-6 rounded-2xl border border-ct-teal/10 bg-white p-4">
        <CategoryForm
          action={updateCategory.bind(null, id)}
          defaultValues={{
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            order: category.order,
          }}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}
