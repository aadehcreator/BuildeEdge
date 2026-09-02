'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocationStore, SERVICEABLE_PINCODES } from '@/store/locationStore';

export default function PincodeModal() {
  const { showPincodeModal, closePincodeModal, setPincode, pincode } = useLocationStore();
  const [input, setInput] = useState(pincode ?? '');
  const [status, setStatus] = useState<'idle' | 'serviceable' | 'not-serviceable'>('idle');

  const handleSubmit = () => {
    if (!/^\d{6}$/.test(input)) return;
    const serviceable = SERVICEABLE_PINCODES.includes(input);
    setStatus(serviceable ? 'serviceable' : 'not-serviceable');
    if (serviceable) {
      setTimeout(() => { setPincode(input); closePincodeModal(); setStatus('idle'); }, 1000);
    }
  };

  return (
    <AnimatePresence>
      {showPincodeModal && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={pincode ? closePincodeModal : undefined} />
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md z-10"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {pincode && (
              <button onClick={closePincodeModal} className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface">
                <X size={18} />
              </button>
            )}

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin size={24} className="text-primary" />
              </div>
              <h2 className="font-heading font-bold text-xl">Where should we deliver?</h2>
              <p className="text-sm text-muted mt-1">Enter your pincode to check delivery availability in Gwalior</p>
            </div>

            <div className="flex gap-2">
              <input
                type="tel"
                maxLength={6}
                value={input}
                onChange={(e) => { setInput(e.target.value.replace(/\D/g, '')); setStatus('idle'); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter 6-digit pincode"
                className="flex-1 px-4 py-3 border-2 border-border rounded-xl text-center text-lg font-semibold tracking-widest focus:outline-none focus:border-primary transition-colors"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                disabled={input.length !== 6}
                className="px-5 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Check
              </button>
            </div>

            <AnimatePresence>
              {status === 'serviceable' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-4 p-3 bg-green-50 text-green-700 rounded-xl"
                >
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">🎉 We deliver to {input}! 60-min delivery available.</span>
                </motion.div>
              )}
              {status === 'not-serviceable' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-4 p-3 bg-red-50 text-red-700 rounded-xl"
                >
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">We don&apos;t deliver to {input} yet. We&apos;re expanding soon!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-muted text-center mt-4">
              Currently serving Gwalior pincodes: 474001 – 474021
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
