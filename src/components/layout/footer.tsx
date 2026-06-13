import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE, STORE_WHATSAPP } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();
  const waLink = `https://wa.me/${STORE_WHATSAPP}`;

  return (
    <footer className="border-t border-ct-teal/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-cemerlang-toys.png"
              alt={SITE_NAME}
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-heading text-lg font-bold text-ct-blue">
              Cemerlang <span className="text-ct-orange">Toys</span>
            </span>
          </div>
          <p className="text-sm text-foreground/70">{SITE_TAGLINE}</p>
          <p className="text-sm text-foreground/70">
            Halo, CT Squad! 👋 Daftar untuk lihat harga & pesan langsung via WhatsApp.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-ct-blue">Navigasi</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>
              <Link href="/" className="hover:text-ct-teal-dark">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/katalog" className="hover:text-ct-teal-dark">
                Katalog
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-ct-teal-dark">
                Daftar / Masuk
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-ct-blue">Kontak CT Rangers</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-ct-teal" />
              <span>0812-6019-2002</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="text-ct-teal" />
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-ct-teal-dark">
                Chat via WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-ct-teal" />
              <span>Supplier &amp; grosir mainan anak</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ct-teal/10 py-4 text-center text-sm text-foreground/60">
        &copy; {year} {SITE_NAME}. Semua hak cipta dilindungi.
      </div>
    </footer>
  );
}
