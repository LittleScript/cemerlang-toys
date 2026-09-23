import Image from "next/image";
import Link from "next/link";
import { ProductCardQuickAdd } from "./product-card-quick-add";
import { formatRupiah } from "@/lib/utils";

export function ProductCard({
  productId,
  slug,
  name,
  categoryName,
  imageUrl,
  stockStatus,
  variantCount = 0,
  packageLevel,
  price,
  priceBasis,
}: {
  productId: string;
  slug: string;
  name: string;
  categoryName: string;
  imageUrl?: string | null;
  stockStatus: string;
  variantCount?: number;
  packageLevel?: {
    label: string;
    contentQuantity: number | null;
    contentUnit: string | null;
    minimumOrderQuantity: number | null;
  };
  price?: number | null;
  priceBasis?: string | null;
}) {
  const outOfStock = stockStatus === "OUT_OF_STOCK";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ct-teal/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <Link href={`/produk/${slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-ct-cream">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-foreground/45">
              Gambar belum tersedia
            </div>
          )}

          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${
              outOfStock ? "bg-ct-red" : "bg-ct-green"
            }`}
          >
            {outOfStock ? "Stok Habis" : "Tersedia"}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4 pb-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ct-teal-dark">
            {categoryName}
          </span>
          <h3 className="font-heading font-semibold text-foreground">{name}</h3>
          <div className="mt-1 space-y-0.5 text-xs text-foreground/60">
            {packageLevel ? (
              <p>
                {packageLevel.label}
                {packageLevel.contentQuantity && packageLevel.contentUnit
                  ? ` · isi ${packageLevel.contentQuantity} ${packageLevel.contentUnit}`
                  : ""}
              </p>
            ) : null}
            {packageLevel?.minimumOrderQuantity ? (
              <p>Minimum {packageLevel.minimumOrderQuantity} {packageLevel.label}</p>
            ) : null}
            {variantCount > 0 ? <p>{variantCount} pilihan varian</p> : null}
            {price != null ? (
              <p className="pt-1 text-sm font-semibold text-ct-blue">
                {formatRupiah(price)}{priceBasis ? ` / ${priceBasis}` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </Link>

      {!outOfStock && variantCount === 0 ? (
        <div className="px-4 pb-4">
          <ProductCardQuickAdd
            productId={productId}
            slug={slug}
            name={name}
            imageUrl={imageUrl}
            unit={packageLevel?.label}
            availability="Tersedia"
            packageSummary={packageLevel ? `${packageLevel.label}${packageLevel.contentQuantity && packageLevel.contentUnit ? `: ${packageLevel.contentQuantity} ${packageLevel.contentUnit}` : ""}${packageLevel.minimumOrderQuantity ? ` (min. ${packageLevel.minimumOrderQuantity} ${packageLevel.label})` : ""}` : undefined}
            price={price}
            priceBasis={priceBasis}
          />
        </div>
      ) : (
        <div className="px-4 pb-4">
          <Link href={`/produk/${slug}`} className="block rounded-full border border-ct-teal/30 px-3 py-2 text-center text-xs font-semibold text-ct-teal-dark">
            {outOfStock ? "Tanyakan ke Sales" : "Pilih detail produk"}
          </Link>
        </div>
      )}
    </div>
  );
}
