interface Totals { subtotal: number; deliveryFee: number; cashback: number; total: number; }

export default function CartSummary({ totals, compact = false }: { totals: Totals; compact?: boolean }) {
  return (
    <div className={`space-y-1.5 ${compact ? 'text-sm' : 'text-base'}`}>
      <div className="flex justify-between text-muted">
        <span>Subtotal</span>
        <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted">Delivery</span>
        <span className={totals.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
          {totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`}
        </span>
      </div>
      {totals.cashback > 0 && (
        <div className="flex justify-between text-orange-600 text-xs font-medium">
          <span>Cashback (1%)</span>
          <span>+₹{totals.cashback.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between font-bold text-secondary border-t border-gray-100 pt-1.5">
        <span>Total</span>
        <span>₹{totals.total.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
