"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export function CartLink({ className }: { className?: string }) {
  const { totalItems } = useCart();

  return (
    <Link
      href="/keranjang"
      aria-label="Keranjang"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ct-blue transition-colors hover:bg-ct-teal/10",
        className
      )}
    >
      <ShoppingCart size={22} />
      {totalItems > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ct-orange px-1 text-xs font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </Link>
  );
}
