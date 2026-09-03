'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface Order {
  id: string; status: string; total: number; paymentMethod: string;
  paymentStatus: string; createdAt: string;
  items: Array<{ productName: string; productImage: string; quantity: number; price: number; unit: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-indigo-100 text-indigo-700',
  PICKED_UP: 'bg-yellow-100 text-yellow-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function OrdersContent() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    
    fetch('/api/orders', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json() as Promise<{ orders: Order[] }>)
      .then(({ orders }) => setOrders(orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-heading font-bold text-2xl text-secondary mb-6">My Orders</h1>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="font-semibold text-secondary">No orders yet</p>
          <p className="text-sm text-muted mt-1">Your orders will appear here</p>
          <Link href="/" className="btn-primary text-sm mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-card transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <ChevronRight size={16} className="text-muted" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <Image src={item.productImage || 'https://placehold.co/48x48?text=?'} alt={item.productName} width={48} height={48} className="w-full h-full object-contain p-1" />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-muted">+{order.items.length - 3}</div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                  <span className="font-bold text-secondary">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
    return (
        <ProtectedRoute>
            <OrdersContent />
        </ProtectedRoute>
    );
}
