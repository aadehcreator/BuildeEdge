'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const NAV = [
  { href: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/vendor/orders', icon: ShoppingCart, label: 'My Orders' },
  { href: '/vendor/products', icon: Package, label: 'My Products' },
  { href: '/vendor/inventory', icon: BarChart3, label: 'Inventory (IMS)' },
  { href: '/vendor/profile', icon: User, label: 'Profile' },
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
            <p className="text-[10px] text-orange-400 font-semibold">Vendor Panel</p>
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
      </nav>
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
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

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-gray-900 flex flex-col"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="font-heading font-bold text-white text-sm">Vendor Panel</span>
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
