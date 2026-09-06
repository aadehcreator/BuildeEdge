'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layers, Building, Shovel, Boxes, Hammer, Sparkles, PhoneCall, MessageSquare, CheckCircle2 } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';

export interface CoreProduct {
  id: string;
  name: string;
  slug: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  unit: string;
  stock: number;
  cashbackPercent: number;
  bulkPrices?: Array<{ minQty: number; price: number }> | null;
  brand?: { name: string } | null;
  category?: { name: string; slug: string } | null;
  isNewLaunch?: boolean;
}

interface CoreMaterialsSectionProps {
  products: CoreProduct[];
}

const FILTER_TABS = [
  { id: 'all', label: 'सभी कोर सामग्री', labelEn: 'All Core Materials', icon: Sparkles },
  { id: 'cement', label: 'सीमेंट', labelEn: 'Cement', icon: Layers },
  { id: 'bricks-blocks', label: 'ईंट & AAC ब्लॉक्स', labelEn: 'Bricks & AAC', icon: Building },
  { id: 'sand', label: 'रेत / बजरी', labelEn: 'Sand / Ret', icon: Shovel },
  { id: 'aggregate', label: 'गिट्टी / रोड़ी', labelEn: 'Aggregate / Gitti', icon: Boxes },
  { id: 'steel-tmt', label: 'सरिया / TMT Steel', labelEn: 'TMT Steel', icon: Hammer },
];

export default function CoreMaterialsSection({ products }: CoreMaterialsSectionProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products;

    return products.filter((p) => {
      const catSlug = p.category?.slug?.toLowerCase() || '';
      const name = p.name.toLowerCase();

      if (activeTab === 'cement') {
        return catSlug.includes('cement') || name.includes('cement');
      }
      if (activeTab === 'bricks-blocks') {
        return catSlug.includes('bricks') || name.includes('brick') || name.includes('aac') || name.includes('ईंट');
      }
      if (activeTab === 'sand') {
        return name.includes('sand') || name.includes('ret') || name.includes('बजरी');
      }
      if (activeTab === 'aggregate') {
        return name.includes('aggregate') || name.includes('gitti') || name.includes('गिट्टी') || name.includes('रोड़ी');
      }
      if (activeTab === 'steel-tmt') {
        return catSlug.includes('steel') || name.includes('tmt') || name.includes('steel') || name.includes('सरिया');
      }
      return true;
    });
  }, [products, activeTab]);

  return (
    <section id="core-materials-products" className="space-y-4">
      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <span>🏗️ मुख्य निर्माण सामग्री स्टोर</span>
            <span>•</span>
            <span>सीधा साइट ऑर्डर &amp; कार्ट</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-secondary">
            कोर निर्माण सामग्री — अभी ऑर्डर करें &amp; कार्ट में जोड़ें
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            सीमेंट, ईंट, रेत, गिट्टी, सरिया और AAC ब्लॉक्स — 100% असली व प्रमाणित, ग्वालियर में 60-मिनट या शेड्यूल्ड साइट डिलीवरी।
          </p>
        </div>

        {/* Bulk Site Assistance */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="https://wa.me/918109585179?text=Namaste%20HomeRun,%20I%20want%20bulk%20construction%20materials%20for%20my%20site."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
          >
            <MessageSquare size={13} />
            <span>व्हाट्सएप कोटेशन</span>
          </a>
          <a
            href="tel:+918109585179"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-secondary hover:text-primary hover:border-primary transition-colors shadow-2xs"
          >
            <PhoneCall size={13} />
            <span>कॉल: 8109585179</span>
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FILTER_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white text-secondary border border-gray-200 hover:border-primary/50 hover:bg-orange-50/50'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-primary'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm font-semibold text-secondary mb-2">इस कैटेगरी में सामग्री उपलब्ध नहीं है</p>
          <button
            onClick={() => setActiveTab('all')}
            className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg"
          >
            सभी कोर सामग्री देखें
          </button>
        </div>
      )}

      {/* Site Delivery & Quality Trust Footnote */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3.5 border border-orange-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-secondary font-medium">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>
            <strong>थोक / ट्रॉली डिलीवरी:</strong> रेत और गिट्टी 100 Cu.Ft ट्रॉली में तथा सीमेंट/सरिया साइट पर सीधे उतारे जाते हैं।
          </span>
        </div>
        <Link
          href="/collections"
          className="text-primary font-bold hover:underline inline-flex items-center gap-1 shrink-0 ml-auto"
        >
          <span>पूरी निर्माण सूची देखें</span> →
        </Link>
      </div>
    </section>
  );
}
