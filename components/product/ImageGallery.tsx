'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const allImages = images.length > 0 ? images : ['https://placehold.co/600x600?text=No+Image'];

  const prev = () => setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setActiveIdx((i) => (i + 1) % allImages.length);

  return (
    <>
      <div className="flex gap-3">
        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex flex-col gap-2 w-16 flex-shrink-0">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIdx ? 'border-primary shadow-sm' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image src={img} alt={`${productName} ${i + 1}`} width={64} height={64} className="w-full h-full object-contain bg-gray-50 p-1" />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="relative flex-1 aspect-square bg-gray-50 rounded-2xl overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={allImages[activeIdx]}
                alt={`${productName} - view ${activeIdx + 1}`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
          >
            <ZoomIn size={14} className="text-secondary" />
          </button>

          {/* Nav arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Dots */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIdx ? 'bg-primary w-4' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              className="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allImages[activeIdx]}
                alt={productName}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-0 right-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
