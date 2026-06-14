import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/motion/fade-in";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { SITE_NAME } from "@/lib/constants";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

export default async function Home() {
  const [categories, products, siteContent] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
    }),
    prisma.siteContent.findUnique({ where: { id: "default" } }),
  ]);

  const content = siteContent ?? DEFAULT_SITE_CONTENT;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ct-teal/15 via-ct-cream to-ct-orange/15">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <FadeIn>
            {content.heroBadge ? (
              <p className="mb-3 inline-block rounded-full bg-ct-orange/15 px-4 py-1 text-sm font-semibold text-ct-orange-dark">
                {content.heroBadge}
              </p>
            ) : null}
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-ct-blue sm:text-5xl">
              {content.heroTitle}
            </h1>
            <p className="mt-4 max-w-md text-lg text-foreground/70">{content.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-ct-teal px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-ct-teal-dark"
              >
                Daftar untuk Lihat Harga &amp; Pesan
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 rounded-full border-2 border-ct-orange px-6 py-3 font-semibold text-ct-orange-dark transition-colors hover:bg-ct-orange/10"
              >
                Lihat Katalog
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-square w-full">
              <Image
                src="/logo-cemerlang-toys.png"
                alt={SITE_NAME}
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-ct-blue">Kategori Pilihan</h2>
          <p className="mt-2 text-foreground/70">
            Lebih dari 100 produk dalam berbagai kategori, stok terus berputar
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category, index) => (
            <FadeIn key={category.id} delay={index * 0.04}>
              <CategoryCard name={category.name} slug={category.slug} icon={category.icon} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Product highlight */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-heading text-3xl font-bold text-ct-blue">Produk Terbaru</h2>
              <p className="mt-2 text-foreground/70">
                Daftar &amp; masuk untuk melihat harga, deskripsi, dan varian lengkap
              </p>
            </div>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-1 font-semibold text-ct-teal-dark hover:text-ct-teal"
            >
              Lihat semua <ArrowRight size={16} />
            </Link>
          </FadeIn>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.04}>
                <ProductCard
                  slug={product.slug}
                  name={product.name}
                  categoryName={product.category.name}
                  imageUrl={product.images[0]?.url}
                  stockStatus={product.stockStatus}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ct-blue">
        <FadeIn className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-white">{content.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{content.ctaSubtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-ct-orange px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-ct-orange-dark"
            >
              Daftar Sekarang
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/6281260192002"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle size={18} />
              Hubungi CT Rangers
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
