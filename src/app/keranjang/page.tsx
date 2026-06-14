"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Minus, Plus, Trash2, MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { buildCartOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { cn, formatRupiah } from "@/lib/utils";

export default function KeranjangPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { data: session } = useSession();
  const isMember = session?.user?.status === "APPROVED";

  const handleCheckout = () => {
    const message = buildCartOrderMessage({
      customerName: session?.user?.name ?? "(Nama Anda)",
      items: items.map((item) => ({
        name: item.name,
        variantName: item.variantName,
        price: item.price,
        quantity: item.quantity,
      })),
      total: totalPrice,
      showPrices: isMember,
    });
    window.open(buildWhatsAppLink(message), "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ct-teal/10 text-ct-teal">
          <ShoppingCart size={28} />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-bold text-ct-blue">
          Keranjang masih kosong
        </h1>
        <p className="mt-2 text-foreground/70">
          Jelajahi katalog dan tambahkan produk yang ingin Anda pesan.
        </p>
        <Link
          href="/katalog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ct-teal px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-ct-teal-dark"
        >
          Lihat Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold text-ct-blue">Keranjang</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-semibold text-foreground/50 transition-colors hover:text-ct-red"
        >
          Kosongkan
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex gap-4 rounded-2xl border border-ct-teal/10 bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ct-cream">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              ) : null}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-heading font-semibold text-foreground">{item.name}</h3>
                {item.variantName ? (
                  <p className="text-sm text-foreground/60">Varian: {item.variantName}</p>
                ) : null}
                {isMember ? (
                  <p className="mt-1 font-semibold text-ct-blue">{formatRupiah(item.price)}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-ct-teal/20 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-ct-blue transition-colors hover:bg-ct-teal/10"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-ct-blue transition-colors hover:bg-ct-teal/10",
                      item.maxQuantity &&
                        item.quantity >= item.maxQuantity &&
                        "cursor-not-allowed opacity-40"
                    )}
                    aria-label="Tambah jumlah"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-ct-red/10 hover:text-ct-red"
                  aria-label="Hapus item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-ct-teal/10 bg-white p-5">
        {isMember ? (
          <div className="flex items-center justify-between text-lg font-bold text-ct-blue">
            <span>Total</span>
            <span>{formatRupiah(totalPrice)}</span>
          </div>
        ) : (
          <p className="text-sm text-foreground/60">
            Harga & total akan dikonfirmasi oleh CT Rangers via WhatsApp.
          </p>
        )}
        <button
          type="button"
          onClick={handleCheckout}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ct-green px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-ct-green/90"
        >
          <MessageCircle size={18} />
          Pesan via WhatsApp
        </button>
      </div>
    </div>
  );
}
