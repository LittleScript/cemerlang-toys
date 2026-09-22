"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE = 3;
const MAX_QUEUE = 5;
const DISMISS_MS = 4000;

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const queueRef = useRef<ToastItem[]>([]);
  const idRef = useRef(0);
  const dismissToastRef = useRef<(id: number) => void>(() => undefined);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (queueRef.current.length > 0 && next.length < MAX_VISIBLE) {
        const queued = queueRef.current.shift()!;
        // Auto-dismiss the dequeued toast
        setTimeout(() => dismissToastRef.current(queued.id), DISMISS_MS);
        return [...next, queued];
      }
      return next;
    });
  }, []);

  useEffect(() => {
    dismissToastRef.current = dismissToast;
  }, [dismissToast]);

  const scheduleDismiss = useCallback((id: number) => {
    setTimeout(() => dismissToast(id), DISMISS_MS);
  }, [dismissToast]);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = ++idRef.current;
    const item: ToastItem = { id, message, variant };

    setToasts((prev) => {
      if (prev.length < MAX_VISIBLE) {
        scheduleDismiss(id);
        return [...prev, item];
      }
      // Queue: max 5, drop oldest queued if full
      if (queueRef.current.length >= MAX_QUEUE) {
        queueRef.current.shift();
      }
      queueRef.current.push(item);
      return prev;
    });
  }, [scheduleDismiss]);

  const variantStyles: Record<ToastVariant, { bg: string; color: string }> = {
    success: { bg: 'var(--success-muted)', color: 'var(--success)' },
    error:   { bg: 'var(--danger-muted)',  color: 'var(--danger)' },
    info:    { bg: 'var(--info-muted)',    color: 'var(--info)' },
  };

  return (
    <ToastContext.Provider
      value={{
        toast: {
          success: (m) => addToast(m, "success"),
          error: (m) => addToast(m, "error"),
          info: (m) => addToast(m, "info"),
        },
      }}
    >
      {children}
      <div
        aria-live="polite"
        className="fixed right-4 flex flex-col gap-2"
        style={{
          top: 'calc(var(--topbar-height) + 16px)',
          right: '16px',
          zIndex: 'var(--z-toast)',
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const s = variantStyles[t.variant];
            return (
              <motion.div
                key={t.id}
                role="status"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg max-w-sm"
                style={{
                  backgroundColor: s.bg,
                  color: s.color,
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span className="flex-1">{t.message}</span>
                <button
                  onClick={() => dismissToast(t.id)}
                  className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: s.color }}
                  aria-label="Tutup notifikasi"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
