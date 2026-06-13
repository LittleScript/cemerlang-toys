import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductOrderPanel } from "@/components/product/product-order-panel";
import { ProductAccessCta } from "@/components/product/product-access-cta";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

export default async function ProductPage(props: PageProps<"/produk/[slug]">) {
  const { slug } = await props.params;
  const session = await auth();
  const isMember = session?.user?.status === "APPROVED";

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
  });

  if (!product || !product.published) {
    notFound();
  }

  const outOfStock = product.stockStatus === "OUT_OF_STOCK";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <FadeIn>
          <ProductGallery images={product.images} alt={product.name} />
        </FadeIn>

        <FadeIn delay={0.1} className="space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-ct-teal-dark">
              {product.category.name}
            </span>
            <h1 className="mt-1 font-heading text-3xl font-bold text-ct-blue">
              {product.name}
            </h1>
            {product.ageRange ? (
              <p className="mt-1 text-sm text-foreground/60">Usia: {product.ageRange} tahun</p>
            ) : null}
            <span
              className={cn(
                "mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white",
                outOfStock ? "bg-ct-red" : "bg-ct-green"
              )}
            >
              {outOfStock ? "Stok Habis" : "Tersedia"}
            </span>
          </div>

          {isMember ? (
            <ProductOrderPanel
              productName={product.name}
              basePrice={product.price ?? 0}
              discountPrice={product.discountPrice}
              variants={product.variants}
              outOfStock={outOfStock}
              customerName={session?.user?.name ?? "(Nama Anda)"}
            />
          ) : (
            <ProductAccessCta loggedIn={!!session} />
          )}

          {isMember && product.description ? (
            <div>
              <h2 className="font-heading font-semibold text-foreground">Deskripsi</h2>
              <p className="mt-1 whitespace-pre-line text-foreground/70">
                {product.description}
              </p>
            </div>
          ) : null}
        </FadeIn>
      </div>
    </div>
  );
}
