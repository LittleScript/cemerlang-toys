"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export function ProductCardQuickAdd({
  productId,
  slug,
  name,
  imageUrl,
  price,
}: {
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
  price: number;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ productId, slug, name, price, imageUrl }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="inline-flex items-center rounded-full border border-ct-teal/20">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setQuantity((q) => Math.max(1, q - 1));
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full text-ct-blue transition-colors hover:bg-ct-teal/10"
          aria-label="Kurangi jumlah"
        >
          <Minus size={12} />
        </button>
        <span className="min-w-5 text-center text-xs font-semibold">{quantity}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setQuantity((q) => q + 1);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full text-ct-blue transition-colors hover:bg-ct-teal/10"
          aria-label="Tambah jumlah"
        >
          <Plus size={12} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-xs font-semibold text-white transition-colors",
          added ? "bg-ct-green" : "bg-ct-teal hover:bg-ct-teal-dark"
        )}
      >
        {added ? (
          <>
            <Check size={14} />
            Ditambahkan
          </>
        ) : (
          <>
            <ShoppingCart size={14} />
            Tambah
          </>
        )}
      </button>
    </div>
  );
}
