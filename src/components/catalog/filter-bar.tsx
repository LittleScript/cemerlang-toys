import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";

const AGE_RANGES = [
  { value: "0-2", label: "0-2 tahun" },
  { value: "3-5", label: "3-5 tahun" },
  { value: "6-8", label: "6-8 tahun" },
  { value: "9-12", label: "9-12 tahun" },
  { value: "12+", label: "12+ tahun" },
];

const STOCK_OPTIONS = [
  { value: "", label: "Semua Stok" },
  { value: "IN_STOCK", label: "Tersedia" },
  { value: "OUT_OF_STOCK", label: "Stok Habis" },
];

export function FilterBar({
  categories,
  activeCategory,
  activeAge,
  activeStock,
}: {
  categories: { name: string; slug: string; icon: string | null }[];
  activeCategory?: string;
  activeAge?: string;
  activeStock?: string;
}) {
  const chipClass = (active: boolean) =>
    cn(
      "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      active
        ? "border-ct-teal bg-ct-teal text-white"
        : "border-ct-teal/20 text-foreground/70 hover:border-ct-teal"
    );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Link href="/katalog" className={chipClass(!activeCategory)}>
          Semua
        </Link>
        {categories.map((category) => {
          const params = new URLSearchParams();
          params.set("kategori", category.slug);
          if (activeAge) params.set("usia", activeAge);
          if (activeStock) params.set("stok", activeStock);

          return (
            <Link
              key={category.slug}
              href={`/katalog?${params.toString()}`}
              className={chipClass(activeCategory === category.slug)}
            >
              <CategoryIcon name={category.icon} size={16} />
              {category.name}
            </Link>
          );
        })}
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        {activeCategory ? (
          <input type="hidden" name="kategori" value={activeCategory} />
        ) : null}

        <select
          name="usia"
          defaultValue={activeAge ?? ""}
          className="rounded-lg border border-ct-teal/20 bg-white px-3 py-2 text-sm text-foreground"
        >
          <option value="">Semua Usia</option>
          {AGE_RANGES.map((age) => (
            <option key={age.value} value={age.value}>
              {age.label}
            </option>
          ))}
        </select>

        <select
          name="stok"
          defaultValue={activeStock ?? ""}
          className="rounded-lg border border-ct-teal/20 bg-white px-3 py-2 text-sm text-foreground"
        >
          {STOCK_OPTIONS.map((stock) => (
            <option key={stock.value} value={stock.value}>
              {stock.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg bg-ct-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ct-orange-dark"
        >
          Terapkan
        </button>
      </form>
    </div>
  );
}
