import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Package,
  MessageCircle,
  Search,
  Truck,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CategoryIcon } from "@/components/category-icon";
import { ProductCard } from "@/components/product-card";
import { STORE_WHATSAPP } from "@/lib/constants";
import { auth } from "@/auth";
import { resolveMemberPrice } from "@/lib/pricing";

export const revalidate = 60;

const trustItems = [
  { value: "1000+ Produk", label: "Pilihan mainan lengkap", icon: Package },
  { value: "Seluruh Indonesia", label: "Melayani reseller di seluruh Indonesia", icon: Truck },
  { value: "Ribuan Reseller", label: "Telah mempercayai Cemerlang Toys", icon: Users },
  { value: "Sejak 2002", label: "Lebih dari 20 tahun bersama pelanggan", icon: CalendarDays },
] as const;

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
    <div className="w-full max-w-full min-w-0 overflow-x-hidden bg-white">
      <section className="w-full max-w-full overflow-hidden border-b border-slate-200 bg-[#f5f8ff]">
        <div className="relative mx-auto flex w-full min-w-0 max-w-7xl flex-col px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[500px] lg:justify-center lg:px-8 lg:py-12">
          <div className="relative z-10 w-full min-w-0 max-w-[calc(100vw-2rem)] pr-4 sm:max-w-none sm:pr-0 lg:max-w-[34%]">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-ct-blue">Supplier mainan anak</p>
            <h1 className="mt-3 w-full max-w-xl break-words font-heading text-[clamp(1.75rem,5vw,4rem)] font-extrabold leading-[1.04] tracking-tight text-[#102b55] lg:text-[3.25rem]">
              Supplier Mainan Anak
              <br />
              Terpercaya Sejak 2002
            </h1>
            <p className="mt-5 w-full max-w-[20rem] break-words [overflow-wrap:anywhere] text-base leading-7 text-slate-600 sm:max-w-xl sm:text-lg">
              Lebih dari 1000 produk dan ribuan pilihan mainan untuk toko, reseller, sekolah, dan berbagai kebutuhan usaha di seluruh Indonesia.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/katalog" className="inline-flex items-center gap-2 rounded-lg bg-ct-blue px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[#173d78]">
                Lihat Katalog <ArrowRight size={17} />
              </Link>
              <Link href="/tentang" className="inline-flex items-center gap-2 rounded-lg border border-ct-blue/25 bg-white px-5 py-3 font-bold text-ct-blue transition hover:bg-ct-blue/5">
                Tentang Kami
              </Link>
            </div>
            <form action="/katalog" className="mt-7 flex w-full min-w-0 max-w-[calc(100vw-2rem)] flex-col gap-2 sm:max-w-xl sm:flex-row">
              <label htmlFor="home-search" className="sr-only">Cari mainan</label>
              <div className="relative min-w-0 flex-1">
                <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="home-search" name="q" placeholder="Cari mainan, kategori, atau nama yang biasa dipakai..." className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm outline-none transition focus:border-ct-blue focus:ring-2 focus:ring-ct-blue/15" />
              </div>
              <button type="submit" className="rounded-lg bg-ct-blue px-5 py-3 font-bold text-white transition hover:bg-[#173d78]">Cari</button>
            </form>
          </div>

          <div className="relative mt-8 aspect-[16/9] w-full max-w-[calc(100vw-2rem)] overflow-hidden sm:mt-10 sm:max-w-full lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto lg:overflow-visible">
            <Image
              src="/images/hero-cemerlang-toys.webp"
              alt="Kumpulan produk mainan grosir Cemerlang Toys"
              fill
              sizes="(max-width: 1023px) 100vw, 100vw"
              className="object-cover object-center lg:object-[center_bottom]"
            />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(245,248,255,0.98)_0%,rgba(245,248,255,0.9)_23%,rgba(245,248,255,0.48)_35%,rgba(245,248,255,0)_53%)] lg:block" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 divide-y divide-slate-200 sm:grid-cols-4 sm:divide-x sm:divide-y-0 lg:px-8">
          {trustItems.map(({ value, label, icon: Icon }) => (
            <div key={value} className="flex min-w-0 items-center gap-3 px-4 py-5 sm:px-5">
              <Icon size={25} strokeWidth={2.2} className="shrink-0 text-ct-blue" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-extrabold text-[#102b55] sm:text-base">{value}</p>
                <p className="mt-0.5 text-xs leading-4 text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex min-w-0 items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-extrabold text-[#102b55] sm:text-3xl">Kategori Pilihan</h2>
          <Link href="/katalog" className="max-w-[42%] shrink-0 truncate text-right text-sm font-bold text-ct-blue hover:underline sm:max-w-none">Lihat Semua Kategori <ArrowRight size={15} className="inline" /></Link>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/katalog?kategori=${category.slug}`} className="group flex w-28 shrink-0 flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-ct-blue/30 hover:shadow-sm sm:w-32">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#eef4ff] text-ct-blue transition group-hover:bg-ct-blue group-hover:text-white">
                <CategoryIcon name={category.icon} size={29} />
              </span>
              <span className="line-clamp-2 text-xs font-bold leading-4 text-slate-700">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#fbfcff]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex min-w-0 items-end justify-between gap-4">
            <h2 className="font-heading text-2xl font-extrabold text-[#102b55] sm:text-3xl">Produk Terbaru</h2>
            <Link href="/katalog" className="max-w-[42%] shrink-0 truncate text-right text-sm font-bold text-ct-blue hover:underline sm:max-w-none">Lihat Semua Produk <ArrowRight size={15} className="inline" /></Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                slug={product.slug}
                name={product.name}
                categoryName={product.category.name}
                imageUrl={product.images[0]?.url}
                stockStatus={product.stockStatus}
                variantCount={product.variants.length}
                packageLevel={product.packageLevels[0]}
                price={memberPrices[index]?.amount}
                priceBasis={product.packageLevels[0]?.label}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-xl bg-[#edf5ff] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="font-heading text-xl font-extrabold text-[#102b55]">Jadi Member Sekarang</p>
            <p className="mt-1 text-sm text-slate-600">Dapatkan akses harga khusus setelah akun disetujui.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="rounded-lg bg-ct-blue px-5 py-3 text-sm font-bold text-white hover:bg-[#173d78]">Daftar Sekarang</Link>
            <a href={`https://wa.me/${STORE_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-ct-green/30 bg-white px-5 py-3 text-sm font-bold text-ct-green hover:bg-ct-green/5"><MessageCircle size={17} /> Hubungi Kami</a>
          </div>
        </div>
      </section>
    </div>
  );
}
