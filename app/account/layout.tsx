'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, MapPin, Wallet, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

const NAV = [
  { href: '/account/orders', icon: Package, label: 'My Orders' },
  { href: '/account/addresses', icon: MapPin, label: 'Addresses' },
  { href: '/account/wallet', icon: Wallet, label: 'Wallet & Cashback' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6 flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
              <span className="font-semibold text-sm">My Account</span>
            </div>
            <nav className="space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname.startsWith(item.href) ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surface hover:text-secondary'
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
