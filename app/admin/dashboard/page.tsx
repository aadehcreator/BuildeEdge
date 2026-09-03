import { prisma } from '@/lib/prisma';
import { ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders, todayOrders, monthRevenue, totalRevenue,
    pendingOrders, deliveredToday, totalProducts, totalUsers,
    recentOrders, lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.aggregate({ where: { createdAt: { gte: monthStart }, paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.order.count({ where: { status: { in: ['PLACED', 'CONFIRMED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] } } }),
    prisma.order.count({ where: { status: 'DELIVERED', deliveredAt: { gte: todayStart } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' }, take: 8,
      include: { user: { select: { name: true, phone: true } }, items: { select: { productName: true, quantity: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: 10 } },
      select: { name: true, stock: true, sku: true },
      orderBy: { stock: 'asc' }, take: 5,
    }),
  ]);

  return { totalOrders, todayOrders, monthRevenue: monthRevenue._sum.total ?? 0, totalRevenue: totalRevenue._sum.total ?? 0, pendingOrders, deliveredToday, totalProducts, totalUsers, recentOrders, lowStockProducts };
}

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-blue-900/50 text-blue-300',
  CONFIRMED: 'bg-indigo-900/50 text-indigo-300',
  PICKED_UP: 'bg-yellow-900/50 text-yellow-300',
  OUT_FOR_DELIVERY: 'bg-orange-900/50 text-orange-300',
  DELIVERED: 'bg-green-900/50 text-green-300',
  CANCELLED: 'bg-red-900/50 text-red-300',
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  const KPIs = [
    { label: "Today's Orders", value: data.todayOrders, icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-900/30' },
    { label: 'Month Revenue', value: `₹${(data.monthRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-900/30' },
    { label: 'Pending Orders', value: data.pendingOrders, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-900/30' },
    { label: 'Delivered Today', value: data.deliveredToday, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
    { label: 'Total Products', value: data.totalProducts, icon: Package, color: 'text-purple-400', bg: 'bg-purple-900/30' },
    { label: 'Total Customers', value: data.totalUsers, icon: Users, color: 'text-pink-400', bg: 'bg-pink-900/30' },
    { label: 'Total Orders', value: data.totalOrders, icon: ShoppingCart, color: 'text-cyan-400', bg: 'bg-cyan-900/30' },
    { label: 'Lifetime Revenue', value: `₹${(data.totalRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* KPI Cards */}
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

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h2 className="font-semibold text-white text-sm">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-primary hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs">
                  <th className="text-left px-4 py-2 font-medium">Order</th>
                  <th className="text-left px-4 py-2 font-medium">Customer</th>
                  <th className="text-left px-4 py-2 font-medium">Items</th>
                  <th className="text-right px-4 py-2 font-medium">Total</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-300 font-mono text-xs">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-2.5 text-gray-300">{order.user.name ?? order.user.phone}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
                    <td className="px-4 py-2.5 text-white text-right font-semibold">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-700 text-gray-300'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h2 className="font-semibold text-white text-sm">⚠️ Low Stock</h2>
            <a href="/admin/products" className="text-xs text-primary hover:underline">Manage →</a>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">All products well-stocked ✅</div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {data.lowStockProducts.map((p: any) => (
                <li key={p.sku} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-300 font-medium line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-gray-500">SKU: {p.sku}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-900/50 text-red-400' : 'bg-orange-900/50 text-orange-400'}`}>
                    {p.stock === 0 ? 'Out' : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
