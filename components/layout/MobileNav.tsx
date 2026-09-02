'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/collections', icon: Grid3X3, label: 'Categories' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart', cartBadge: true },
  { href: '/account/orders', icon: User, label: 'Account' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden safe-area-inset-bottom">
      <div className="flex items-stretch h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] relative transition-colors ${
                isActive ? 'text-primary' : 'text-muted'
              }`}
            >
              <div className="relative">
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                {tab.cartBadge && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
