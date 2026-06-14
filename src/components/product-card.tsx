import Image from "next/image";
import Link from "next/link";
import { ProductCardQuickAdd } from "./product-card-quick-add";

export function ProductCard({
  productId,
  slug,
  name,
  categoryName,
  imageUrl,
  price,
  discountPrice,
  stockStatus,
}: {
  productId: string;
  slug: string;
  name: string;
  categoryName: string;
  imageUrl?: string | null;
  price?: number | null;
  discountPrice?: number | null;
  stockStatus: string;
}) {
  const outOfStock = stockStatus === "OUT_OF_STOCK";
  const cartPrice = discountPrice ?? price ?? 0;

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
          ) : null}

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
        </div>
      </Link>

      {!outOfStock ? (
        <div className="px-4 pb-4">
          <ProductCardQuickAdd
            productId={productId}
            slug={slug}
            name={name}
            imageUrl={imageUrl}
            price={cartPrice}
          />
        </div>
      ) : null}
    </div>
  );
}
