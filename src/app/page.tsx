import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { SITE_NAME, STORE_WHATSAPP } from "@/lib/constants";
import { auth } from "@/auth";
import { resolveMemberPrice } from "@/lib/pricing";

export const revalidate = 60;

export default async function Home() {
  const session = await auth();
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" }, take: 12 }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        slug: true,
        name: true,
        stockStatus: true,
        category: { select: { name: true } },
        images: { orderBy: { order: "asc" }, take: 1, select: { url: true, alt: true } },
        variants: { select: { id: true } },
        packageLevels: {
          where: { isDefaultSellingUnit: true },
          select: { label: true, contentQuantity: true, contentUnit: true, minimumOrderQuantity: true },
          take: 1,
        },
      },
    }),
  ]);
  const memberPrices = session?.user?.id
    ? await Promise.all(products.map((product) => resolveMemberPrice({ userId: session.user.id, productId: product.id })))
    : products.map(() => null);

  return (
    <div>
      <section className="border-b border-ct-teal/10 bg-ct-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-16 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ct-teal-dark">Cemerlang Toys Medan</p>
            <h1 className="mt-3 max-w-2xl font-heading text-4xl font-bold leading-tight text-ct-blue sm:text-5xl">
              Cari stok mainan untuk toko dan reseller.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground/70">
              Jelajahi katalog grosir, susun Daftar Belanja, lalu kirim kebutuhan Anda ke CT Rangers melalui WhatsApp.
            </p>
            <form action="/katalog" className="mt-7 flex max-w-xl gap-2">
              <label htmlFor="home-search" className="sr-only">Cari produk</label>
              <div className="relative min-w-0 flex-1">
                <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
                <input id="home-search" name="q" placeholder="Cari nama produk atau nama yang biasa dipakai..." className="w-full rounded-lg border border-ct-teal/20 bg-white py-3 pl-11 pr-3 outline-none focus:border-ct-teal" />
              </div>
              <button type="submit" className="rounded-lg bg-ct-teal px-5 py-3 font-semibold text-white hover:bg-ct-teal-dark">Cari</button>
            </form>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href="/katalog" className="inline-flex items-center gap-2 font-semibold text-ct-teal-dark">Lihat seluruh katalog <ArrowRight size={16} /></Link>
              <Link href="#cara-order" className="font-semibold text-foreground/65 hover:text-foreground">Cara order</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:justify-self-end">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/70 p-5">
              <Image src="/logo-cemerlang-toys.png" alt={SITE_NAME} fill priority sizes="(max-width: 768px) 90vw, 360px" className="object-contain p-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-ct-teal-dark">Mulai dari kebutuhan Anda</p><h2 className="mt-1 font-heading text-2xl font-bold text-ct-blue">Kategori produk</h2></div>
          <Link href="/katalog" className="text-sm font-semibold text-ct-teal-dark">Semua kategori</Link>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => <Link key={category.id} href={`/katalog?kategori=${category.slug}`} className="shrink-0 border-b-2 border-ct-teal/20 px-1 py-2 text-sm font-semibold text-foreground/75 hover:border-ct-teal hover:text-ct-teal-dark">{category.name}</Link>)}
        </div>
      </section>

      <section className="border-y border-ct-teal/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-ct-teal-dark">Update katalog</p><h2 className="mt-1 font-heading text-2xl font-bold text-ct-blue">Produk terbaru</h2></div><Link href="/katalog" className="text-sm font-semibold text-ct-teal-dark">Lihat semua</Link></div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product, index) => <ProductCard key={product.id} productId={product.id} slug={product.slug} name={product.name} categoryName={product.category.name} imageUrl={product.images[0]?.url} stockStatus={product.stockStatus} variantCount={product.variants.length} packageLevel={product.packageLevels[0]} price={memberPrices[index]?.amount} priceBasis={product.packageLevels[0]?.label} />)}
          </div>
        </div>
      </section>

      <section id="cara-order" className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div><p className="text-sm font-semibold text-ct-teal-dark">Alur pembelian</p><h2 className="mt-1 font-heading text-2xl font-bold text-ct-blue">Cara order tetap manusiawi.</h2><p className="mt-3 text-foreground/70">Website membantu menyiapkan kebutuhan Anda. CT Rangers mengonfirmasi harga, ketersediaan, dan detail akhir melalui WhatsApp.</p></div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {["Pilih produk dari katalog", "Tambahkan ke Daftar Belanja", "Periksa unit, kemasan, dan jumlah", "Kirim ke WhatsApp untuk dikonfirmasi"].map((step, index) => <li key={step} className="flex gap-3 border-l-2 border-ct-orange px-4 py-3"><span className="font-heading font-bold text-ct-orange-dark">0{index + 1}</span><span className="font-medium text-foreground/80">{step}</span></li>)}
        </ol>
      </section>

      <section className="bg-ct-blue text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/65">Harga member</p><h2 className="mt-1 font-heading text-2xl font-bold">Harga tersedia untuk member yang disetujui.</h2><p className="mt-2 max-w-xl text-white/75">Setiap member dapat memiliki Price Group sendiri. Anda tetap dapat melihat katalog dan mengirim inquiry tanpa login.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/login" className="rounded-lg bg-ct-orange px-5 py-3 font-semibold text-white hover:bg-ct-orange-dark">Daftar / Masuk</Link><a href={`https://wa.me/${STORE_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/35 px-5 py-3 font-semibold text-white hover:bg-white/10"><MessageCircle size={18} /> Hubungi sales</a></div>
        </div>
      </section>
    </div>
  );
}
