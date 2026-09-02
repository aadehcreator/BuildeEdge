'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

interface VendorData {
  id: string; businessName: string; status: string; commissionPct: number;
  totalSales: number; totalOrders: number; rating: number;
  _count: { products: number; vendorOrders: number };
}

interface InventorySummary {
  total: number; outOfStock: number; lowStock: number; reorderNeeded: number; healthy: number;
}

export default function VendorDashboard() {
  const { accessToken, user } = useAuthStore();
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [inventory, setInventory] = useState<InventorySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    Promise.all([
      fetch('/api/vendor/register', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((r) => r.json() as Promise<{ vendor: VendorData | null }>),
      fetch('/api/vendor/inventory', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((r) => r.json() as Promise<{ summary: InventorySummary }>),
    ]).then(([vendorData, invData]) => {
      setVendor(vendorData.vendor);
      setInventory(invData.summary);
    }).finally(() => setLoading(false));
  }, [accessToken, user, router]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary" /></div>;

  // Not registered yet
  if (!vendor) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-primary" />
        </div>
        <h1 className="font-heading font-bold text-2xl text-white mb-2">Become a Vendor</h1>
        <p className="text-gray-400 mb-6">Register your business to sell on Build Edge and reach thousands of contractors in Gwalior.</p>
        <Link href="/vendor/profile" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
          Register Your Business <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Pending approval
  if (vendor.status === 'PENDING') {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="font-heading font-bold text-2xl text-white mb-2">Application Under Review</h1>
        <p className="text-gray-400 mb-2">Your vendor application for <strong className="text-white">{vendor.businessName}</strong> is being reviewed.</p>
        <p className="text-gray-500 text-sm">Admin will approve within 24-48 hours. You will be notified.</p>
      </div>
    );
  }

  if (vendor.status === 'REJECTED') {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="font-heading font-bold text-2xl text-white mb-2">Application Rejected</h1>
        <p className="text-gray-400 mb-6">Contact support at adeshrajak890@gmail.com for more details.</p>
      </div>
    );
  }

  const KPIs = [
    { label: 'Total Products', value: vendor._count.products, icon: Package, color: 'text-blue-400', bg: 'bg-blue-900/30' },
    { label: 'Total Orders', value: vendor._count.vendorOrders, icon: ShoppingCart, color: 'text-green-400', bg: 'bg-green-900/30' },
    { label: 'Total Sales', value: `₹${(vendor.totalSales / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-900/30' },
    { label: 'Low Stock Items', value: (inventory?.lowStock ?? 0) + (inventory?.outOfStock ?? 0), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">{vendor.businessName}</h1>
          <p className="text-gray-400 text-sm mt-0.5">Commission: {vendor.commissionPct}% · Rating: {vendor.rating > 0 ? `⭐ ${vendor.rating.toFixed(1)}` : 'Not rated yet'}</p>
        </div>
        <span className="bg-green-900/50 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full">✓ APPROVED</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KPIs.map((kpi) => (
          <div key={kpi.label} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">{kpi.label}</span>
              <div className={`w-7 h-7 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                <kpi.icon size={14} className={kpi.color} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Inventory Alerts */}
      {inventory && (inventory.outOfStock > 0 || inventory.lowStock > 0) && (
        <div className="bg-red-950/50 border border-red-900 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" />
              <p className="text-red-300 font-semibold text-sm">Inventory Alert!</p>
            </div>
            <Link href="/vendor/inventory" className="text-xs text-red-400 hover:underline">View →</Link>
          </div>
          <div className="flex gap-4 mt-2">
            {inventory.outOfStock > 0 && (
              <p className="text-xs text-red-400">{inventory.outOfStock} items <strong>Out of Stock</strong></p>
            )}
            {inventory.lowStock > 0 && (
              <p className="text-xs text-orange-400">{inventory.lowStock} items <strong>Low Stock</strong></p>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { href: '/vendor/products', label: 'Add New Product', icon: '➕', desc: 'List a new product for sale' },
          { href: '/vendor/orders', label: 'View Orders', icon: '📦', desc: 'Check and update order status' },
          { href: '/vendor/inventory', label: 'Manage Stock', icon: '📊', desc: 'Update stock levels' },
        ].map((action) => (
          <Link key={action.href} href={action.href}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-primary hover:bg-gray-800 transition-all group">
            <span className="text-2xl">{action.icon}</span>
            <p className="text-white font-semibold text-sm mt-2 group-hover:text-primary transition-colors">{action.label}</p>
            <p className="text-gray-500 text-xs mt-0.5">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
