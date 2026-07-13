"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tags, LayoutTemplate,
  Info, Images, ShieldCheck, Users, User,
  ChevronLeft, ChevronRight, X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function toggleCollapse() {
    const el = document.documentElement;
    const isCollapsed = el.classList.contains("sidebar-collapsed");
    if (isCollapsed) {
      el.classList.remove("sidebar-collapsed");
    } else {
      el.classList.add("sidebar-collapsed");
    }
    localStorage.setItem(
      "ct-admin-sidebar-collapsed",
      isCollapsed ? "false" : "true"
    );
  }

  // Mobile drawer listener
  useEffect(() => {
    function handler() {
      setMobileOpen((v) => !v);
    }
    window.addEventListener("toggle-sidebar-drawer", handler);
    return () =>
      window.removeEventListener("toggle-sidebar-drawer", handler);
  }, []);

  // Escape key closes mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarContent = (
    <aside className="sidebar flex flex-col bg-[var(--bg-sidebar)] text-[var(--sidebar-text)] overflow-hidden h-full">
      {/* Brand */}
      <div className="flex h-[var(--topbar-height)] items-center gap-3 px-4 shrink-0">
        <span className="text-xl shrink-0">🧸</span>
        <span className="font-heading font-semibold text-[var(--sidebar-text-hover)] text-sm sidebar-label-text">
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
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={18} className="shrink-0" />
                    <span className="sidebar-label-text">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={toggleCollapse}
        className="hidden lg:flex items-center justify-center h-10 mx-3 mb-3 rounded-lg text-[var(--sidebar-text)] hover:bg-[var(--brand-muted)] hover:text-[var(--sidebar-text-hover)] transition-colors shrink-0"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft size={18} className="sidebar-collapsed-hide" />
        <ChevronRight size={18} className="sidebar-collapsed-show hidden" />
      </button>

      {/* User footer */}
      {session?.user && (
        <>
          <div className="mx-3 border-t border-[var(--sidebar-divider)]" />
          <div className="p-3 shrink-0">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)]">
                  <User size={16} className="text-[var(--text-muted)]" />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--sidebar-text-hover)] truncate sidebar-label-text">
                  {session.user.name ?? "Admin"}
                </p>
                <p className="text-xs text-[var(--sidebar-text)] truncate sidebar-label-text">
                  {session.user.email ?? ""}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar (always in the layout) */}
      {sidebarContent}

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 lg:hidden"
          style={{ zIndex: "var(--z-overlay)" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "var(--surface-overlay)" }}
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div
            className="absolute inset-y-0 left-0 w-[var(--sidebar-width)] shadow-xl animate-slide-in"
            style={{ zIndex: "calc(var(--z-overlay) + 1)" }}
          >
            {/* Close button for mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-[var(--sidebar-text)] hover:bg-[var(--brand-muted)] hover:text-[var(--sidebar-text-hover)] transition-colors lg:hidden"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
