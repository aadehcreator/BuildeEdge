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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 lg:gap-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 font-heading font-bold text-xl text-secondary">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">BE</div>
              <span className="hidden sm:block">Build Edge</span>
            </Link>

            {/* Location */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">⚡ 60 Mins</span>
              <button onClick={openPincodeModal} className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors">
                <MapPin size={14} className="text-primary" />
                <span className="font-medium">{pincode ?? 'Set pincode'}</span>
                <ChevronDown size={12} />
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-0">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a href="https://wa.me/918109585179" target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors">
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
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            <button onClick={openPincodeModal} className="flex items-center gap-2 text-sm py-2 w-full">
              <MapPin size={14} className="text-primary" />
              <span>Deliver to: <strong>{pincode ?? 'Set pincode'}</strong></span>
            </button>
            <a href="https://wa.me/918109585179" className="flex items-center gap-2 text-sm py-2 text-green-600">
              <Phone size={14} /> WhatsApp Support
            </a>
            <Link href="/become-vendor" className="flex items-center gap-2 text-sm py-2 text-orange-600">
              <Store size={14} /> Become a Vendor
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
