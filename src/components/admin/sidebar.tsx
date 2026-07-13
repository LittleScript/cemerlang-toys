"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tags, LayoutTemplate,
  Info, Images, ShieldCheck, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface NavSection {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Toko",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/produk", label: "Produk", icon: Package },
      { href: "/admin/kategori", label: "Kategori", icon: Tags },
      { href: "/admin/konten", label: "Konten", icon: LayoutTemplate },
    ],
  },
  {
    label: "Konten",
    items: [
      { href: "/admin/tentang", label: "Tentang Kami", icon: Info },
      { href: "/admin/galeri", label: "Galeri", icon: Images },
    ],
  },
  {
    label: "Pengguna",
    items: [
      { href: "/admin/whitelist", label: "Whitelist WA", icon: ShieldCheck },
      { href: "/admin/member", label: "Member", icon: Users },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="sidebar flex flex-col bg-[var(--bg-sidebar)] text-[var(--sidebar-text)] overflow-hidden">
      {/* Brand */}
      <div className="flex h-[var(--topbar-height)] items-center gap-3 px-4 shrink-0">
        <span className="text-xl shrink-0">🧸</span>
        <span className="font-heading font-semibold text-[var(--sidebar-text-hover)] text-sm whitespace-nowrap">
          Cemerlang Toys
        </span>
      </div>

      <div className="mx-3 border-t border-[var(--sidebar-divider)]" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 px-2 sidebar-section-label">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors border-l-[3px]",
                      active
                        ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active)] border-l-[var(--sidebar-active)]"
                        : "border-l-transparent hover:bg-[var(--brand-muted)] hover:text-[var(--sidebar-text-hover)]"
                    )}
                    title={item.label}
                  >
                    <item.icon size={18} className="shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      {session?.user && (
        <>
          <div className="mx-3 border-t border-[var(--sidebar-divider)]" />
          <div className="p-3 shrink-0">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)]">
                  <Users size={16} className="text-[var(--text-muted)]" />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--sidebar-text-hover)] truncate">
                  {session.user.name ?? "Admin"}
                </p>
                <p className="text-xs text-[var(--sidebar-text)] truncate">
                  {session.user.email ?? ""}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Collapse CSS: hide labels when collapsed */}
      <style jsx>{`
        .sidebar-collapsed .sidebar-section-label { display: none; }
        .sidebar-collapsed .sidebar span.whitespace-nowrap { display: none; }
      `}</style>
    </aside>
  );
}
