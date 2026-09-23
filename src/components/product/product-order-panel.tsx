"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

type Variant = { id: string; name: string; price: number | null; stock: number };
type PackageLevel = {
  id: string;
  label: string;
  contentQuantity: number | null;
  contentUnit: string | null;
  minimumOrderQuantity: number | null;
  parentId: string | null;
  isDefaultSellingUnit: boolean;
};

export function ProductOrderPanel({
  productId,
  slug,
  productName,
  imageUrl,
  legacyUnit,
  memberPrice,
  priceBasis,
  packageLevels,
  variants,
  outOfStock,
  priceState,
}: {
  productId: string;
  slug: string;
  productName: string;
  imageUrl?: string | null;
  legacyUnit?: string | null;
  memberPrice?: number | null;
  priceBasis?: string | null;
  packageLevels: PackageLevel[];
  variants: Variant[];
  outOfStock: boolean;
  priceState: "ANONYMOUS" | "PENDING" | "REJECTED" | "HIDDEN" | "VISIBLE" | "UNAVAILABLE";
}) {
  const { addItem } = useCart();
  const availableVariants = variants;
  const [selectedVariantId, setSelectedVariantId] = useState(availableVariants[0]?.id);
  const selectedVariant = availableVariants.find((v) => v.id === selectedVariantId);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = memberPrice ?? 0;
  const variantOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const inquiryOnly = outOfStock || variantOutOfStock;
  const maxQuantity = selectedVariant ? selectedVariant.stock : undefined;
  const packageSummary = packageLevels
    .map((level) => `${level.label}${level.contentQuantity && level.contentUnit ? `: ${level.contentQuantity} ${level.contentUnit}` : ""}${level.minimumOrderQuantity ? ` (min. ${level.minimumOrderQuantity} ${level.label})` : ""}`)
    .join("; ");

  const handleAddToCart = () => {
    addItem(
      {
        productId,
        slug,
        name: productName,
        variantId: selectedVariant?.id,
        variantName: selectedVariant?.name,
        price,
        unit: packageLevels.find((level) => level.isDefaultSellingUnit)?.label ?? legacyUnit ?? undefined,
        imageUrl,
        maxQuantity: inquiryOnly ? undefined : maxQuantity,
        priceVisible: priceState === "VISIBLE",
        priceBasis: priceBasis ?? undefined,
        availability: inquiryOnly ? "Habis — Konfirmasi ke Sales" : "Tersedia",
        packageSummary: packageSummary || undefined,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        {priceState === "VISIBLE" && memberPrice != null ? (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-ct-blue">{formatRupiah(memberPrice)}</span>
            {priceBasis ? <span className="text-sm text-foreground/60">/ {priceBasis}</span> : null}
          </div>
        ) : priceState === "UNAVAILABLE" ? (
          <p className="text-sm text-foreground/60">Harga belum tersedia untuk akun ini.</p>
        ) : priceState === "ANONYMOUS" || priceState === "PENDING" || priceState === "REJECTED" ? (
          <p className="text-sm text-foreground/60">Harga tersedia untuk member yang telah disetujui.</p>
        ) : (
          <p className="text-sm text-foreground/60">Hubungi untuk harga.</p>
        )}
      </div>

      {packageLevels.length > 0 ? (
        <div className="space-y-1 text-sm text-foreground/70">
          {packageLevels.map((level) => (
            <p key={level.id}>
              <span className="font-semibold text-foreground">{level.label}</span>
              {level.contentQuantity && level.contentUnit
                ? ` · isi ${level.contentQuantity} ${level.contentUnit}`
                : ""}
              {level.minimumOrderQuantity
                ? ` · minimum ${level.minimumOrderQuantity} ${level.label}`
                : ""}
            </p>
          ))}
        </div>
      ) : null}

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

      {!inquiryOnly ? (
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
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md transition-colors sm:w-auto",
          added
              ? "bg-ct-green"
              : "bg-ct-teal hover:bg-ct-teal-dark"
        )}
      >
        {added ? (
          <>
            <Check size={18} />
            Ditambahkan ke Daftar Belanja
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            {inquiryOnly ? "Tanyakan ke Sales" : "Tambah ke Daftar Belanja"}
          </>
        )}
      </button>
    </div>
  );
}
