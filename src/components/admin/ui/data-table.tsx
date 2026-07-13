import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/admin/ui/search-input";
import { EmptyState } from "@/components/admin/ui/empty-state";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface Pagination {
  page: number;
  totalPages: number;
  pageHref: (page: number) => string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchDefaultValue?: string;
  searchAction?: string;
  pagination?: Pagination;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField = "id" as keyof T,
  searchable,
  searchPlaceholder,
  searchDefaultValue,
  searchAction,
  pagination,
  onRowClick,
  emptyState,
  loading,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <SearchInput
          placeholder={searchPlaceholder ?? "Cari..."}
          defaultValue={searchDefaultValue}
          action={searchAction}
        />
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg h-14 bg-[var(--surface-muted)]"
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        emptyState ?? <EmptyState title="Tidak ada data." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface-muted)]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-left font-semibold text-[var(--text-secondary)] whitespace-nowrap",
                        col.className
                      )}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={String(row[keyField])}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-t border-[var(--border)] transition-colors",
                      onRowClick && "cursor-pointer",
                      i % 2 === 1 && "bg-[var(--surface-muted)]"
                    )}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "var(--brand-muted)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        i % 2 === 1 ? "var(--surface-muted)" : "";
                    }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-[var(--text-primary)]",
                          col.className
                        )}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-1">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((p) => (
                <Link
                  key={p}
                  href={pagination.pageHref(p)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    p === pagination.page
                      ? "text-white bg-[var(--brand)]"
                      : "text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-[var(--brand-muted)]"
                  )}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
