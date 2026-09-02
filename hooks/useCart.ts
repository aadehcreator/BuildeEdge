'use client';
import { useCartStore, calculateCartTotals, getEffectivePrice } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart, openCart } = useCartStore();
  const { accessToken } = useAuthStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totals = calculateCartTotals(items);

  const handleAddToCart = useCallback(
    async (product: Parameters<typeof addItem>[0], quantity = 1) => {
      addItem(product, quantity);
      toast.success(`${product.name} added to cart`, { icon: '🛒', duration: 2000 });
      openCart();

      // Sync to server if logged in
      if (accessToken) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ productId: product.id, quantity }),
          });
        } catch {
          // Silent fail — local state is source of truth for guests
        }
      }
    },
    [addItem, openCart, accessToken]
  );

  const handleRemoveFromCart = useCallback(
    async (productId: string, productName: string) => {
      removeItem(productId);
      toast.success(`${productName} removed`, { duration: 2000 });

      if (accessToken) {
        try {
          await fetch(`/api/cart?productId=${productId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch {
          // silent
        }
      }
    },
    [removeItem, accessToken]
  );

  const handleUpdateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      updateQuantity(productId, quantity);

      if (accessToken) {
        try {
          await fetch('/api/cart', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ productId, quantity }),
          });
        } catch {
          // silent
        }
      }
    },
    [updateQuantity, accessToken]
  );

  const getItemQuantity = useCallback(
    (productId: string) => items.find((i) => i.product.id === productId)?.quantity ?? 0,
    [items]
  );

  const getEffectivePriceForProduct = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.product.id === productId);
      if (!item) return 0;
      return getEffectivePrice(item.product, item.quantity);
    },
    [items]
  );

  return {
    items,
    totalItems,
    totals,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    getItemQuantity,
    getEffectivePriceForProduct,
    clearCart,
  };
}
