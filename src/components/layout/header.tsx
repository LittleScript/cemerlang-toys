import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { AuthStatus } from "./auth-status";
import { CartLink } from "./cart-link";
import { MobileNav } from "./mobile-nav";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ct-teal/10 bg-ct-cream/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-cemerlang-toys.png"
            alt={SITE_NAME}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="font-heading text-lg font-bold text-ct-blue">
            Cemerlang <span className="text-ct-orange">Toys</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-foreground/80 transition-colors hover:text-ct-teal-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <CartLink />
          <AuthStatus />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartLink />
          <MobileNav authSlot={<AuthStatus variant="mobile" />} />
        </div>
      </div>
    </header>
  );
}
