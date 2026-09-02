'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useCart } from '@/hooks/useCart';
import CartItemRow from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const { isOpen, items, closeCart } = useCartStore();
  const { totals } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-heading font-bold text-secondary text-lg">
                  Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </h2>
              </div>
              <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
                  <div className="text-6xl">🛒</div>
                  <div>
                    <p className="font-semibold text-secondary mb-1">Your cart is empty</p>
                    <p className="text-sm text-muted">Add construction materials to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-primary text-sm px-6"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <CartItemRow key={item.product.id} item={item} />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-4 space-y-3 bg-white">
                <CartSummary totals={totals} compact />
                <Link href="/checkout" onClick={closeCart}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between bg-primary text-white px-5 py-3.5 rounded-xl font-semibold"
                  >
                    <span>Proceed to Checkout</span>
                    <div className="flex items-center gap-1">
                      <span>₹{totals.total.toLocaleString('en-IN')}</span>
                      <ArrowRight size={16} />
                    </div>
                  </motion.button>
                </Link>
                <p className="text-xs text-center text-green-600 font-medium">
                  {totals.deliveryFee === 0 ? '🎉 You get FREE delivery!' : `Add ₹${(500 - totals.subtotal).toFixed(0)} more for free delivery`}
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
