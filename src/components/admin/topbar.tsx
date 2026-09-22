"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { cn } from "@/lib/utils";

export function Topbar({ breadcrumbLabel }: { breadcrumbLabel?: string }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [menuOpen]);

  return (
    <header
      className="flex h-[var(--topbar-height)] items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-topbar)] px-4 shrink-0"
      style={{ zIndex: 'var(--z-topbar)' }}
    >
      {/* Mobile hamburger */}
      <button
        className="lg:hidden rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
        aria-label="Buka menu samping"
        onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar-drawer"))}
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <Breadcrumb overrideLabel={breadcrumbLabel} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* User menu */}
      {session?.user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
          >
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-muted)]">
                <User size={16} className="text-[var(--text-muted)]" />
              </span>
            )}
            <span className="hidden sm:inline text-[var(--text-primary)] font-medium max-w-[120px] truncate">
              {session.user.name ?? "Admin"}
            </span>
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform hidden sm:block",
                menuOpen && "rotate-180"
              )}
            />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] shadow-lg py-1"
              style={{ zIndex: '500' }}
            >
              <div className="px-3 py-2 border-b border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {session.user.name ?? "Admin"}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {session.user.email ?? ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-muted)] transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
