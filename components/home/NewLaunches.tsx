import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

interface Product {
  id: string; name: string; slug: string; images: string[];
  mrp: number; sellingPrice: number; unit: string; stock: number;
  cashbackPercent: number; bulkPrices?: Array<{ minQty: number; price: number }> | null;
  brand?: { name: string } | null; isNewLaunch?: boolean;
}

export default function NewLaunches({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">🆕 New Launches</h2>
        <Link href="/collections?new=true" className="text-sm text-primary font-semibold hover:underline">See all →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {products.map((p) => (
          <div key={p.id} className="flex-shrink-0 w-44 sm:w-52">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
