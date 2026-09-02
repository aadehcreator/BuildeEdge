'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import AddressPicker from '@/components/checkout/AddressPicker';
import PaymentOptions from '@/components/checkout/PaymentOptions';
import OrderSummary from '@/components/checkout/OrderSummary';
import { calculateCartTotals } from '@/store/cartStore';

interface Address { id: string; label: string; line1: string; line2?: string | null; city: string; pincode: string; isDefault: boolean; }

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { user, accessToken } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [useWallet, setUseWallet] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const totals = calculateCartTotals(items);
  const walletBalance = user?.wallet?.balance ?? 0;
  const walletDeduction = useWallet ? Math.min(walletBalance, totals.total) : 0;

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/checkout'); return; }
    if (items.length === 0) { router.push('/'); return; }
    fetchAddresses();
  }, [user, items, router]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/account/addresses', { headers: { Authorization: `Bearer ${accessToken}` } });
      const data = await res.json() as { addresses: Address[] };
      setAddresses(data.addresses ?? []);
      const def = data.addresses?.find((a) => a.isDefault);
      if (def) setSelectedAddress(def.id);
    } catch { /* silent */ }
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    setPlacing(true);

    try {
      // 1. Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ addressId: selectedAddress, paymentMethod, useWallet }),
      });
      const orderData = await orderRes.json() as { orderId?: string; total?: number; error?: string };
      if (!orderRes.ok) throw new Error(orderData.error ?? 'Order creation failed');

      const newOrderId = orderData.orderId!;
      setOrderId(newOrderId);

      if (paymentMethod === 'COD') {
        clearCart();
        setSuccess(true);
        return;
      }

      // 2. Create Razorpay order
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Failed to load payment gateway');

      const payRes = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ orderId: newOrderId }),
      });
      const payData = await payRes.json() as { razorpayOrderId?: string; amount?: number; currency?: string; key?: string; error?: string };
      if (!payRes.ok) throw new Error(payData.error ?? 'Payment init failed');

      // 3. Open Razorpay
      const rzp = new window.Razorpay({
        key: payData.key,
        amount: payData.amount,
        currency: payData.currency,
        order_id: payData.razorpayOrderId,
        name: 'Build Edge',
        description: 'Construction Materials Order',
        prefill: { name: user?.name ?? '', contact: user?.phone ?? '' },
        theme: { color: '#E87722' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ ...response, orderId: newOrderId }),
          });
          if (verifyRes.ok) {
            clearCart();
            setSuccess(true);
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => { setPlacing(false); toast.error('Payment cancelled'); } },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-heading font-bold text-2xl text-secondary mb-2">Order Placed! 🎉</h1>
        <p className="text-muted mb-1">Your order will be delivered in <strong>60 minutes</strong>.</p>
        {orderId && <p className="text-xs text-muted mb-6">Order ID: #{orderId.slice(-8).toUpperCase()}</p>}
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push(`/account/orders/${orderId}`)} className="btn-primary">Track Order</button>
          <button onClick={() => router.push('/')} className="btn-secondary">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-heading font-bold text-2xl text-secondary mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Address + Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <section className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-heading font-bold text-secondary mb-4">📍 Delivery Address</h2>
            <AddressPicker addresses={addresses} selectedId={selectedAddress} onSelect={setSelectedAddress} onRefresh={fetchAddresses} />
          </section>

          {/* Payment */}
          <section className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-heading font-bold text-secondary mb-4">💳 Payment Method</h2>
            <PaymentOptions
              selected={paymentMethod}
              onChange={setPaymentMethod}
              walletBalance={walletBalance}
              useWallet={useWallet}
              onWalletToggle={setUseWallet}
            />
          </section>
        </div>

        {/* Right — Order Summary + Place */}
        <div className="space-y-4">
          <OrderSummary items={items} walletDeduction={walletDeduction} />

          <button
            onClick={placeOrder}
            disabled={placing || !selectedAddress}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {placing ? (
              <><Loader2 size={20} className="animate-spin" /> Placing Order...</>
            ) : (
              <>Place Order — ₹{(totals.total - walletDeduction).toLocaleString('en-IN')}</>
            )}
          </button>

          <p className="text-xs text-muted text-center">
            By placing your order, you agree to our <a href="/terms" className="text-primary hover:underline">Terms</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
