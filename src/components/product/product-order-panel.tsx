"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn, formatRupiah } from "@/lib/utils";
import { buildOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";

type Variant = { id: string; name: string; price: number | null; stock: number };

export function ProductOrderPanel({
  productName,
  basePrice,
  discountPrice,
  variants,
  outOfStock,
  customerName = "(Nama Anda)",
}: {
  productName: string;
  basePrice: number;
  discountPrice?: number | null;
  variants: Variant[];
  outOfStock: boolean;
  customerName?: string;
}) {
  const availableVariants = variants;
  const [selectedVariantId, setSelectedVariantId] = useState(availableVariants[0]?.id);
  const selectedVariant = availableVariants.find((v) => v.id === selectedVariantId);

  const price = selectedVariant?.price ?? discountPrice ?? basePrice;
  const variantOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const disabled = outOfStock || variantOutOfStock;

  const handleOrder = () => {
    const message = buildOrderMessage({
      customerName,
      productName,
      variantName: selectedVariant?.name,
      price,
      productUrl: window.location.href,
    });
    window.open(buildWhatsAppLink(message), "_blank");
  };

  return (
    <div className="space-y-4">
      <div>
        {discountPrice ? (
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
                onClick={() => setSelectedVariantId(variant.id)}
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

      <button
        type="button"
        onClick={handleOrder}
        disabled={disabled}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-md transition-colors sm:w-auto",
          disabled ? "cursor-not-allowed bg-foreground/30" : "bg-ct-green hover:bg-ct-green/90"
        )}
      >
        <MessageCircle size={18} />
        {disabled ? "Stok Habis" : "Pesan via WhatsApp"}
      </button>
    </div>
  );
}
