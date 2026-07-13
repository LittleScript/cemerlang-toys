"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type SubmitVariant = "primary" | "secondary" | "danger" | "ghost";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pendingLabel?: ReactNode;
  variant?: SubmitVariant;
}

const variantClasses: Record<SubmitVariant, string> = {
  primary:
    "bg-[var(--brand)] text-[var(--text-on-brand)] hover:bg-[var(--brand-hover)]",
  secondary:
    "border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
  danger: "bg-[var(--danger)] text-white hover:opacity-90",
  ghost: "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
};

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      aria-busy={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {pending ? (
        pendingLabel ?? <Loader2 size={16} className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
