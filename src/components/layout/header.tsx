import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { AuthStatus } from "./auth-status";
import { CartLink } from "./cart-link";
import { MobileNav } from "./mobile-nav";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ct-teal/10 bg-ct-cream/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-cemerlang-toys.png"
            alt={SITE_NAME}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="font-heading text-lg font-bold">
            <span className="text-ct-teal">Cemerlang</span>{" "}
            <span className="text-ct-orange">Toys</span>{" "}
            <span className="text-ct-blue">Medan</span>
          </span>
        </Link>

        <form action="/katalog" className="hidden min-w-0 max-w-md flex-1 lg:flex">
          <label htmlFor="site-search" className="sr-only">Cari mainan</label>
          <div className="relative w-full">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input id="site-search" name="q" placeholder="Cari mainan, kategori, atau nama lain..." className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-ct-blue focus:ring-2 focus:ring-ct-blue/15" />
          </div>
        </form>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-foreground/80 transition-colors hover:text-ct-teal-dark"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/daftar-belanja" className="font-medium text-foreground/80 transition-colors hover:text-ct-teal-dark">Daftar Belanja</Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CartLink />
          <AuthStatus />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <CartLink />
          <MobileNav authSlot={<AuthStatus variant="mobile" />} />
        </div>
      </div>
    </header>
  );
}
