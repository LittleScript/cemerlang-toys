"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/whitelist", label: "Whitelist WA", icon: ShieldCheck },
  { href: "/admin/member", label: "Member", icon: Users },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible">
      {ADMIN_NAV.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors",
              active
                ? "bg-ct-teal text-white"
                : "text-foreground/70 hover:bg-ct-teal/10 hover:text-ct-blue"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
