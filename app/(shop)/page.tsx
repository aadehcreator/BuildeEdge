import { prisma } from '@/lib/prisma';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import MaterialGuide from '@/components/home/MaterialGuide';
import CoreMaterialsSection from '@/components/home/CoreMaterialsSection';
import AppDownloadBanner from '@/components/home/AppDownloadBanner';
import { Truck, Clock, Shield, Headphones } from 'lucide-react';

export const dynamic = 'force-dynamic';

const TRUST_BADGES = [
  { icon: Truck, label: '60-Min Delivery', sub: 'In Gwalior' },
  { icon: Clock, label: 'Open 8AM–8PM', sub: 'All days' },
  { icon: Shield, label: '100% Genuine', sub: 'Branded products' },
  { icon: Headphones, label: 'WhatsApp Support', sub: '+91 8109585179' },
];

const CORE_CATEGORY_SLUGS = ['cement', 'steel-tmt', 'bricks-blocks', 'sand-aggregates'];

async function getHomeData() {
  const [banners, allCategories, allProducts] = await Promise.all([
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.category.findMany({
      where: { is_active: true, parent_id: null },
      include: { children: { where: { is_active: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        brand: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Only keep core construction categories on the home screen
  const categories = allCategories.filter((c: any) =>
    CORE_CATEGORY_SLUGS.includes(c.slug)
  );

  // Filter ONLY core construction material products (Cement, Steel, Bricks, Sand, Gitti, AAC)
  const coreProducts = allProducts
    .filter((p: any) => {
      const catSlug = (p.category?.slug || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();

      // Exclude clearly non-core products
      if (
        catSlug.includes('plywood') ||
        catSlug.includes('paint') ||
        catSlug.includes('electrical') ||
        catSlug.includes('plumbing') ||
        catSlug.includes('sanitaryware') ||
        name.includes('plywood') ||
        name.includes('paint') ||
        name.includes('switch') ||
        name.includes('pipe') ||
        name.includes('toilet')
      ) {
        return false;
      }

      return (
        CORE_CATEGORY_SLUGS.includes(catSlug) ||
        name.includes('cement') ||
        name.includes('tmt') ||
        name.includes('sariya') ||
        name.includes('steel') ||
        name.includes('brick') ||
        name.includes('ईंट') ||
        name.includes('aac') ||
        name.includes('sand') ||
        name.includes('ret') ||
        name.includes('aggregate') ||
        name.includes('gitti') ||
        desc.includes('cement') ||
        desc.includes('foundation')
      );
    })
    .map((p: any) => ({
      ...p,
      bulkPrices: p.bulkPrices as Array<{ minQty: number; price: number }> | null,
    }));

  return { banners, categories, coreProducts };
}

export default async function HomePage() {
  const { banners, categories, coreProducts } = await getHomeData();

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

      {/* Core Construction Material & Purpose Guide */}
      <MaterialGuide />

      {/* Core Categories Only */}
      {categories.length > 0 && <CategoryGrid categories={categories} />}

      {/* Core Construction Materials (Interactive Details, Add to Cart & Direct Order) */}
      <CoreMaterialsSection products={coreProducts} />

      {/* App download */}
      <AppDownloadBanner />

      {/* About blurb */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <h2 className="font-heading font-bold text-xl mb-2">HomeRun · मुख्य निर्माण सामग्री साइट डिलीवरी</h2>
        <p className="text-sm text-muted max-w-2xl mx-auto">
          सीमेंट (UltraTech, ACC), सरिया (Tata Tiscon, JSW), अव्वल लाल ईंट, चंबल नदी की रेत, कंक्रीट गिट्टी एवं AAC ब्लॉक्स सीधे आपकी निर्माण साइट पर थोक रेट में उपलब्ध।
        </p>
      </section>
    </div>
  );
}
