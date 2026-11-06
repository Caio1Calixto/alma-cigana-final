'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MAX_QTY = 10;

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, qty: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.slug === item.slug
                  ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + qty) }
                  : i,
              ),
            };
          }
          return {
            isOpen: true,
            items: [...state.items, { ...item, quantity: Math.min(MAX_QTY, qty) }],
          };
        }),
      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      setQuantity: (slug, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.slug !== slug)
              : state.items.map((i) =>
                  i.slug === slug ? { ...i, quantity: Math.min(MAX_QTY, qty) } : i,
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'alma-cigana-cart' },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return Math.round(items.reduce((acc, i) => acc + i.price * i.quantity, 0) * 100) / 100;
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.quantity, 0);
}
