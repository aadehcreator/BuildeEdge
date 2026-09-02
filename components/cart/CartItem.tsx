'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartItem } from '@/store/cartStore';
import { useCart } from '@/hooks/useCart';
import { getEffectivePrice } from '@/store/cartStore';

interface CartItemRowProps { item: CartItem; }

export default function CartItemRow({ item }: CartItemRowProps) {
  const { handleRemoveFromCart, handleUpdateQuantity } = useCart();
  const { product, quantity } = item;
  const effectivePrice = getEffectivePrice(product, quantity);
  const lineTotal = effectivePrice * quantity;
  const hasBulkSavings = effectivePrice < product.sellingPrice;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 p-4"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
          <Image
            src={product.images[0] ?? 'https://placehold.co/64x64?text=?'}
            alt={product.name}
            width={64}
            height={64}
            className="w-full h-full object-contain p-1"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.slug}`}>
          <p className="text-sm font-semibold text-secondary line-clamp-2 hover:text-primary transition-colors leading-snug">
            {product.name}
          </p>
        </Link>
        <p className="text-xs text-muted mt-0.5">{product.unit}</p>

        {hasBulkSavings && (
          <p className="text-[10px] text-green-600 font-medium mt-0.5">Bulk price applied!</p>
        )}

        {/* Price + Qty row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg">
            <button
              onClick={() => handleUpdateQuantity(product.id, quantity - 1)}
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-l-lg transition-colors"
            >
              {quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
            </button>
            <span className="text-sm font-bold min-w-[20px] text-center">{quantity}</span>
            <button
              onClick={() => handleUpdateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-r-lg transition-colors disabled:opacity-40"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-secondary">₹{lineTotal.toLocaleString('en-IN')}</p>
            {quantity > 1 && (
              <p className="text-[10px] text-muted">₹{effectivePrice}/item</p>
            )}
          </div>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => handleRemoveFromCart(product.id, product.name)}
        className="self-start p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </motion.li>
  );
}
