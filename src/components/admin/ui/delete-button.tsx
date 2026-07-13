"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  /** Server action to call on confirm */
  onDelete: () => Promise<void>;
  /** What is being deleted (e.g. "Produk", "Kategori") */
  itemLabel: string;
  /** Description shown in the dialog */
  description?: string;
  /** Button size variant */
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export function DeleteButton({
  onDelete,
  itemLabel,
  description,
  size = "md",
  className,
  ariaLabel,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);

  const sizeClass = size === "sm" ? "p-1.5" : "p-2";
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-full text-[var(--text-muted)] hover:bg-[var(--danger-muted)] hover:text-[var(--danger)] transition-colors",
          sizeClass,
          className
        )}
        aria-label={ariaLabel ?? `Hapus ${itemLabel}`}
      >
        <Trash2 size={iconSize} />
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Hapus ${itemLabel}?`}
        description={
          description ??
          `${itemLabel} ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`
        }
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={onDelete}
      />
    </>
  );
}
