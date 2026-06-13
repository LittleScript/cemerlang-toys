"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  authSlot: ReactNode;
}

export function MobileNav({ authSlot }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-ct-blue md:hidden"
        aria-label="Buka menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={26} /> : <Menu size={26} />}
      </button>

      <div
        className={cn(
          "absolute inset-x-0 top-full overflow-hidden border-t border-ct-teal/10 bg-ct-cream/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden",
          open ? "max-h-[calc(100vh-4rem)]" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 font-medium text-foreground/80 hover:bg-ct-teal/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-ct-teal/10 pt-2">{authSlot}</div>
        </nav>
      </div>
    </>
  );
}
