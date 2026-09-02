import Image from 'next/image';
import { CartItem } from '@/store/cartStore';
import { getEffectivePrice } from '@/store/cartStore';
import CartSummary from '@/components/cart/CartSummary';
import { calculateCartTotals } from '@/store/cartStore';

interface OrderSummaryProps { items: CartItem[]; walletDeduction?: number; }

export default function OrderSummary({ items, walletDeduction = 0 }: OrderSummaryProps) {
  const totals = calculateCartTotals(items);
  const adjustedTotal = { ...totals, total: totals.total - walletDeduction, discount: walletDeduction };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-heading font-bold text-secondary mb-4">Order Summary ({items.length} items)</h3>

      <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item) => {
          const price = getEffectivePrice(item.product, item.quantity);
          return (
            <li key={item.product.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                <Image
                  src={item.product.images[0] ?? 'https://placehold.co/48x48?text=?'}
                  alt={item.product.name}
                  width={48} height={48}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-muted">{item.quantity} × {item.product.unit}</p>
              </div>
              <p className="text-sm font-semibold flex-shrink-0">₹{(price * item.quantity).toLocaleString('en-IN')}</p>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
        <CartSummary totals={adjustedTotal} />
        {walletDeduction > 0 && (
          <div className="flex justify-between text-green-600 font-medium text-xs">
            <span>Wallet discount</span>
            <span>-₹{walletDeduction.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 p-2.5 bg-orange-50 rounded-lg text-xs text-orange-700 font-medium text-center">
        🎁 You earn ₹{totals.cashback.toFixed(2)} cashback on this order!
      </div>
    </div>
  );
}
