import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "../actions";

export default async function AdminProdukEditPage(props: PageProps<"/admin/produk/[id]">) {
  await requireAdmin();

  const { id } = await props.params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Edit Produk</h1>

      <div className="mt-6 rounded-2xl border border-ct-teal/10 bg-white p-4 sm:p-6">
        <ProductForm
          action={updateProduct.bind(null, id)}
          categories={categories}
          submitLabel="Simpan Perubahan"
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description ?? "",
            price: product.price?.toString() ?? "",
            discountPrice: product.discountPrice?.toString() ?? "",
            stockStatus: product.stockStatus,
            ageRange: product.ageRange ?? "",
            categoryId: product.categoryId,
            published: product.published,
            images: product.images.map((image) => ({ url: image.url, alt: image.alt ?? "" })),
            variants: product.variants.map((variant) => ({
              name: variant.name,
              sku: variant.sku ?? "",
              price: variant.price?.toString() ?? "",
              stock: variant.stock.toString(),
              image: variant.image ?? "",
            })),
          }}
        />
      </div>
    </div>
  );
}
