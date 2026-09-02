import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

interface Product {
  id: string; name: string; slug: string; images: string[];
  mrp: number; sellingPrice: number; unit: string; stock: number;
  cashbackPercent: number; bulkPrices?: Array<{ minQty: number; price: number }> | null;
  brand?: { name: string } | null; isNewLaunch?: boolean;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">⭐ Featured Products</h2>
        <Link href="/collections" className="text-sm text-primary font-semibold hover:underline">View all →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
