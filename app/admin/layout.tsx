'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Grid3X3, Image as ImageIcon, LogOut, Menu, Users, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/vendors', icon: Users, label: 'Vendors (VMS)' },
  { href: '/admin/categories', icon: Grid3X3, label: 'Categories' },
  { href: '/admin/banners', icon: ImageIcon, label: 'Banners' },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { accessToken, logout: storeLogout } = useAuthStore();
  const { clearCart } = useCartStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } });
      }
    } catch { /* silent */ }
    storeLogout(); clearCart();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">BE</div>
          <div>
            <p className="font-heading font-bold text-white text-sm">Build Edge</p>
            <p className="text-[10px] text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
        <div className="pt-2 border-t border-gray-800 mt-2">
          <p className="text-[10px] text-gray-600 px-3 mb-1 uppercase tracking-wider font-semibold">IMS</p>
          <Link href="/admin/inventory" onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname.startsWith('/admin/inventory') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <BarChart3 size={16} /> Inventory (IMS)
          </Link>
        </div>
      </nav>
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          🛒 Go to Shop
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900 flex-shrink-0">
        <Sidebar />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-gray-900 lg:hidden flex flex-col"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="font-heading font-bold text-white text-sm">Admin Panel</span>
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
