'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VendorOrder {
  id: string; subtotal: number; vendorEarning: number; commission: number; status: string; createdAt: string;
  order: { id: string; paymentMethod: string; addressSnapshot: Record<string, string>; user: { name: string | null; phone: string }; };
  items: Array<{ productName: string; quantity: number; price: number; unit: string; productImage: string }>;
}

const STATUS_TABS = ['ALL', 'PENDING', 'ACCEPTED', 'PACKED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-900/50 text-yellow-300',
  ACCEPTED: 'bg-blue-900/50 text-blue-300',
  PACKED: 'bg-indigo-900/50 text-indigo-300',
  DISPATCHED: 'bg-orange-900/50 text-orange-300',
  DELIVERED: 'bg-green-900/50 text-green-300',
  CANCELLED: 'bg-red-900/50 text-red-300',
};
const NEXT_STATUS: Record<string, string | null> = {
  PENDING: 'ACCEPTED', ACCEPTED: 'PACKED', PACKED: 'DISPATCHED',
  DISPATCHED: 'DELIVERED', DELIVERED: null, CANCELLED: null,
};

export default function VendorOrdersPage() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.set('status', filter);
      const res = await fetch(`/api/vendor/orders?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json() as { vendorOrders: VendorOrder[] };
      setOrders(data.vendorOrders ?? []);
    } finally { setLoading(false); }
  }, [accessToken, filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (vendorOrderId: string, status: string) => {
    setUpdating(vendorOrderId);
    try {
      const res = await fetch('/api/vendor/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ vendorOrderId, status }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Order marked as ${status.toLowerCase()}`);
      fetchOrders();
    } catch { toast.error('Failed to update'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-2xl text-white">My Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {STATUS_TABS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <p className="text-gray-400 text-4xl mb-3">📦</p>
          <p className="text-gray-400 font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const nextStatus = NEXT_STATUS[order.status];
            const addr = order.order.addressSnapshot;
            return (
              <div key={order.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">Order #{order.order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[order.status] ?? 'bg-gray-700 text-gray-300'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Customer */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Customer: <span className="text-white font-medium">{order.order.user.name ?? 'Customer'}</span></p>
                    <p className="text-xs text-gray-500">{order.order.user.phone}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{addr?.line1}, {addr?.city} – {addr?.pincode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Your Earning</p>
                    <p className="text-green-400 font-bold text-sm">₹{order.vendorEarning.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-600">Commission: ₹{order.commission.toFixed(2)}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 line-clamp-1">{item.productName}</span>
                      <span className="text-gray-300 flex-shrink-0 ml-2">{item.quantity} × ₹{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-800">
                  {nextStatus && (
                    <button onClick={() => updateStatus(order.id, nextStatus)} disabled={updating === order.id}
                      className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-1">
                      {updating === order.id && <Loader2 size={10} className="animate-spin" />}
                      Mark as {nextStatus}
                    </button>
                  )}
                  {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <button onClick={() => updateStatus(order.id, 'CANCELLED')} disabled={updating === order.id}
                      className="px-3 py-1.5 bg-red-900/50 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-900 transition-colors disabled:opacity-60">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
