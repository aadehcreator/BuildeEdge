'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { AlertTriangle, Loader2, Plus, History, CheckCircle, Minus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface AlertProduct {
  id: string; name: string; sku: string; images: string[];
  stock: number; reorderPoint: number; lowStockThreshold: number; unit: string;
  vendor: { businessName: string } | null;
}

interface Summary { total: number; outOfStock: number; critical: number; reorder: number; }

interface StockLog {
  id: string; type: string; quantity: number; balanceAfter: number;
  reason: string; note: string | null; createdAt: string;
  product: { name: string; sku: string; unit: string };
}

const TYPE_COLORS: Record<string, string> = {
  STOCK_IN: 'text-green-400', STOCK_OUT: 'text-red-400',
  ADJUSTMENT: 'text-blue-400', RETURN: 'text-yellow-400', DAMAGE: 'text-orange-400',
};

export default function AdminInventoryPage() {
  const { accessToken } = useAuthStore();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [alerts, setAlerts] = useState<{ outOfStock: AlertProduct[]; critical: AlertProduct[]; reorder: AlertProduct[] } | null>(null);
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'adjust' | 'history'>('alerts');
  const [adjusting, setAdjusting] = useState(false);
  const [allProducts, setAllProducts] = useState<AlertProduct[]>([]);
  const [adjustForm, setAdjustForm] = useState({ productId: '', type: 'STOCK_IN', quantity: '', reason: '', note: '' });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [alertsRes, histRes, productsRes] = await Promise.all([
        fetch('/api/inventory/alerts', { headers: { Authorization: `Bearer ${accessToken}` } })
          .then((r) => r.json() as Promise<{ summary: Summary; alerts: typeof alerts }>),
        fetch('/api/inventory/history', { headers: { Authorization: `Bearer ${accessToken}` } })
          .then((r) => r.json() as Promise<{ logs: StockLog[] }>),
        fetch('/api/admin/products?limit=100', { headers: { Authorization: `Bearer ${accessToken}` } })
          .then((r) => r.json() as Promise<{ products: AlertProduct[] }>),
      ]);
      setSummary(alertsRes.summary);
      setAlerts(alertsRes.alerts);
      setLogs(histRes.logs ?? []);
      setAllProducts(productsRes.products ?? []);
    } finally { setLoading(false); }
  }, [accessToken]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAdjust = async () => {
    if (!adjustForm.productId || !adjustForm.quantity || !adjustForm.reason) {
      toast.error('Fill all required fields'); return;
    }
    setAdjusting(true);
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ ...adjustForm, quantity: Number(adjustForm.quantity) }),
      });
      const data = await res.json() as { success?: boolean; previousStock?: number; newStock?: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      toast.success(`Stock: ${data.previousStock} → ${data.newStock}`);
      setAdjustForm({ productId: '', type: 'STOCK_IN', quantity: '', reason: '', note: '' });
      fetchAll();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Failed'); }
    finally { setAdjusting(false); }
  };

  const inp = 'w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary placeholder-gray-600';

  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-2xl text-white">Inventory Management System (IMS)</h1>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Products', value: summary.total, icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-900/30' },
            { label: 'Out of Stock', value: summary.outOfStock, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/30' },
            { label: 'Critical Low', value: summary.critical, icon: Minus, color: 'text-orange-400', bg: 'bg-orange-900/30' },
            { label: 'Reorder Needed', value: summary.reorder, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
          ].map((c) => (
            <div key={c.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">{c.label}</span>
                <div className={`w-7 h-7 ${c.bg} rounded-lg flex items-center justify-center`}>
                  <c.icon size={14} className={c.color} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {([['alerts', 'Stock Alerts'], ['adjust', 'Adjust Stock'], ['history', 'History']] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Alerts Tab */}
          {activeTab === 'alerts' && alerts && (
            <div className="space-y-4">
              {[
                { title: '🚨 Out of Stock', items: alerts.outOfStock, border: 'border-red-900/50', bg: 'bg-red-950/30' },
                { title: '⚠️ Critical Low Stock', items: alerts.critical, border: 'border-orange-900/50', bg: 'bg-orange-950/30' },
                { title: '📦 Reorder Needed', items: alerts.reorder, border: 'border-yellow-900/50', bg: 'bg-yellow-950/30' },
              ].map(({ title, items, border, bg }) => items.length > 0 && (
                <div key={title} className={`bg-gray-900 rounded-xl border ${border} overflow-hidden`}>
                  <div className={`px-4 py-2.5 ${bg} border-b ${border}`}>
                    <span className="text-sm font-semibold text-white">{title} ({items.length})</span>
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {items.map((p) => (
                        <tr key={p.id} className="border-t border-gray-800/50 hover:bg-gray-800/20">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={p.images[0] ?? 'https://placehold.co/32x32?text=?'} alt={p.name} width={32} height={32} className="w-full h-full object-contain p-0.5" />
                              </div>
                              <div>
                                <p className="text-gray-200 text-xs font-medium line-clamp-1">{p.name}</p>
                                <p className="text-gray-600 text-[10px]">{p.sku} {p.vendor && `· ${p.vendor.businessName}`}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-400' : 'text-orange-400'}`}>
                              {p.stock} {p.unit}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center text-gray-600 text-xs">Reorder: {p.reorderPoint}</td>
                          <td className="px-4 py-2.5 text-right">
                            <button onClick={() => { setAdjustForm((f) => ({ ...f, productId: p.id })); setActiveTab('adjust'); }}
                              className="px-2.5 py-1 bg-primary/20 text-primary text-[10px] font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                              + Restock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              {alerts.outOfStock.length === 0 && alerts.critical.length === 0 && alerts.reorder.length === 0 && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
                  <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                  <p className="text-green-400 font-semibold">All inventory is healthy! ✅</p>
                </div>
              )}
            </div>
          )}

          {/* Adjust Tab */}
          {activeTab === 'adjust' && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 max-w-lg space-y-4">
              <h2 className="text-white font-semibold flex items-center gap-2"><Plus size={16} className="text-primary" /> Stock Adjustment</h2>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Product *</label>
                <select value={adjustForm.productId} onChange={(e) => setAdjustForm((f) => ({ ...f, productId: e.target.value }))} className={inp}>
                  <option value="">Select product</option>
                  {allProducts.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Type *</label>
                <select value={adjustForm.type} onChange={(e) => setAdjustForm((f) => ({ ...f, type: e.target.value }))} className={inp}>
                  <option value="STOCK_IN">Stock In</option>
                  <option value="ADJUSTMENT">Manual Adjustment</option>
                  <option value="RETURN">Customer Return</option>
                  <option value="DAMAGE">Damage Write-off</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quantity *</label>
                  <input type="number" min="1" value={adjustForm.quantity} onChange={(e) => setAdjustForm((f) => ({ ...f, quantity: e.target.value }))} placeholder="0" className={inp} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Reason *</label>
                  <input value={adjustForm.reason} onChange={(e) => setAdjustForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. Purchase" className={inp} />
                </div>
              </div>
              <input value={adjustForm.note} onChange={(e) => setAdjustForm((f) => ({ ...f, note: e.target.value }))} placeholder="Note (optional)" className={inp} />
              <button onClick={handleAdjust} disabled={adjusting}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {adjusting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Apply Adjustment
              </button>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                <History size={14} className="text-gray-400" />
                <span className="text-gray-300 text-sm font-semibold">All Stock Movements</span>
              </div>
              {logs.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No movements yet</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold ${TYPE_COLORS[log.type]}`}>{log.type.replace('_', ' ')}</span>
                        <div>
                          <p className="text-sm text-gray-200 line-clamp-1">{log.product.name}</p>
                          <p className="text-xs text-gray-500">{log.reason} · {new Date(log.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${log.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {log.quantity > 0 ? '+' : ''}{log.quantity}
                        </p>
                        <p className="text-[10px] text-gray-600">Balance: {log.balanceAfter}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
