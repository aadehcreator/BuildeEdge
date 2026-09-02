'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Zap, TrendingDown, Package, RotateCcw, Shield, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageGallery from '@/components/product/ImageGallery';
import BulkPriceModal from '@/components/product/BulkPriceModal';
import ProductGrid from '@/components/product/ProductGrid';
import { useCart } from '@/hooks/useCart';
import { CartProduct, getEffectivePrice } from '@/store/cartStore';

interface ProductData {
  id: string; name: string; slug: string; description: string | null;
  images: string[]; mrp: number; sellingPrice: number; unit: string;
  stock: number; cashbackPercent: number; isFeatured: boolean; isNewLaunch: boolean;
  bulkPrices: Array<{ minQty: number; price: number }> | null;
  tags: string[]; specifications: Record<string, string> | null;
  category: { id: string; name: string; slug: string; parent?: { name: string; slug: string } | null };
  brand: { id: string; name: string; slug: string; logo: string | null } | null;
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [related, setRelated] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [specExpanded, setSpecExpanded] = useState(false);
  const { handleAddToCart, handleUpdateQuantity, getItemQuantity } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json() as Promise<{ product: ProductData; related: ProductData[] }>)
      .then(({ product, related }) => { setProduct(product); setRelated(related); })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4"><div className="skeleton h-8 w-3/4 rounded" /><div className="skeleton h-5 w-1/2 rounded" /><div className="skeleton h-24 rounded" /></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-5xl">😢</div>
        <p className="font-semibold text-secondary">Product not found</p>
        <Link href="/" className="btn-primary text-sm">Go Home</Link>
      </div>
    );
  }

  const cartProduct: CartProduct = {
    id: product.id, name: product.name, slug: product.slug, images: product.images,
    mrp: product.mrp, sellingPrice: product.sellingPrice, unit: product.unit,
    stock: product.stock, cashbackPercent: product.cashbackPercent,
    bulkPrices: product.bulkPrices ?? undefined,
  };

  const qty = getItemQuantity(product.id);
  const effectivePrice = getEffectivePrice(cartProduct, qty || 1);
  const discount = Math.round(((product.mrp - effectivePrice) / product.mrp) * 100);
  const nextBulkTier = product.bulkPrices?.find((t) => t.minQty > (qty || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted mb-5 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        {product.category.parent && (
          <><Link href={`/collections/${product.category.parent.slug}`} className="hover:text-primary">{product.category.parent.name}</Link><ChevronRight size={12} /></>
        )}
        <Link href={`/collections/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        <ChevronRight size={12} />
        <span className="text-secondary line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Info */}
        <div>
          {product.brand && (
            <Link href={`/collections?brand=${product.brand.slug}`} className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline">
              {product.brand.name}
            </Link>
          )}
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-secondary mt-1 leading-tight">
            {product.name}
          </h1>
          <p className="text-sm text-muted mt-1">{product.unit}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {discount > 0 && <span className="badge-discount">{discount}% OFF</span>}
            {product.isNewLaunch && <span className="badge-new">NEW LAUNCH</span>}
            {product.isFeatured && <span className="badge bg-purple-100 text-purple-800">FEATURED</span>}
            <span className="badge-cashback">{product.cashbackPercent}% Cashback</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-secondary">₹{effectivePrice.toLocaleString('en-IN')}</span>
            {product.mrp > effectivePrice && (
              <span className="text-lg text-muted line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
            {discount > 0 && <span className="text-green-600 font-semibold text-sm">Save ₹{(product.mrp - effectivePrice).toLocaleString('en-IN')}</span>}
          </div>
          <p className="text-xs text-muted mt-0.5">per {product.unit} (incl. all taxes)</p>

          {/* Bulk pricing */}
          {product.bulkPrices && product.bulkPrices.length > 0 && (
            <button
              onClick={() => setBulkOpen(true)}
              className="mt-3 flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
            >
              <TrendingDown size={14} /> View bulk pricing
              <Zap size={12} />
            </button>
          )}

          {/* Bulk nudge */}
          {nextBulkTier && qty > 0 && (
            <div className="mt-3 p-2.5 bg-orange-50 rounded-lg text-xs text-orange-700 font-medium">
              Add {nextBulkTier.minQty - qty} more → save ₹{(effectivePrice - nextBulkTier.price).toFixed(2)} per item!
            </div>
          )}

          {/* Qty + Add */}
          <div className="mt-5 flex items-center gap-3">
            {qty === 0 ? (
              <button
                onClick={() => handleAddToCart(cartProduct, 1)}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors active:scale-98 disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <div className="flex items-center gap-0 bg-primary rounded-xl overflow-hidden">
                <button onClick={() => handleUpdateQuantity(product.id, qty - 1)} className="px-5 py-3.5 text-white hover:bg-primary-dark transition-colors">
                  <Minus size={18} />
                </button>
                <motion.span key={qty} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-white font-bold text-lg min-w-[40px] text-center">
                  {qty}
                </motion.span>
                <button onClick={() => handleUpdateQuantity(product.id, qty + 1)} disabled={qty >= product.stock} className="px-5 py-3.5 text-white hover:bg-primary-dark transition-colors disabled:opacity-50">
                  <Plus size={18} />
                </button>
              </div>
            )}
          </div>

          {product.stock > 0 && product.stock <= 20 && (
            <p className="text-xs text-red-500 font-medium mt-2">⚠️ Only {product.stock} left in stock</p>
          )}

          {/* USPs */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: Package, text: '60-Min Delivery' },
              { icon: RotateCcw, text: 'Easy Returns' },
              { icon: Shield, text: '100% Genuine' },
            ].map((u) => (
              <div key={u.text} className="flex flex-col items-center gap-1 p-2.5 bg-surface rounded-lg text-center">
                <u.icon size={16} className="text-primary" />
                <span className="text-[10px] font-semibold text-secondary">{u.text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-5">
              <h3 className="font-semibold text-secondary mb-2">About this product</h3>
              <p className="text-sm text-muted leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-5">
              <button
                onClick={() => setSpecExpanded((v) => !v)}
                className="w-full flex items-center justify-between font-semibold text-secondary border-b border-gray-200 pb-2"
              >
                <span>Specifications</span>
                <ChevronRight size={16} className={`transition-transform ${specExpanded ? 'rotate-90' : ''}`} />
              </button>
              {specExpanded && (
                <div className="mt-3 space-y-1.5">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex text-sm">
                      <span className="w-40 flex-shrink-0 text-muted font-medium">{k}</span>
                      <span className="text-secondary">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Link key={tag} href={`/search?q=${tag}`} className="text-xs bg-surface px-2.5 py-1 rounded-full text-muted hover:bg-primary/10 hover:text-primary transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title mb-4">You may also like</h2>
          <ProductGrid products={related} columns={4} />
        </section>
      )}

      {/* Bulk price modal */}
      {product.bulkPrices && product.bulkPrices.length > 0 && (
        <BulkPriceModal
          isOpen={bulkOpen}
          onClose={() => setBulkOpen(false)}
          productName={product.name}
          unit={product.unit}
          sellingPrice={product.sellingPrice}
          mrp={product.mrp}
          bulkPrices={product.bulkPrices}
          currentQty={qty}
        />
      )}
    </div>
  );
}
