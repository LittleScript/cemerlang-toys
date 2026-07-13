import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "muted" | "brand";

interface StatusBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const vStyle: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: "var(--success-muted)", color: "var(--success)" },
  warning: { bg: "var(--warning-muted)", color: "var(--warning)" },
  danger: { bg: "var(--danger-muted)", color: "var(--danger)" },
  info: { bg: "var(--info-muted)", color: "var(--info)" },
  muted: { bg: "var(--surface-muted)", color: "var(--text-muted)" },
  brand: { bg: "var(--brand-muted)", color: "var(--brand)" },
};

export function StatusBadge({
  children,
  variant = "muted",
  className,
}: StatusBadgeProps) {
  const s = vStyle[variant];
  return (
    <span
      className={cn("inline-flex items-center font-semibold", className)}
      style={{
        backgroundColor: s.bg,
        color: s.color,
        borderRadius: "var(--radius-full)",
        padding: "4px 12px",
        fontSize: "var(--text-xs)",
      }}
    >
      {children}
    </span>
  );
}
