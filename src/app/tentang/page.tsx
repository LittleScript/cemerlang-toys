import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  Target,
  Users,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_TAGLINE, STORE_MAPS_URL, STORE_WHATSAPP } from "@/lib/constants";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/about-content";

export default async function TentangPage() {
  const waLink = `https://wa.me/${STORE_WHATSAPP}`;
  const [aboutContent, galleryPhotos] = await Promise.all([
    prisma.aboutContent.findUnique({ where: { id: "default" } }),
    prisma.galleryPhoto.findMany({ orderBy: { order: "asc" } }),
  ]);
  const content = aboutContent ?? DEFAULT_ABOUT_CONTENT;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ct-teal/15 via-ct-cream to-ct-orange/15">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <FadeIn>
            <p className="mb-3 inline-block rounded-full bg-ct-orange/15 px-4 py-1 text-sm font-semibold text-ct-orange-dark">
              {content.heroBadge}
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-ct-blue sm:text-5xl">
              Tentang {SITE_NAME}
            </h1>
            <p className="mt-4 max-w-md text-lg text-foreground/70">{SITE_TAGLINE}</p>
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

      {/* Statistik */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <FadeIn className="text-center">
              <p className="font-heading text-2xl font-extrabold text-ct-blue sm:text-3xl lg:text-4xl">
                {content.stat1Value}
              </p>
              <p className="mt-1 text-sm text-foreground/60">{content.stat1Label}</p>
            </FadeIn>
            <FadeIn delay={0.05} className="text-center">
              <p className="font-heading text-2xl font-extrabold text-ct-blue sm:text-3xl lg:text-4xl">
                {content.stat2Value}
              </p>
              <p className="mt-1 text-sm text-foreground/60">{content.stat2Label}</p>
            </FadeIn>
            <FadeIn delay={0.1} className="text-center">
              <p className="font-heading text-2xl font-extrabold text-ct-blue sm:text-3xl lg:text-4xl">
                {content.stat3Value}
              </p>
              <p className="mt-1 text-sm text-foreground/60">{content.stat3Label}</p>
            </FadeIn>
            <FadeIn delay={0.15} className="text-center">
              <p className="font-heading text-2xl font-extrabold text-ct-blue sm:text-3xl lg:text-4xl">
                {content.stat4Value}
              </p>
              <p className="mt-1 text-sm text-foreground/60">{content.stat4Label}</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Cerita */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn className="space-y-4">
          <h2 className="font-heading text-3xl font-bold text-ct-blue">Cerita Kami</h2>
          <p className="text-foreground/70">{content.ceritaParagraph1}</p>
          <p className="text-foreground/70">{content.ceritaParagraph2}</p>
          <p className="text-foreground/70">{content.ceritaParagraph3}</p>
        </FadeIn>
      </section>

      {/* Galeri Toko & Gudang */}
      {galleryPhotos.length > 0 ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="mb-10 text-center">
              <h2 className="font-heading text-3xl font-bold text-ct-blue">Toko & Gudang Kami</h2>
              <p className="mx-auto mt-2 max-w-xl text-foreground/70">
                Dokumentasi asli toko, gudang, dan proses packing pesanan kami.
              </p>
            </FadeIn>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {galleryPhotos.map((photo, i) => (
                <FadeIn
                  key={photo.id}
                  delay={i * 0.05}
                  className="overflow-hidden rounded-2xl border border-ct-teal/10"
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={photo.url}
                      alt={photo.caption ?? SITE_NAME}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  {photo.caption ? (
                    <p className="px-3 py-2 text-sm text-foreground/70">{photo.caption}</p>
                  ) : null}
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Visi & Misi */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-ct-blue">Visi & Misi</h2>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <FadeIn className="flex h-full flex-col rounded-2xl bg-ct-teal/10 p-8">
              <Target className="text-ct-teal" size={32} />
              <h3 className="mt-4 font-heading text-xl font-semibold text-ct-blue">Visi</h3>
              <p className="mt-3 text-foreground/70">{content.visiText}</p>
            </FadeIn>

            <FadeIn delay={0.08} className="rounded-2xl border border-ct-teal/10 p-8">
              <h3 className="font-heading text-xl font-semibold text-ct-blue">Misi</h3>
              <ul className="mt-3 space-y-3">
                <li className="flex items-start gap-3 text-foreground/70">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                  {content.misi1}
                </li>
                <li className="flex items-start gap-3 text-foreground/70">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                  {content.misi2}
                </li>
                <li className="flex items-start gap-3 text-foreground/70">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                  {content.misi3}
                </li>
                <li className="flex items-start gap-3 text-foreground/70">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                  {content.misi4}
                </li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Keunggulan Kami */}
      <section className="bg-ct-cream py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-ct-blue">Keunggulan Kami</h2>
          </FadeIn>

          <FadeIn className="rounded-2xl border border-ct-teal/10 bg-white p-8">
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-foreground/70">
                <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                {content.keunggulan1}
              </li>
              <li className="flex items-start gap-3 text-foreground/70">
                <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                {content.keunggulan2}
              </li>
              <li className="flex items-start gap-3 text-foreground/70">
                <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                {content.keunggulan3}
              </li>
              <li className="flex items-start gap-3 text-foreground/70">
                <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                {content.keunggulan4}
              </li>
              <li className="flex items-start gap-3 text-foreground/70">
                <CheckCircle2 className="mt-0.5 shrink-0 text-ct-teal" size={20} />
                {content.keunggulan5}
              </li>
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-ct-cream py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-ct-blue">Mengapa Cemerlang Toys Medan?</h2>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-3">
            <FadeIn className="rounded-2xl border border-ct-teal/10 p-6 text-center">
              <ShoppingBag className="mx-auto text-ct-teal" size={32} />
              <h3 className="mt-4 font-heading font-semibold text-ct-blue">{content.valueProp1Title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{content.valueProp1Desc}</p>
            </FadeIn>

            <FadeIn delay={0.08} className="rounded-2xl border border-ct-teal/10 p-6 text-center">
              <Users className="mx-auto text-ct-teal" size={32} />
              <h3 className="mt-4 font-heading font-semibold text-ct-blue">{content.valueProp2Title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{content.valueProp2Desc}</p>
            </FadeIn>

            <FadeIn delay={0.16} className="rounded-2xl border border-ct-teal/10 p-6 text-center">
              <Heart className="mx-auto text-ct-teal" size={32} />
              <h3 className="mt-4 font-heading font-semibold text-ct-blue">{content.valueProp3Title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{content.valueProp3Desc}</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Cara Order */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-ct-blue">Cara Order</h2>
          </FadeIn>

          <div className="space-y-4">
            {[
              content.caraOrder1,
              content.caraOrder2,
              content.caraOrder3,
            ].map((step, i) => (
              <FadeIn
                key={step}
                delay={i * 0.05}
                className="flex items-start gap-4 rounded-2xl border border-ct-teal/10 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ct-teal font-heading font-bold text-white">
                  {i + 1}
                </span>
                <p className="mt-1 text-foreground/70">{step}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ct-cream py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-ct-blue">
              Pertanyaan yang Sering Diajukan
            </h2>
          </FadeIn>

          <div className="space-y-3">
            {[
              [content.faq1Question, content.faq1Answer],
              [content.faq2Question, content.faq2Answer],
              [content.faq3Question, content.faq3Answer],
              [content.faq4Question, content.faq4Answer],
              [content.faq5Question, content.faq5Answer],
              [content.faq6Question, content.faq6Answer],
              [content.faq7Question, content.faq7Answer],
            ].map(([question, answer], i) => (
              <FadeIn key={question} delay={i * 0.05}>
                <details className="group rounded-2xl border border-ct-teal/10 bg-white p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading font-semibold text-ct-blue">
                    {question}
                    <ChevronDown
                      className="shrink-0 text-ct-teal transition-transform group-open:rotate-180"
                      size={20}
                    />
                  </summary>
                  <p className="mt-3 text-foreground/70">{answer}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi & Kontak */}
      <section className="bg-ct-blue">
        <FadeIn className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-white">{content.contactTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{content.contactSubtitle}</p>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left">
            <a
              href={STORE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            >
              <MapPin size={18} />
              Lihat Lokasi Toko
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            >
              <MessageCircle size={18} />
              Chat via WhatsApp
            </a>
            <div className="flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 font-semibold text-white">
              <Phone size={18} />
              0812-6019-2002
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-ct-orange px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-ct-orange-dark"
            >
              Buka Akses Harga Reseller
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Lihat Katalog
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
