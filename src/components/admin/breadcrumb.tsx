"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  admin: "Admin",
  produk: "Produk",
  baru: "Tambah",
  kategori: "Kategori",
  konten: "Konten",
  tentang: "Tentang Kami",
  galeri: "Galeri",
  whitelist: "Whitelist WA",
  member: "Member",
};

function useBreadcrumb(overrideLabel?: string) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((seg, i) => {
    const isLast = i === segments.length - 1;
    const known = LABELS[seg];
    return {
      label: isLast && overrideLabel ? overrideLabel
             : known ? known
             : seg,        // fallback: raw segment (e.g., UUID)
      href: "/" + segments.slice(0, i + 1).join("/"),
      current: isLast,
      isDynamic: !known,
    };
  });
}

interface BreadcrumbProps {
  overrideLabel?: string;
}

export function Breadcrumb({ overrideLabel }: BreadcrumbProps) {
  const items = useBreadcrumb(overrideLabel);

  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-[var(--text-muted)]" />}
          {item.current ? (
            <span className="font-medium text-[var(--text-primary)]" aria-current="page">
              {item.isDynamic ? (
                <span className="text-[var(--text-muted)] font-mono text-xs truncate max-w-[120px] inline-block">
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
