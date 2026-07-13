import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value?: number | string;
  loading?: boolean;
  href?: string;
  trend?: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantAccent: Record<string, string> = {
  default: "var(--brand)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export function StatCard({
  label,
  value,
  loading,
  href,
  trend,
  icon: Icon,
  variant = "default",
  className,
}: StatCardProps) {
  const accent = variantAccent[variant];
  const content = (
    <div
      className={cn(
        "rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition-all",
        !loading && href && "hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
        className
      )}
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        {Icon && <Icon size={20} style={{ color: accent }} />}
      </div>
      {loading ? (
        <div className="mt-1 space-y-1">
          <div className="animate-pulse rounded h-8 w-16 bg-[var(--surface-muted)]" />
          <div className="animate-pulse rounded h-3 w-24 bg-[var(--surface-muted)]" />
        </div>
      ) : (
        <>
          <p className="mt-1 font-heading font-bold text-[var(--text-3xl)] text-[var(--text-primary)]">
            {value ?? "-"}
          </p>
          {trend && (
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{trend}</p>
          )}
        </>
      )}
    </div>
  );
  if (href && !loading) return <Link href={href}>{content}</Link>;
  return content;
}
