'use client';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCart } from '@/hooks/useCart';
import CartItemRow from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import ProductGrid from '@/components/product/ProductGrid';

export default function CartPage() {
  const { items } = useCartStore();
  const { totals } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-heading font-bold text-2xl text-secondary mb-6">
        Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="font-heading font-bold text-xl text-secondary mb-2">Your cart is empty</h2>
          <p className="text-muted mb-6">Add construction materials to get started</p>
          <Link href="/" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-50">
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </ul>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-heading font-bold text-secondary mb-4">Order Summary</h2>
              <CartSummary totals={totals} />

              <Link href="/checkout">
                <button className="w-full mt-4 flex items-center justify-between bg-primary text-white px-5 py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
                  <span>Checkout</span>
                  <div className="flex items-center gap-1">
                    <span>₹{totals.total.toLocaleString('en-IN')}</span>
                    <ArrowRight size={16} />
                  </div>
                </button>
              </Link>

              <p className="text-xs text-center mt-3 text-green-600 font-medium">
                {totals.deliveryFee === 0
                  ? '🎉 You qualify for FREE delivery!'
                  : `Add ₹${(500 - totals.subtotal).toFixed(0)} more for free delivery`}
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-sm">
              <p className="font-semibold text-secondary mb-1">⚡ 60-Minute Delivery</p>
              <p className="text-xs text-muted">Order before 7 PM for guaranteed same-day delivery in Gwalior.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
