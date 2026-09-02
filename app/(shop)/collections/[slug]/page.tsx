'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, ChevronDown, X, Loader2 } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';

interface Product {
  id: string; name: string; slug: string; images: string[];
  mrp: number; sellingPrice: number; unit: string; stock: number;
  cashbackPercent: number; bulkPrices: Array<{ minQty: number; price: number }> | null;
  brand: { name: string } | null; isNewLaunch: boolean;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

const SORTS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' },
];

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [categoryName, setCategoryName] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: slug, sort, page: String(page), limit: '20' });
      if (searchParams.get('new')) params.set('new', 'true');
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json() as { products: Product[]; pagination: Pagination };
      setProducts(data.products);
      setPagination(data.pagination);
      if (data.products[0]) {
        // Derive category name from slug
        setCategoryName(slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '));
      }
    } finally {
      setLoading(false);
    }
  }, [slug, sort, page, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 text-xs text-muted">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>›</span>
        <span className="text-secondary">{categoryName}</span>
      </div>
      <h1 className="font-heading font-bold text-2xl text-secondary mb-1">{categoryName}</h1>
      {pagination && <p className="text-sm text-muted mb-4">{pagination.total} products</p>}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-muted" />
          <span className="text-sm text-muted">Sort:</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary bg-white"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <ProductGrid products={products} columns={4} emptyMessage={`No products in ${categoryName} yet`} />

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-surface transition-colors">
                ← Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-muted">...</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-surface'}`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button disabled={page === pagination.pages} onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-surface transition-colors">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
