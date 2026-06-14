"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pendingLabel?: ReactNode;
}

export function SubmitButton({ children, pendingLabel, className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(className, pending && "opacity-60 cursor-wait")}
      {...props}
    >
      {pending ? pendingLabel ?? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}
