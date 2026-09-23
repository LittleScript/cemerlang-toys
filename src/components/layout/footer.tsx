import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE_NAME, STORE_MAPS_URL, STORE_WHATSAPP } from "@/lib/constants";

export async function Footer() {
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
            <span className="font-heading text-lg font-bold">
              <span className="text-ct-teal">Cemerlang</span>{" "}
              <span className="text-ct-orange">Toys</span>{" "}
              <span className="text-ct-blue">Medan</span>
            </span>
          </div>
          <p className="text-sm text-foreground/70">Katalog grosir mainan untuk kebutuhan toko dan reseller.</p>
          <p className="text-sm text-foreground/70">Daftar Belanja diteruskan ke WhatsApp untuk konfirmasi sales.</p>
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
              <Link href="/tentang" className="hover:text-ct-teal-dark">
                Tentang Kami
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
              <a href={STORE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ct-teal-dark">
                Lihat Lokasi Toko
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ct-teal/10 py-4 text-center text-sm text-foreground/60">
        <p>
          &copy; {year} {SITE_NAME}. Semua hak cipta dilindungi.
        </p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <Link href="/privasi" className="hover:text-ct-teal-dark">
            Kebijakan Privasi
          </Link>
          <Link href="/syarat-ketentuan" className="hover:text-ct-teal-dark">
            Syarat &amp; Ketentuan
          </Link>
        </div>
      </div>
    </footer>
  );
}
