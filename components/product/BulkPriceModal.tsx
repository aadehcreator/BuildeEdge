'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingDown, Zap } from 'lucide-react';

interface BulkTier { minQty: number; price: number; }

interface BulkPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  unit: string;
  sellingPrice: number;
  mrp: number;
  bulkPrices: BulkTier[];
  currentQty?: number;
}

export default function BulkPriceModal({ isOpen, onClose, productName, unit, sellingPrice, mrp, bulkPrices, currentQty = 0 }: BulkPriceModalProps) {
  const allTiers = [{ minQty: 1, price: sellingPrice }, ...bulkPrices].sort((a, b) => a.minQty - b.minQty);

  const activeTier = [...allTiers].reverse().find((t) => currentQty >= t.minQty) ?? allTiers[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50" />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingDown size={18} className="text-primary" />
                <h3 className="font-heading font-bold text-secondary">Bulk Pricing</h3>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface">
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-muted mb-4 line-clamp-1">{productName}</p>

              <div className="space-y-2">
                {allTiers.map((tier, i) => {
                  const nextTier = allTiers[i + 1];
                  const isActive = tier === activeTier;
                  const discount = Math.round(((mrp - tier.price) / mrp) * 100);
                  const label = nextTier
                    ? `${tier.minQty}–${nextTier.minQty - 1} ${unit}`
                    : `${tier.minQty}+ ${unit}`;

                  return (
                    <div
                      key={tier.minQty}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        isActive ? 'border-primary bg-primary/5' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive && <Zap size={14} className="text-primary" />}
                        <div>
                          <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-secondary'}`}>{label}</p>
                          {discount > 0 && <p className="text-xs text-green-600 font-medium">{discount}% off MRP</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-base font-bold ${isActive ? 'text-primary' : 'text-secondary'}`}>
                          ₹{tier.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-muted">per {unit}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted text-center mt-4">
                MRP: ₹{mrp.toLocaleString('en-IN')} per {unit}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
