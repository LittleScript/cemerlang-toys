"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  variantId?: string;
  variantName?: string;
  price: number;
  unit?: string;
  imageUrl?: string | null;
  quantity: number;
  maxQuantity?: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "key" | "quantity">, quantity: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ct_cart_v1";

function cartItemKey(productId: string, variantId?: string) {
  return `${productId}:${variantId ?? "base"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore invalid cart data
    }
    setHydrated(true);

    // Cross-tab sync (L-10): listen for storage events from other tabs
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        try {
          if (e.newValue) setItems(JSON.parse(e.newValue));
          else setItems([]);
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, quantity) => {
    const key = cartItemKey(item.productId, item.variantId);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        const nextQuantity = existing.maxQuantity
          ? Math.min(existing.quantity + quantity, existing.maxQuantity)
          : existing.quantity + quantity;
        return prev.map((i) => (i.key === key ? { ...i, quantity: nextQuantity } : i));
      }
      const initialQuantity = item.maxQuantity ? Math.min(quantity, item.maxQuantity) : quantity;
      return [...prev, { ...item, key, quantity: initialQuantity }];
    });
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (key, quantity) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.key === key
            ? { ...i, quantity: i.maxQuantity ? Math.min(quantity, i.maxQuantity) : quantity }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem: CartContextValue["removeItem"] = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
