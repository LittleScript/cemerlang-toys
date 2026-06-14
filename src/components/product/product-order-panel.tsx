"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

type Variant = { id: string; name: string; price: number | null; stock: number };

export function ProductOrderPanel({
  productId,
  slug,
  productName,
  imageUrl,
  basePrice,
  discountPrice,
  variants,
  outOfStock,
  isMember,
}: {
  productId: string;
  slug: string;
  productName: string;
  imageUrl?: string | null;
  basePrice: number;
  discountPrice?: number | null;
  variants: Variant[];
  outOfStock: boolean;
  isMember: boolean;
}) {
  const { addItem } = useCart();
  const availableVariants = variants;
  const [selectedVariantId, setSelectedVariantId] = useState(availableVariants[0]?.id);
  const selectedVariant = availableVariants.find((v) => v.id === selectedVariantId);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = selectedVariant?.price ?? discountPrice ?? basePrice;
  const variantOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const disabled = outOfStock || variantOutOfStock;
  const maxQuantity = selectedVariant ? selectedVariant.stock : undefined;

  const handleAddToCart = () => {
    addItem(
      {
        productId,
        slug,
        name: productName,
        variantId: selectedVariant?.id,
        variantName: selectedVariant?.name,
        price,
        imageUrl,
        maxQuantity,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        {isMember ? (
          discountPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ct-orange-dark">
                {formatRupiah(discountPrice)}
              </span>
              <span className="text-base text-foreground/40 line-through">
                {formatRupiah(basePrice)}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-ct-blue">{formatRupiah(basePrice)}</span>
          )
        ) : (
          <p className="text-sm text-foreground/60">
            <Link href="/login" className="font-semibold text-ct-teal-dark hover:underline">
              Daftar / masuk
            </Link>{" "}
            untuk melihat harga.
          </p>
        )}
      </div>

      {availableVariants.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Pilih Varian</p>
          <div className="flex flex-wrap gap-2">
            {availableVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => {
                  setSelectedVariantId(variant.id);
                  setQuantity(1);
                }}
                disabled={variant.stock <= 0}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selectedVariantId === variant.id
                    ? "border-ct-teal bg-ct-teal text-white"
                    : "border-ct-teal/20 text-foreground/70 hover:border-ct-teal",
                  variant.stock <= 0 && "cursor-not-allowed opacity-40"
                )}
              >
                {variant.name}
                {variant.stock <= 0 ? " (Habis)" : ""}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!disabled ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">Jumlah</p>
          <div className="inline-flex items-center gap-3 rounded-full border border-ct-teal/20 px-2 py-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ct-blue transition-colors hover:bg-ct-teal/10"
              aria-label="Kurangi jumlah"
            >
              <Minus size={16} />
            </button>
            <span className="min-w-6 text-center font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => (maxQuantity ? Math.min(q + 1, maxQuantity) : q + 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-ct-blue transition-colors hover:bg-ct-teal/10"
              aria-label="Tambah jumlah"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md transition-colors sm:w-auto",
          disabled
            ? "cursor-not-allowed bg-foreground/30"
            : added
              ? "bg-ct-green"
              : "bg-ct-teal hover:bg-ct-teal-dark"
        )}
      >
        {disabled ? (
          "Stok Habis"
        ) : added ? (
          <>
            <Check size={18} />
            Ditambahkan ke Keranjang
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            Tambah ke Keranjang
          </>
        )}
      </button>
    </div>
  );
}
