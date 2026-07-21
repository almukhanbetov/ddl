'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Product } from '@/lib/data';
import { getProducts } from '@/lib/api';

export type CartItem = { id: string; qty: number };
export type CartDetail = CartItem & { product: Product };

type CartContextValue = {
  items: CartItem[];
  details: CartDetail[];
  count: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = 'ddl_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [productsById, setProductsById] = useState<Record<string, Product>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      // Hydrating from localStorage after mount is intentional: the server has no
      // access to it, so state must start empty and patch in once the client mounts.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Catalog data now lives in the backend; cache it client-side once so the
    // cart can merge item ids (stored in localStorage) with live product info.
    getProducts({ category: 'dishes' })
      .then(({ items: products }) => {
        const map: Record<string, Product> = {};
        for (const p of products) map[p.id] = p;
        setProductsById(map);
      })
      .catch(() => {
        // catalog fetch failing shouldn't crash the cart; it'll just show fewer details
      });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart = (id: string, qty = 1) => {
    const product = productsById[id];
    const max = product?.stock;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + qty, max ?? i.qty + qty) } : i));
      }
      return [...prev, { id, qty: max ? Math.min(qty, max) : qty }];
    });
  };

  const setQty = (id: string, qty: number) => {
    const product = productsById[id];
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, product ? Math.min(qty, product.stock) : qty) } : i))
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const details = useMemo(
    () =>
      items
        .map((i) => ({ ...i, product: productsById[i.id] }))
        .filter((i): i is CartDetail => Boolean(i.product)),
    [items, productsById]
  );

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, details, count, addToCart, setQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
