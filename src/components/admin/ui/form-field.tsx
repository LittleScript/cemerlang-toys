import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col", className)} style={{ gap: "6px" }}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-[var(--text-secondary)]"
      >
        {label}
        {required && (
          <span className="text-[var(--danger)] ml-0.5">*</span>
        )}
      </label>
      {hint && (
        <p className="text-xs text-[var(--text-muted)] -mt-1">{hint}</p>
      )}
      {children}
      {error && (
        <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
