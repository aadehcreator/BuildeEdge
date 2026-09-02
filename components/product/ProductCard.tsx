'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Zap } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { CartProduct, getEffectivePrice } from '@/store/cartStore';

interface ProductCardProps {
  product: {
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
    category?: { name: string; slug: string };
    brand?: { name: string } | null;
    isFeatured?: boolean;
    isNewLaunch?: boolean;
  };
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { handleAddToCart, handleUpdateQuantity, getItemQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const qty = getItemQuantity(product.id);

  const cartProduct: CartProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    images: product.images,
    mrp: product.mrp,
    sellingPrice: product.sellingPrice,
    unit: product.unit,
    stock: product.stock,
    cashbackPercent: product.cashbackPercent,
    bulkPrices: product.bulkPrices ?? undefined,
  };

  const effectivePrice = qty > 0 ? getEffectivePrice(cartProduct, qty) : product.sellingPrice;
  const discount = Math.round(((product.mrp - effectivePrice) / product.mrp) * 100);
  const hasBulk = product.bulkPrices && product.bulkPrices.length > 0;
  const nextBulkTier = hasBulk
    ? product.bulkPrices!.find((t) => t.minQty > (qty || 0))
    : null;

  const add = async () => {
    setLoading(true);
    await handleAddToCart(cartProduct, 1);
    setLoading(false);
  };

  return (
    <motion.div
      className={`product-card group flex flex-col ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-t-xl bg-gray-50 aspect-square">
        <Image
          src={product.images[0] ?? 'https://placehold.co/400x400?text=Product'}
          alt={product.name}
          fill
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge-discount">{discount}% OFF</span>
          )}
          {product.isNewLaunch && (
            <span className="badge-new">NEW</span>
          )}
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-t-xl">
            <span className="text-xs font-semibold text-muted">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        {product.brand && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted mb-0.5">
            {product.brand.name}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-secondary line-clamp-2 leading-snug hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted mb-2">{product.unit}</p>

        {/* Bulk price nudge */}
        {nextBulkTier && qty > 0 && (
          <p className="text-[10px] text-primary font-medium mb-1">
            Add {nextBulkTier.minQty - qty} more → ₹{nextBulkTier.price}/{product.unit}
          </p>
        )}
        {hasBulk && qty === 0 && (
          <p className="text-[10px] text-orange-600 font-medium flex items-center gap-0.5 mb-1">
            <Zap size={10} /> Bulk pricing available
          </p>
        )}

        {/* Cashback */}
        <p className="text-[10px] text-green-600 font-medium mb-2">
          {product.cashbackPercent}% cashback
        </p>

        {/* Price row */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-base font-bold text-secondary">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {product.mrp > effectivePrice && (
              <span className="text-xs text-muted line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Add / Stepper */}
          {product.stock === 0 ? (
            <button disabled className="w-full py-2 text-xs font-semibold border border-gray-200 rounded-lg text-muted cursor-not-allowed">
              Out of Stock
            </button>
          ) : qty === 0 ? (
            <button
              onClick={add}
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors active:scale-95 disabled:opacity-60"
            >
              <ShoppingCart size={14} />
              {loading ? 'Adding...' : 'Add'}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-primary rounded-lg overflow-hidden">
              <button
                onClick={() => handleUpdateQuantity(product.id, qty - 1)}
                className="px-3 py-2 text-white hover:bg-primary-dark transition-colors"
              >
                <Minus size={14} />
              </button>
              <motion.span
                key={qty}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-white text-sm font-bold min-w-[24px] text-center"
              >
                {qty}
              </motion.span>
              <button
                onClick={() => handleUpdateQuantity(product.id, qty + 1)}
                disabled={qty >= product.stock}
                className="px-3 py-2 text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
