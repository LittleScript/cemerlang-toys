import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import { cn } from "@/lib/utils";

const AGE_RANGES = [
  { value: "0+", label: "0+ tahun" },
  { value: "1+", label: "1+ tahun" },
  { value: "2+", label: "2+ tahun" },
  { value: "3+", label: "3+ tahun" },
  { value: "4+", label: "4+ tahun" },
  { value: "6+", label: "6+ tahun" },
  { value: "8+", label: "8+ tahun" },
  { value: "10+", label: "10+ tahun" },
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
  activeQuery,
  activeSort,
}: {
  categories: { name: string; slug: string; icon: string | null }[];
  activeCategory?: string;
  activeAge?: string;
  activeStock?: string;
  activeQuery?: string;
  activeSort?: string;
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
      <div className="hidden gap-2 overflow-x-auto pb-2 lg:flex">
        <Link href={buildHref()} className={chipClass(!activeCategory)}>
          Semua
        </Link>
        {categories.map((category) => {
          const params = new URLSearchParams();
          params.set("kategori", category.slug);
          if (activeAge) params.set("usia", activeAge);
          if (activeStock) params.set("stok", activeStock);
          if (activeQuery) params.set("q", activeQuery);
          if (activeSort && activeSort !== "terbaru") params.set("sort", activeSort);

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
        {activeQuery ? <input type="hidden" name="q" value={activeQuery} /> : null}
        <select
          name="kategori"
          defaultValue={activeCategory ?? ""}
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-3 py-2 text-sm text-foreground lg:hidden"
        >
          <option value="">Semua Kategori</option>
          {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
        </select>

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
          name="sort"
          defaultValue={activeSort ?? "terbaru"}
          className="rounded-lg border border-ct-teal/20 bg-white px-3 py-2 text-sm text-foreground"
        >
          <option value="terbaru">Terbaru</option>
          <option value="nama">Nama</option>
          <option value="stok">Ketersediaan</option>
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

  function buildHref() {
    const params = new URLSearchParams();
    if (activeQuery) params.set("q", activeQuery);
    if (activeAge) params.set("usia", activeAge);
    if (activeStock) params.set("stok", activeStock);
    if (activeSort && activeSort !== "terbaru") params.set("sort", activeSort);
    const query = params.toString();
    return `/katalog${query ? `?${query}` : ""}`;
  }
}
