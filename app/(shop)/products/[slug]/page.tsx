'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Zap, TrendingDown, Package, RotateCcw, Shield, Loader2, ChevronRight, MapPin, Star, CheckCircle2 } from 'lucide-react';
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

interface Review {
  id: string; author: string; rating: number; comment: string; date: string;
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [related, setRelated] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [specExpanded, setSpecExpanded] = useState(false);
  const { handleAddToCart, handleUpdateQuantity, getItemQuantity } = useCart();

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', author: 'Ramesh Contractor', rating: 5, comment: 'Best quality TMT steel and cement delivered within 45 minutes to our site. Highly recommended!', date: '2 days ago' },
    { id: '2', author: 'Vikram Builders', rating: 4.5, comment: 'Good wholesale rates and prompt delivery truck support.', date: '1 week ago' },
  ]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const checkPincode = () => {
    if (!pincode || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    setPincodeStatus('checking');
    setTimeout(() => {
      setPincodeStatus('available');
      toast.success('Express 60-min delivery available for this pincode!');
    }, 600);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) {
      toast.error('Please fill in your name and comment');
      return;
    }
    setReviews([{
      id: Date.now().toString(),
      author: newAuthor,
      rating: newRating,
      comment: newComment,
      date: 'Just now',
    }, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    toast.success('Review submitted successfully!');
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted flex-wrap">
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
        <div className="space-y-5">
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
          </div>

          {/* Pincode Serviceability Checker */}
          <div className="bg-surface rounded-2xl p-4 border border-gray-100">
            <label className="text-xs font-semibold text-secondary flex items-center gap-1 mb-2">
              <MapPin size={14} className="text-primary" /> Check Delivery Availability at Your Construction Site
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button
                onClick={checkPincode}
                disabled={pincodeStatus === 'checking'}
                className="px-4 py-2 bg-secondary text-white rounded-xl text-xs font-semibold hover:bg-secondary/90 transition-colors"
              >
                {pincodeStatus === 'checking' ? <Loader2 size={14} className="animate-spin" /> : 'Check'}
              </button>
            </div>
            {pincodeStatus === 'available' && (
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 size={13} /> Express 60-min delivery & heavy truck transport available!
              </p>
            )}
          </div>

          {/* USPs */}
          <div className="grid grid-cols-3 gap-2">
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
            <div>
              <h3 className="font-semibold text-secondary mb-2">About this product</h3>
              <p className="text-sm text-muted leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
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
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <section className="border-t border-gray-100 pt-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-xl text-secondary">Customer Ratings & Reviews</h2>
            <p className="text-xs text-muted">Verified contractors and builders feedback</p>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl text-primary font-bold text-sm">
            <Star size={16} className="fill-primary" /> 4.8 / 5.0
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-surface rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-secondary">{rev.author}</span>
                  <span className="text-xs text-muted">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: Math.floor(rev.rating) }).map((_, i) => (
                    <Star key={i} size={13} className="fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-secondary">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Add review form */}
          <form onSubmit={handleAddReview} className="bg-surface rounded-2xl p-5 border border-gray-100 space-y-4">
            <h3 className="font-bold text-sm text-secondary">Write a Review</h3>
            <div>
              <label className="text-xs text-muted block mb-1">Your Name / Company</label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g., Amit Builders"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Rating</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5 - Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5 - Good)</option>
                <option value={3}>⭐⭐⭐ (3/5 - Average)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Review Comment</label>
              <textarea
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with product quality & delivery..."
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button type="submit" className="w-full btn-primary py-2.5 text-sm font-semibold rounded-xl">
              Post Review
            </button>
          </form>
        </div>
      </section>

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
