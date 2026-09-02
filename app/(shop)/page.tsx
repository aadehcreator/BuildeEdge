import { prisma } from '@/lib/prisma';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewLaunches from '@/components/home/NewLaunches';
import AppDownloadBanner from '@/components/home/AppDownloadBanner';
import { Truck, Clock, Shield, Headphones } from 'lucide-react';

export const dynamic = 'force-dynamic';

const TRUST_BADGES = [
  { icon: Truck, label: '60-Min Delivery', sub: 'In Gwalior' },
  { icon: Clock, label: 'Open 8AM–8PM', sub: 'All days' },
  { icon: Shield, label: '100% Genuine', sub: 'Branded products' },
  { icon: Headphones, label: 'WhatsApp Support', sub: '+91 8109585179' },
];

async function getHomeData() {
  const [banners, categories, featuredProducts, newProducts] = await Promise.all([
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: { children: { where: { isActive: true } } },
      orderBy: { sortOrder: 'asc' },
      take: 12,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { brand: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isActive: true, isNewLaunch: true },
      include: { brand: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);
  return { banners, categories, featuredProducts, newProducts };
}

export default async function HomePage() {
  const { banners, categories, featuredProducts, newProducts } = await getHomeData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      {/* Hero */}
      <HeroBanner banners={banners} />

      {/* Trust badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TRUST_BADGES.map((b) => (
          <div key={b.label} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <b.icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-secondary leading-tight">{b.label}</p>
              <p className="text-[10px] text-muted">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      {categories.length > 0 && <CategoryGrid categories={categories} />}

      {/* Featured products */}
      {featuredProducts.length > 0 && <FeaturedProducts products={featuredProducts} />}

      {/* New launches */}
      {newProducts.length > 0 && <NewLaunches products={newProducts} />}

      {/* App download */}
      <AppDownloadBanner />

      {/* About blurb */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <h2 className="font-heading font-bold text-xl mb-2">Gwalior&apos;s #1 Construction Materials Platform</h2>
        <p className="text-sm text-muted max-w-2xl mx-auto">
          Build Edge brings the hardware store to your doorstep — in 60 minutes. Cement, plywood, paint, electrical, plumbing, tools &amp; more from brands you trust. Serving contractors, builders, and homeowners across Gwalior since 2024.
        </p>
      </section>
    </div>
  );
}
