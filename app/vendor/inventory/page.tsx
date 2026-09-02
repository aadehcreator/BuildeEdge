'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import { AlertTriangle, TrendingUp, Package, CheckCircle, Loader2, Plus, Minus, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

interface InventoryProduct {
  id: string; name: string; sku: string; images: string[];
  stock: number; reorderPoint: number; lowStockThreshold: number; unit: string; sellingPrice: number;
}

interface Summary { total: number; outOfStock: number; lowStock: number; reorderNeeded: number; healthy: number; }

interface StockLog {
  id: string; type: string; quantity: number; balanceAfter: number;
  reason: string; note: string | null; createdAt: string;
  product: { name: string; sku: string; unit: string };
}

const TYPE_COLORS: Record<string, string> = {
  STOCK_IN: 'text-green-400 bg-green-900/30',
  STOCK_OUT: 'text-red-400 bg-red-900/30',
  ADJUSTMENT: 'text-blue-400 bg-blue-900/30',
  RETURN: 'text-yellow-400 bg-yellow-900/30',
  DAMAGE: 'text-orange-400 bg-orange-900/30',
};

export default function VendorInventoryPage() {
  const { accessToken } = useAuthStore();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [products, setProducts] = useState<{ outOfStock: InventoryProduct[]; lowStock: InventoryProduct[]; reorderNeeded: InventoryProduct[]; healthy: InventoryProduct[] } | null>(null);
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'adjust' | 'history'>('overview');
  const [adjusting, setAdjusting] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ productId: '', type: 'STOCK_IN', quantity: '', reason: '', note: '' });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [inv, hist] = await Promise.all([
        fetch('/api/vendor/inventory', { headers: { Authorization: `Bearer ${accessToken}` } })
          .then((r) => r.json() as Promise<{ summary: Summary; products: typeof products }>),
        fetch('/api/inventory/history', { headers: { Authorization: `Bearer ${accessToken}` } })
          .then((r) => r.json() as Promise<{ logs: StockLog[] }>),
      ]);
      setSummary(inv.summary);
      setProducts(inv.products);
      setLogs(hist.logs ?? []);
    } finally { setLoading(false); }
  }, [accessToken]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAdjust = async () => {
    if (!adjustForm.productId || !adjustForm.quantity || !adjustForm.reason) {
      toast.error('Fill all fields'); return;
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
      toast.success(`Stock updated: ${data.previousStock} → ${data.newStock} ${adjustForm.type === 'STOCK_IN' ? '↑' : '↓'}`);
      setAdjustForm({ productId: '', type: 'STOCK_IN', quantity: '', reason: '', note: '' });
      fetchAll();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Adjustment failed');
    } finally { setAdjusting(false); }
  };

  const allProducts = products ? [
    ...products.outOfStock, ...products.lowStock,
    ...products.reorderNeeded, ...products.healthy,
  ] : [];

  const inp = 'w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary placeholder-gray-600';

  return (
    <div className="space-y-4">
      <h1 className="font-heading font-bold text-2xl text-white">Inventory Management (IMS)</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Products', value: summary.total, icon: Package, color: 'text-blue-400', bg: 'bg-blue-900/30' },
            { label: 'Out of Stock', value: summary.outOfStock, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/30' },
            { label: 'Low Stock', value: summary.lowStock, icon: Minus, color: 'text-orange-400', bg: 'bg-orange-900/30' },
            { label: 'Reorder Needed', value: summary.reorderNeeded, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
            { label: 'Healthy Stock', value: summary.healthy, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/30' },
          ].map((card) => (
            <div key={card.label} className="bg-gray-900 rounded-xl border border-gray-800 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-500 font-medium leading-tight">{card.label}</span>
                <div className={`w-6 h-6 ${card.bg} rounded-lg flex items-center justify-center`}>
                  <card.icon size={12} className={card.color} />
                </div>
              </div>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {([['overview', 'Stock Overview'], ['adjust', 'Adjust Stock'], ['history', 'History']] as const).map(([tab, label]) => (
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
          {/* Overview Tab */}
          {activeTab === 'overview' && products && (
            <div className="space-y-4">
              {/* Out of Stock */}
              {products.outOfStock.length > 0 && (
                <div className="bg-gray-900 rounded-xl border border-red-900/50 overflow-hidden">
                  <div className="px-4 py-2.5 bg-red-950/50 border-b border-red-900/50 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-400" />
                    <span className="text-red-300 text-sm font-semibold">Out of Stock ({products.outOfStock.length})</span>
                  </div>
                  <ProductTable products={products.outOfStock} onAdjust={(id) => { setAdjustForm((f) => ({ ...f, productId: id })); setActiveTab('adjust'); }} />
                </div>
              )}

              {/* Low Stock */}
              {products.lowStock.length > 0 && (
                <div className="bg-gray-900 rounded-xl border border-orange-900/50 overflow-hidden">
                  <div className="px-4 py-2.5 bg-orange-950/50 border-b border-orange-900/50 flex items-center gap-2">
                    <Minus size={14} className="text-orange-400" />
                    <span className="text-orange-300 text-sm font-semibold">Low Stock ({products.lowStock.length})</span>
                  </div>
                  <ProductTable products={products.lowStock} onAdjust={(id) => { setAdjustForm((f) => ({ ...f, productId: id })); setActiveTab('adjust'); }} />
                </div>
              )}

              {/* Reorder Needed */}
              {products.reorderNeeded.length > 0 && (
                <div className="bg-gray-900 rounded-xl border border-yellow-900/50 overflow-hidden">
                  <div className="px-4 py-2.5 bg-yellow-950/50 border-b border-yellow-900/50 flex items-center gap-2">
                    <TrendingUp size={14} className="text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-semibold">Reorder Needed ({products.reorderNeeded.length})</span>
                  </div>
                  <ProductTable products={products.reorderNeeded} onAdjust={(id) => { setAdjustForm((f) => ({ ...f, productId: id })); setActiveTab('adjust'); }} />
                </div>
              )}

              {/* Healthy */}
              {products.healthy.length > 0 && (
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-800 flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-gray-300 text-sm font-semibold">Healthy Stock ({products.healthy.length})</span>
                  </div>
                  <ProductTable products={products.healthy} onAdjust={(id) => { setAdjustForm((f) => ({ ...f, productId: id })); setActiveTab('adjust'); }} />
                </div>
              )}
            </div>
          )}

          {/* Adjust Stock Tab */}
          {activeTab === 'adjust' && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 max-w-lg space-y-4">
              <h2 className="text-white font-semibold">Stock Adjustment</h2>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Product *</label>
                <select value={adjustForm.productId} onChange={(e) => setAdjustForm((f) => ({ ...f, productId: e.target.value }))} className={inp}>
                  <option value="">Select product</option>
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock} {p.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Adjustment Type *</label>
                <select value={adjustForm.type} onChange={(e) => setAdjustForm((f) => ({ ...f, type: e.target.value }))} className={inp}>
                  <option value="STOCK_IN">Stock In (Purchase/Restock)</option>
                  <option value="ADJUSTMENT">Manual Adjustment</option>
                  <option value="RETURN">Customer Return</option>
                  <option value="DAMAGE">Damage Write-off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quantity *</label>
                  <input type="number" min="1" value={adjustForm.quantity}
                    onChange={(e) => setAdjustForm((f) => ({ ...f, quantity: e.target.value }))}
                    placeholder="0" className={inp} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Reason *</label>
                  <input value={adjustForm.reason}
                    onChange={(e) => setAdjustForm((f) => ({ ...f, reason: e.target.value }))}
                    placeholder="e.g. New purchase" className={inp} />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Note (optional)</label>
                <input value={adjustForm.note}
                  onChange={(e) => setAdjustForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Any additional details" className={inp} />
              </div>

              <button onClick={handleAdjust} disabled={adjusting}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {adjusting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Apply Adjustment
              </button>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                <History size={14} className="text-gray-400" />
                <span className="text-gray-300 text-sm font-semibold">Stock Movement History</span>
              </div>
              {logs.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No stock movements yet</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${TYPE_COLORS[log.type] ?? 'bg-gray-700 text-gray-300'}`}>
                          {log.type.replace('_', ' ')}
                        </span>
                        <div>
                          <p className="text-sm text-gray-200 font-medium line-clamp-1">{log.product.name}</p>
                          <p className="text-xs text-gray-500">{log.reason} · {new Date(log.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${log.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {log.quantity > 0 ? '+' : ''}{log.quantity} {log.product.unit}
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

function ProductTable({ products, onAdjust }: { products: InventoryProduct[]; onAdjust: (id: string) => void }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-t border-gray-800 hover:bg-gray-800/20">
            <td className="px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image src={p.images[0] ?? 'https://placehold.co/32x32?text=?'} alt={p.name} width={32} height={32} className="w-full h-full object-contain p-0.5" />
                </div>
                <div>
                  <p className="text-gray-200 text-xs font-medium line-clamp-1">{p.name}</p>
                  <p className="text-gray-600 text-[10px]">{p.sku}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-2.5 text-center">
              <span className={`text-xs font-bold ${p.stock === 0 ? 'text-red-400' : p.stock <= p.lowStockThreshold ? 'text-orange-400' : 'text-yellow-400'}`}>
                {p.stock} {p.unit}
              </span>
            </td>
            <td className="px-4 py-2.5 text-center text-gray-600 text-xs">
              Reorder: {p.reorderPoint}
            </td>
            <td className="px-4 py-2.5 text-right">
              <button onClick={() => onAdjust(p.id)}
                className="px-2.5 py-1 bg-primary/20 text-primary text-[10px] font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                + Add Stock
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
