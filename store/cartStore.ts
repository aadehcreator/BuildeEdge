'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  unit: string;
  stock: number;
  cashbackPercent: number;
  bulkPrices?: Array<{ minQty: number; price: number }>;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  mergeWithServerCart: (serverItems: CartItem[]) => void;
}

function getEffectivePrice(product: CartProduct, quantity: number): number {
  if (!product.bulkPrices?.length) return product.sellingPrice;
  const sorted = [...product.bulkPrices].sort((a, b) => b.minQty - a.minQty);
  const tier = sorted.find((t) => quantity >= t.minQty);
  return tier ? tier.price : product.sellingPrice;
}

export function calculateCartTotals(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + getEffectivePrice(item.product, item.quantity) * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 500 ? 0 : 49;
  const cashback = items.reduce(
    (sum, item) =>
      sum + (getEffectivePrice(item.product, item.quantity) * item.quantity * item.product.cashbackPercent) / 100,
    0
  );
  const total = subtotal + deliveryFee;
  return { subtotal, deliveryFee, cashback, total };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity: Math.min(quantity, i.product.stock) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      mergeWithServerCart: (serverItems) => {
        set((state) => {
          const merged = [...serverItems];
          state.items.forEach((localItem) => {
            const serverItem = merged.find((s) => s.product.id === localItem.product.id);
            if (!serverItem) merged.push(localItem);
            else serverItem.quantity = Math.max(serverItem.quantity, localItem.quantity);
          });
          return { items: merged };
        });
      },
    }),
    {
      name: 'buildedge-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export { getEffectivePrice };
