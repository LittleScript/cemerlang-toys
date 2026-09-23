import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductOrderPanel } from "@/components/product/product-order-panel";
import { ProductAccessCta } from "@/components/product/product-access-cta";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import { resolveMemberPrice } from "@/lib/pricing";

export async function generateMetadata(
  props: PageProps<"/produk/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      images: { orderBy: { order: "asc" }, take: 1, select: { url: true, alt: true } },
    },
  });

  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: `${product.name} — ${SITE_NAME}`,
    description:
      product.description?.slice(0, 160) ?? `${product.name} — Supplier mainan anak terpercaya.`,
    openGraph: {
      title: `${product.name} — ${SITE_NAME}`,
      description: product.description?.slice(0, 160) ?? "",
      images: product.images[0]?.url ? [{ url: product.images[0].url, alt: product.images[0].alt ?? product.name }] : [],
    },
  };
}

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
      packageLevels: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || !product.published) {
    notFound();
  }

  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const memberPrice = session?.user?.id
    ? await resolveMemberPrice({ userId: session.user.id, productId: product.id })
    : null;

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

          <ProductOrderPanel
            productId={product.id}
            slug={product.slug}
            productName={product.name}
            imageUrl={product.images[0]?.url}
            legacyUnit={product.unit}
            memberPrice={memberPrice?.amount ?? null}
            priceBasis={
              memberPrice?.packageLevelId
                ? product.packageLevels.find((level) => level.id === memberPrice.packageLevelId)?.label ?? null
                : product.packageLevels.find((level) => level.isDefaultSellingUnit)?.label ?? product.unit
            }
            packageLevels={product.packageLevels.map((level) => ({
              id: level.id,
              label: level.label,
              contentQuantity: level.contentQuantity,
              contentUnit: level.contentUnit,
              minimumOrderQuantity: level.minimumOrderQuantity,
              parentId: level.parentId,
              isDefaultSellingUnit: level.isDefaultSellingUnit,
            }))}
            variants={product.variants}
            outOfStock={outOfStock}
            priceState={
              !session
                ? "ANONYMOUS"
                : session.user.status === "APPROVED"
                  ? memberPrice
                    ? "VISIBLE"
                    : session.user.id
                      ? "UNAVAILABLE"
                      : "HIDDEN"
                  : session.user.status === "PENDING"
                    ? "PENDING"
                    : session.user.status === "REJECTED"
                      ? "REJECTED"
                      : "HIDDEN"
            }
          />

          {!isMember ? <ProductAccessCta loggedIn={!!session} /> : null}

          {product.description ? (
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
