'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { Product } from '@/lib/data';
import { getProductDetail } from '@/lib/api';

export type CartItem = { id: string; qty: number };
export type CartDetail = CartItem & { product: Product };
/** A position whose product isn't available to show: still loading, deleted, or failed to load. */
export type CartUnresolved = CartItem & { state: 'loading' | 'missing' | 'error' };

type CartContextValue = {
  items: CartItem[];
  details: CartDetail[];
  unresolved: CartUnresolved[];
  retryLoad: (id: string) => void;
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
  const [loadState, setLoadState] = useState<Record<string, 'missing' | 'error'>>({});
  const inFlight = useRef(new Set<string>());

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

  // Load every cart position by its id, whatever category it belongs to.
  useEffect(() => {
    for (const { id } of items) {
      if (productsById[id] || loadState[id] || inFlight.current.has(id)) continue;
      inFlight.current.add(id);
      getProductDetail(id)
        .then((data) => {
          if (!data) {
            setLoadState((prev) => ({ ...prev, [id]: 'missing' }));
            return;
          }
          const { product } = data;
          setProductsById((prev) => ({ ...prev, [id]: product }));
          // Quantities picked before the stock was known may exceed it.
          setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(i.qty, product.stock)) } : i))
          );
        })
        .catch(() => setLoadState((prev) => ({ ...prev, [id]: 'error' })))
        .finally(() => inFlight.current.delete(id));
    }
  }, [items, productsById, loadState]);

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

  const unresolved = useMemo(
    () => items.filter((i) => !productsById[i.id]).map((i): CartUnresolved => ({ ...i, state: loadState[i.id] ?? 'loading' })),
    [items, productsById, loadState]
  );

  const retryLoad = (id: string) => {
    setLoadState((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, details, unresolved, retryLoad, count, addToCart, setQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
