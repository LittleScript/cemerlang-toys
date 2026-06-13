import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";

export function CategoryCard({
  name,
  slug,
  icon,
}: {
  name: string;
  slug: string;
  icon?: string | null;
}) {
  return (
    <Link
      href={`/katalog?kategori=${slug}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-ct-teal/10 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ct-teal/10 text-ct-teal-dark transition-colors group-hover:bg-ct-orange/10 group-hover:text-ct-orange-dark">
        <CategoryIcon name={icon} size={28} />
      </span>
      <span className="text-sm font-semibold text-foreground">{name}</span>
    </Link>
  );
}
