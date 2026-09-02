'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';

interface SearchResult {
  id: string; name: string; slug: string; images: string[];
  mrp: number; sellingPrice: number; unit: string; stock: number;
  cashbackPercent: number; bulkPrices: Array<{ minQty: number; price: number }> | null;
  brand?: { name: string } | null; isNewLaunch?: boolean;
  score?: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json() as Promise<{ results: SearchResult[] }>)
      .then(({ results }) => setResults(results))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-muted mb-2">
          <Search size={16} />
          <span className="text-sm">Search results for</span>
        </div>
        <h1 className="font-heading font-bold text-2xl text-secondary">
          &quot;{q}&quot;
        </h1>
        {!loading && (
          <p className="text-sm text-muted mt-1">
            {results.length === 0 ? 'No products found' : `${results.length} product${results.length > 1 ? 's' : ''} found`}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <ProductGrid
          products={results}
          columns={4}
          emptyMessage={`No results for "${q}". Try a different keyword.`}
        />
      )}

      {!q && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={48} className="text-gray-300 mb-4" />
          <p className="font-semibold text-secondary">Search for construction materials</p>
          <p className="text-sm text-muted mt-1">Try searching for cement, plywood, paint, switches...</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
