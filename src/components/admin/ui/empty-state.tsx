import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-12 text-center"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      {Icon && (
        <Icon size={40} className="text-[var(--text-muted)] mb-3" />
      )}
      <p className="font-heading font-semibold text-[var(--text-primary)]">
        {title}
      </p>
      {description && (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {description}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
