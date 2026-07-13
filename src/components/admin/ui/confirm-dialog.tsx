"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "primary",
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    if (!loading) {
      onOpenChange(false);
      setError(null);
    }
  }, [loading, onOpenChange]);

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    confirmBtnRef.current?.focus();
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  if (!open) return null;

  const confirmColor =
    variant === "danger"
      ? { bg: "var(--danger)", color: "#fff" }
      : { bg: "var(--brand)", color: "#fff" };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: "var(--z-dialog)" }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--surface-overlay)" }}
        onClick={close}
      />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        className="relative w-full bg-[var(--surface-elevated)] shadow-xl border border-[var(--border)]"
        style={{
          maxWidth: "440px",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
        }}
      >
        <button
          onClick={close}
          disabled={loading}
          className="absolute top-3 right-3 rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] disabled:opacity-40"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>
        <h2 className="font-heading text-lg font-bold text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {description}
        </p>
        {error && (
          <p className="mt-3 rounded-lg px-3 py-2 text-sm font-medium bg-[var(--danger-muted)] text-[var(--danger)]">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={close}
            disabled={loading}
            className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-40"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
            style={{
              backgroundColor: confirmColor.bg,
              color: confirmColor.color,
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
