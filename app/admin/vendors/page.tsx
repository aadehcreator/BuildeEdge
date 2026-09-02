'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Loader2, Check, X, Eye, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface Vendor {
  id: string; businessName: string; businessType: string; status: string;
  commissionPct: number; totalSales: number; totalOrders: number;
  phone: string; email: string; city: string; pincode: string;
  gstin: string | null; createdAt: string;
  user: { phone: string; email: string | null; createdAt: string };
  _count: { products: number; vendorOrders: number };
}

const STATUS_TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-900/50 text-yellow-300',
  APPROVED: 'bg-green-900/50 text-green-300',
  REJECTED: 'bg-red-900/50 text-red-300',
  SUSPENDED: 'bg-orange-900/50 text-orange-300',
};

export default function AdminVendorsPage() {
  const { accessToken } = useAuthStore();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [commission, setCommission] = useState('');

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.set('status', filter);
      const res = await fetch(`/api/admin/vendors?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json() as { vendors: Vendor[] };
      setVendors(data.vendors ?? []);
    } finally { setLoading(false); }
  }, [accessToken, filter]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const updateVendor = async (vendorId: string, payload: { status?: string; commissionPct?: number }) => {
    setUpdating(vendorId);
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ vendorId, ...payload }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      toast.success(data.message ?? 'Updated!');
      setSelectedVendor(null);
      fetchVendors();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Vendors (VMS)</h1>
          <p className="text-gray-500 text-xs mt-0.5">Approve, reject, and manage vendor accounts</p>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-bold text-primary">{vendors.length}</p>
          <p className="text-[10px] text-gray-500">Total Vendors</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {STATUS_TABS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-primary" /></div>
      ) : vendors.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <p className="text-gray-400">No vendors found</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-gray-800">
                  <th className="text-left px-4 py-3 font-medium">Business</th>
                  <th className="text-left px-4 py-3 font-medium">Contact</th>
                  <th className="text-center px-4 py-3 font-medium">Products</th>
                  <th className="text-center px-4 py-3 font-medium">Orders</th>
                  <th className="text-center px-4 py-3 font-medium">Commission</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-gray-200 font-semibold text-sm">{vendor.businessName}</p>
                      <p className="text-gray-500 text-xs">{vendor.businessType} · {vendor.city}</p>
                      {vendor.gstin && <p className="text-gray-600 text-[10px] font-mono">{vendor.gstin}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-300 text-xs">{vendor.phone}</p>
                      <p className="text-gray-500 text-xs">{vendor.email}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-300 text-sm font-semibold">{vendor._count.products}</td>
                    <td className="px-4 py-3 text-center text-gray-300 text-sm font-semibold">{vendor._count.vendorOrders}</td>
                    <td className="px-4 py-3 text-center text-primary font-bold text-sm">{vendor.commissionPct}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${STATUS_COLORS[vendor.status] ?? 'bg-gray-700 text-gray-300'}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {vendor.status === 'PENDING' && (
                          <>
                            <button onClick={() => updateVendor(vendor.id, { status: 'APPROVED' })} disabled={updating === vendor.id}
                              className="p-1.5 rounded-lg bg-green-900/50 text-green-400 hover:bg-green-900 transition-colors" title="Approve">
                              <Check size={12} />
                            </button>
                            <button onClick={() => updateVendor(vendor.id, { status: 'REJECTED' })} disabled={updating === vendor.id}
                              className="p-1.5 rounded-lg bg-red-900/50 text-red-400 hover:bg-red-900 transition-colors" title="Reject">
                              <X size={12} />
                            </button>
                          </>
                        )}
                        {vendor.status === 'APPROVED' && (
                          <button onClick={() => updateVendor(vendor.id, { status: 'SUSPENDED' })} disabled={updating === vendor.id}
                            className="p-1.5 rounded-lg bg-orange-900/50 text-orange-400 hover:bg-orange-900 transition-colors" title="Suspend">
                            <X size={12} />
                          </button>
                        )}
                        {(vendor.status === 'SUSPENDED' || vendor.status === 'REJECTED') && (
                          <button onClick={() => updateVendor(vendor.id, { status: 'APPROVED' })} disabled={updating === vendor.id}
                            className="p-1.5 rounded-lg bg-green-900/50 text-green-400 hover:bg-green-900 transition-colors" title="Re-approve">
                            <Check size={12} />
                          </button>
                        )}
                        <button onClick={() => { setSelectedVendor(vendor); setCommission(String(vendor.commissionPct)); }}
                          className="p-1.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors" title="Edit commission">
                          <Settings size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Commission Edit Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedVendor(null)}>
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-white mb-4">Edit Commission — {selectedVendor.businessName}</h3>
            <label className="block text-xs text-gray-400 mb-1">Commission % (Admin earns this)</label>
            <input type="number" min="0" max="50" value={commission} onChange={(e) => setCommission(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary mb-4" />
            <div className="flex gap-2">
              <button onClick={() => updateVendor(selectedVendor.id, { commissionPct: Number(commission) })} disabled={updating === selectedVendor.id}
                className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
                {updating === selectedVendor.id ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setSelectedVendor(null)} className="flex-1 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
