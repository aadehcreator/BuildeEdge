'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Circle, Loader2, MapPin, Phone } from 'lucide-react';
import LiveTrackingMap from '@/components/home/LiveTrackingMap';

interface OrderItem { productName: string; productImage: string; quantity: number; price: number; unit: string; mrp: number; }
interface OrderDetail {
  id: string; status: string; total: number; subtotal: number; deliveryFee: number; discount: number; cashback: number;
  paymentMethod: string; paymentStatus: string; createdAt: string; deliveredAt: string | null; estimatedAt: string | null;
  notes: string | null; addressSnapshot: Record<string, string>; items: OrderItem[];
}

const STEPS = ['PLACED', 'CONFIRMED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;
const STEP_LABELS: Record<string, string> = {
  PLACED: 'Order Placed', CONFIRMED: 'Confirmed', PICKED_UP: 'Picked Up', OUT_FOR_DELIVERY: 'Out for Delivery', DELIVERED: 'Delivered',
};

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { accessToken, logout } = useAuthStore();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      router.push(`/login?redirect=/account/orders/${id}`);
      return;
    }
    fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        if (r.status === 401) {
          logout();
          router.push(`/login?redirect=/account/orders/${id}`);
          throw new Error('Unauthorized');
        }
        return r.json() as Promise<{ order: OrderDetail }>;
      })
      .then(({ order }) => setOrder(order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, accessToken, logout, router]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>;
  if (!order) return <div className="text-center py-12"><p className="text-muted">Order not found</p><Link href="/account/orders" className="btn-primary text-sm mt-4 inline-block">Back to Orders</Link></div>;

  const stepIdx = order.status === 'CANCELLED' ? -1 : STEPS.indexOf(order.status as typeof STEPS[number]);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-xl text-secondary">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-xs text-muted mt-0.5">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Status timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-secondary mb-4 text-sm">Delivery Progress</h2>
          <div className="flex items-start gap-0">
            {STEPS.map((step, i) => {
              const done = i <= stepIdx;
              const isLast = i === STEPS.length - 1;
              return (
                <div key={step} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${done ? 'bg-primary' : 'bg-gray-200'}`}>
                      {done ? <CheckCircle size={16} className="text-white" /> : <Circle size={14} className="text-gray-400" />}
                    </div>
                    {!isLast && <div className={`flex-1 h-0.5 ${done && i < stepIdx ? 'bg-primary' : 'bg-gray-200'}`} />}
                  </div>
                  <p className={`text-[10px] mt-1.5 text-center font-medium ${done ? 'text-primary' : 'text-muted'}`}>
                    {STEP_LABELS[step]}
                  </p>
                </div>
              );
            })}
          </div>
          {order.estimatedAt && stepIdx < STEPS.length - 1 && (
            <p className="text-xs text-muted text-center mt-3">Estimated delivery: <strong>{new Date(order.estimatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</strong></p>
          )}
        </div>
      )}
      
      <LiveTrackingMap status={order.status} />

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-secondary mb-4 text-sm">Items ({order.items.length})</h2>
        <ul className="space-y-3">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                <Image src={item.productImage || 'https://placehold.co/56x56?text=?'} alt={item.productName} width={56} height={56} className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary line-clamp-2">{item.productName}</p>
                <p className="text-xs text-muted">{item.quantity} × {item.unit}</p>
              </div>
              <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-muted"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span className="text-muted">Delivery</span><span className={order.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Wallet discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold text-secondary border-t pt-1.5"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>
          {order.cashback > 0 && <div className="flex justify-between text-orange-600 text-xs font-medium"><span>Cashback earned</span><span>+₹{order.cashback.toFixed(2)}</span></div>}
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 grid sm:grid-cols-2 gap-5">
        <div>
          <h2 className="font-semibold text-secondary mb-2 text-sm flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> Delivery Address</h2>
          <p className="text-sm text-secondary font-medium">{order.addressSnapshot.label}</p>
          <p className="text-sm text-muted">{order.addressSnapshot.line1}{order.addressSnapshot.line2 ? `, ${order.addressSnapshot.line2}` : ''}</p>
          <p className="text-sm text-muted">{order.addressSnapshot.city} – {order.addressSnapshot.pincode}</p>
        </div>
        <div>
          <h2 className="font-semibold text-secondary mb-2 text-sm">Payment</h2>
          <p className="text-sm text-secondary">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Help */}
      <div className="bg-orange-50 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-secondary">Need help with this order?</p>
          <p className="text-xs text-muted">We&apos;re available 8 AM – 8 PM, all days</p>
        </div>
        <a href="https://wa.me/918109585179" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors">
          <Phone size={14} /> WhatsApp
        </a>
      </div>
    </div>
  );
}
