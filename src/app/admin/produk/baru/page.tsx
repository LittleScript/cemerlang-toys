import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "../actions";

export default async function AdminProdukBaruPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Tambah Produk</h1>

      <div className="mt-6 rounded-2xl border border-ct-teal/10 bg-white p-4 sm:p-6">
        <ProductForm action={createProduct} categories={categories} submitLabel="Tambah Produk" />
      </div>
    </div>
  );
}
