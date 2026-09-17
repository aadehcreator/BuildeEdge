import Image from 'next/image';
import Link from 'next/link';
import { Layers, Building, Shovel, Boxes, Hammer, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface EssentialMaterial {
  id: string;
  name: string;
  nameHindi: string;
  workHindi: string;
  badge: string;
  slug: string;
  image: string;
  icon: any;
  accentBg: string;
  accentText: string;
}

const CORE_MATERIALS: EssentialMaterial[] = [
  {
    id: 'mat-cement',
    name: 'Cement',
    nameHindi: 'Cement',
    workHindi: 'Foundation, masonry and smooth plaster',
    badge: 'Foundation & Plaster',
    slug: 'cement',
    image: '/images/slider/reta1.jpg',
    icon: Layers,
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-800',
  },
  {
    id: 'mat-bricks',
    name: 'Bricks',
    nameHindi: 'Red Bricks',
    workHindi: 'Strong exterior and interior wall construction',
    badge: 'Wall Masonry',
    slug: 'bricks-blocks',
    image: '/images/slider/gitti1.webp',
    icon: Building,
    accentBg: 'bg-red-50',
    accentText: 'text-red-800',
  },
  {
    id: 'mat-sand',
    name: 'Sand',
    nameHindi: 'River Sand',
    workHindi: 'Cement mortar mixing and smooth plastering',
    badge: 'Mortar & Plaster',
    slug: 'sand-aggregates',
    image: '/images/slider/reta.webp',
    icon: Shovel,
    accentBg: 'bg-yellow-50',
    accentText: 'text-yellow-800',
  },
  {
    id: 'mat-aggregate',
    name: 'Aggregate',
    nameHindi: 'Crushed Stone',
    workHindi: 'Concrete mix for foundations, beams and slab casting',
    badge: 'Concrete & Slab',
    slug: 'sand-aggregates',
    image: '/images/slider/gitti.jpg',
    icon: Boxes,
    accentBg: 'bg-slate-100',
    accentText: 'text-slate-800',
  },
  {
    id: 'mat-steel',
    name: 'TMT Steel',
    nameHindi: 'TMT Rebars',
    workHindi: 'Maximum tensile strength for pillars, beams and slabs',
    badge: 'Pillars & Slabs',
    slug: 'steel-tmt',
    image: '/images/slider/tmt.webp',
    icon: Hammer,
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-800',
  },
  {
    id: 'mat-aac',
    name: 'AAC Blocks',
    nameHindi: 'AAC Blocks',
    workHindi: 'Lightweight modern masonry blocks',
    badge: 'Modern Masonry',
    slug: 'bricks-blocks',
    image: '/images/slider/eate.webp',
    icon: Sparkles,
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-800',
  },
];

export default function MaterialGuide() {
  return (
    <section id="construction-materials-guide" className="rounded-2xl bg-gradient-to-b from-orange-50/70 via-white to-white border border-orange-100/80 p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-orange-100/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1.5">
            <span>🏗️ Essential Construction Materials</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-secondary">
            6 Core Pillars of Building Construction
          </h2>
        </div>

        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-secondary hover:text-primary hover:border-primary transition-colors shadow-2xs self-start sm:self-auto"
        >
          View Full Catalog <ArrowRight size={13} />
        </Link>
      </div>

      {/* 6 Core Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {CORE_MATERIALS.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="group relative flex flex-col bg-white rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Card top banner with Image & Badge */}
              <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge top-left */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/95 text-secondary text-[11px] font-bold shadow-xs">
                  <IconComp size={13} className="text-primary" />
                  <span>{item.badge}</span>
                </div>

                {/* Name on image bottom */}
                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <h3 className="font-heading font-bold text-base sm:text-lg leading-tight drop-shadow-xs">
                    {item.name}
                  </h3>
                  <span className="text-[11px] text-orange-200 font-medium">{item.nameHindi}</span>
                </div>
              </div>

              {/* Card Body: Pure 'KAAM' Focus without descriptions */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                {/* Kaam Box */}
                <div className={`p-2.5 rounded-lg border border-gray-100/80 ${item.accentBg}`}>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                    Purpose:
                  </span>
                  <p className={`text-xs font-bold mt-0.5 leading-snug ${item.accentText}`}>
                    {item.workHindi}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Site Delivery</span>
                  </div>
                  <Link
                    href={`/collections/${item.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-2xs"
                  >
                    <span>Order Now</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Comparison & Direct Site Delivery Banner */}
      <div className="mt-5 p-3.5 rounded-xl bg-white border border-orange-200/70 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-primary flex items-center justify-center flex-shrink-0 font-bold">
            🚚
          </div>
          <div>
            <span className="font-bold text-secondary text-sm">Direct Bulk / Trolley Site Delivery Available:</span>
            <p className="text-muted">Cement, bricks, sand, aggregate and steel delivered directly to your construction site within 60 minutes or scheduled timeslots.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
          <a
            href="https://wa.me/918109585179?text=Hello,%20I%20want%20to%20order%20construction%20materials%20in%20bulk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
          >
            <span>💬 WhatsApp Order</span>
          </a>
          <a
            href="tel:+918109585179"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-secondary text-white font-bold hover:bg-secondary/90 transition-colors"
          >
            <span>📞 Call Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}
