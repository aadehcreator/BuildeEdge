'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, MapPin, User, Menu, Phone, ChevronDown, LogOut, Package, Settings, Store } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import SearchBar from '@/components/search/SearchBar';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { items, openCart } = useCartStore();
  const { user, accessToken, logout: storeLogout } = useAuthStore();
  const { clearCart } = useCartStore();
  const { pincode, openPincodeModal } = useLocationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch { /* silent */ }
    storeLogout();
    clearCart();
    setUserMenuOpen(false);
    toast.success('Logged out!');
    router.push('/');
  };

  return (
    <>
      <div className="bg-primary text-white text-center text-xs font-medium py-2 px-4">
        🏗️ Open 8 AM to 8 PM · Free delivery above ₹500 · Gwalior&apos;s #1 construction store
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Location */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <Link href="/" className="flex-shrink-0 flex items-center gap-2 font-heading font-bold text-xl text-secondary">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">HR</div>
                <span className="tracking-tight">Home<span className="text-amber-600">Run</span></span>
              </Link>

              {/* Location & Speed */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  ⚡ 60 Mins
                </span>
                <button onClick={openPincodeModal} className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors font-medium">
                  <MapPin size={13} className="text-primary flex-shrink-0" />
                  <span className="max-w-[85px] truncate">{pincode ?? 'Set pincode'}</span>
                  <ChevronDown size={11} className="flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6 min-w-[200px]">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <a href="https://wa.me/918109585179" target="_blank" rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-surface">
                <Phone size={14} />
                <span>Help</span>
              </a>

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={14} className="text-primary" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium max-w-[80px] truncate">
                      {user.name ?? user.phone}
                    </span>
                    <ChevronDown size={12} className="text-muted" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold truncate">{user.name ?? 'My Account'}</p>
                        <p className="text-xs text-muted">+91 {user.phone}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'VENDOR' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{user.role}</span>
                      </div>

                      <Link href="/account/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-surface transition-colors">
                        <Package size={14} /> My Orders
                      </Link>
                      <Link href="/account/wallet" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-surface transition-colors">
                        💳 Wallet & Cashback
                      </Link>
                      <Link href="/account/addresses" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-surface transition-colors">
                        <MapPin size={14} /> Addresses
                      </Link>

                      {/* Vendor Panel */}
                      {(user.role === 'VENDOR' || user.role === 'ADMIN') && (
                        <Link href="/vendor/dashboard" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-surface text-orange-600 font-semibold border-t border-gray-100">
                          <Store size={14} /> Vendor Panel
                        </Link>
                      )}

                      {/* Admin Panel */}
                      {user.role === 'ADMIN' && (
                        <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-surface text-purple-600 font-semibold">
                          <Settings size={14} /> Admin Panel
                        </Link>
                      )}

                      {/* Become Vendor */}
                      {user.role === 'CUSTOMER' && (
                        <Link href="/become-vendor" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-orange-50 text-orange-600 border-t border-gray-100">
                          <Store size={14} /> Become a Vendor
                        </Link>
                      )}

                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors border-t border-gray-100">
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
                  <User size={14} />
                  <span>Login</span>
                </Link>
              )}

              {/* Cart */}
              <button onClick={openCart}
                className="relative flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                <ShoppingCart size={18} />
                <span className="hidden sm:block text-sm font-semibold">Cart</span>
                {totalItems > 0 && (
                  <motion.span key={totalItems} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu button */}
              <button className="lg:hidden p-2 rounded-lg hover:bg-surface" onClick={() => setMobileMenuOpen((v) => !v)}>
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (dedicated row, never overlaps login or cart) */}
          <div className="md:hidden pt-2 pb-0.5">
            <SearchBar />
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="border-t border-gray-100 bg-white shadow-xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2 text-xs sm:text-sm font-medium text-gray-700 no-scrollbar whitespace-nowrap">
               {[
                { name: 'Cement', href: '/collections/cement' },
                { name: 'Bricks', href: '/collections/bricks-blocks' },
                { name: 'Sand', href: '/collections/sand-aggregates' },
                { name: 'Aggregate', href: '/collections/sand-aggregates' },
                { name: 'TMT Steel', href: '/collections/steel-tmt' },
                { name: 'AAC Blocks', href: '/collections/bricks-blocks' },
                { name: 'Plywood', href: '/collections/plywood-boards' },
                { name: 'Paints', href: '/collections/paints-primers' },
                { name: 'Plumbing', href: '/collections/plumbing-pipes' },
                { name: 'Electricals', href: '/collections/electrical-wires' },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-orange-50 font-semibold shrink-0"
                >
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2.5">
            <button onClick={openPincodeModal} className="flex items-center gap-2 text-sm py-1.5 w-full">
              <MapPin size={14} className="text-primary" />
              <span>Deliver to: <strong>{pincode ?? 'Set pincode'}</strong></span>
            </button>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-bold uppercase text-muted mb-2">Core Materials:</p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <Link href="/collections/cement" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-primary font-semibold">
                  <span>Cement</span>
                </Link>
                <Link href="/collections/bricks-blocks" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-primary font-semibold">
                  <span>Bricks</span>
                </Link>
                <Link href="/collections/sand-aggregates" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-primary font-semibold">
                  <span>Sand</span>
                </Link>
                <Link href="/collections/sand-aggregates" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-primary font-semibold">
                  <span>Aggregate</span>
                </Link>
                <Link href="/collections/steel-tmt" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-primary font-semibold">
                  <span>TMT Steel</span>
                </Link>
                <Link href="/collections/bricks-blocks" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-gray-50 hover:bg-orange-50 hover:text-primary font-semibold">
                  <span>AAC Blocks</span>
                </Link>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <a href="https://wa.me/918109585179" className="flex items-center gap-2 text-sm py-1.5 text-green-600 font-medium">
                <Phone size={14} /> WhatsApp Support
              </a>
              <Link href="/become-vendor" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm py-1.5 text-orange-600 font-medium">
                <Store size={14} /> Become a Vendor
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
