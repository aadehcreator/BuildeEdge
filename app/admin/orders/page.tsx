'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  id: string; status: string; total: number; paymentMethod: string; paymentStatus: string;
  createdAt: string; user: { name: string | null; phone: string };
  items: Array<{ productName: string; quantity: number; price: number }>;
}

const ALL_STATUSES = ['ALL', 'PLACED', 'CONFIRMED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
const NEXT_STATUS: Record<string, string | null> = {
  PLACED: 'CONFIRMED', CONFIRMED: 'PICKED_UP', PICKED_UP: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED', DELIVERED: null, CANCELLED: null,
};
const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-blue-900/50 text-blue-300', CONFIRMED: 'bg-indigo-900/50 text-indigo-300',
  PICKED_UP: 'bg-yellow-900/50 text-yellow-300', OUT_FOR_DELIVERY: 'bg-orange-900/50 text-orange-300',
  DELIVERED: 'bg-green-900/50 text-green-300', CANCELLED: 'bg-red-900/50 text-red-300',
};

export default function AdminOrdersPage() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filter !== 'ALL') params.set('status', filter);
      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json() as { orders: Order[]; pagination: { pages: number } };
      setOrders(data.orders ?? []);
      setTotalPages(data.pagination?.pages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [accessToken, filter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ orderId, status }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Order marked as ${status.replace(/_/g, ' ')}`);
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-2xl text-white">Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-colors ${
              filter === s ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className="text-left px-4 py-3 font-medium">Order ID</th>
                    <th className="text-left px-4 py-3 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 font-medium">Items</th>
                    <th className="text-right px-4 py-3 font-medium">Total</th>
                    <th className="text-left px-4 py-3 font-medium">Payment</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-500">No orders found</td></tr>
                  )}
                  {orders.map((order) => {
                    const nextStatus = NEXT_STATUS[order.status];
                    return (
                      <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                          #{order.id.slice(-8).toUpperCase()}
                          <br />
                          <span className="text-gray-600 text-[10px]">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          <p className="font-medium">{order.user.name ?? '—'}</p>
                          <p className="text-xs text-gray-500">{order.user.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs max-w-[160px]">
                          <p className="line-clamp-1">{order.items[0]?.productName}</p>
                          {order.items.length > 1 && <p className="text-gray-600">+{order.items.length - 1} more</p>}
                        </td>
                        <td className="px-4 py-3 text-white font-semibold text-right">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === 'PAID' ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                            {order.paymentMethod === 'COD' ? 'COD' : order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-700 text-gray-300'}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            {nextStatus && (
                              <button
                                onClick={() => updateStatus(order.id, nextStatus)}
                                disabled={updating === order.id}
                                className="px-2.5 py-1 bg-primary text-white text-[10px] font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-1"
                              >
                                {updating === order.id ? <Loader2 size={10} className="animate-spin" /> : null}
                                → {nextStatus.replace(/_/g, ' ')}
                              </button>
                            )}
                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                              <button
                                onClick={() => updateStatus(order.id, 'CANCELLED')}
                                disabled={updating === order.id}
                                className="px-2.5 py-1 bg-red-900/50 text-red-400 text-[10px] font-semibold rounded-lg hover:bg-red-900 transition-colors disabled:opacity-60"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700">← Prev</button>
              <span className="px-3 py-1.5 text-gray-400 text-sm">Page {page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
