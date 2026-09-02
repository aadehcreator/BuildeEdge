import ProductCard from './ProductCard';

interface Product {
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
  isNewLaunch?: boolean;
}

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
}

export default function ProductGrid({ products, columns = 3, emptyMessage = 'No products found' }: ProductGridProps) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-muted font-medium">{emptyMessage}</p>
        <p className="text-sm text-muted mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-3 md:gap-4`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
