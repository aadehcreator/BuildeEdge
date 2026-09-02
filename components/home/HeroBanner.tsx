'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner { id: string; image: string; link?: string | null; title?: string | null; subtitle?: string | null; }

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((next: number) => {
    setDirection(next > idx ? 1 : -1);
    setIdx((next + banners.length) % banners.length);
  }, [idx, banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => go(idx + 1), 4000);
    return () => clearInterval(t);
  }, [idx, go, banners.length]);

  if (!banners.length) return null;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl aspect-[16/6] md:aspect-[16/5] bg-gray-100 group">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={idx}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {banners[idx].link ? (
            <Link href={banners[idx].link!} className="block w-full h-full">
              <Image
                src={banners[idx].image}
                alt={banners[idx].title ?? `Banner ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 90vw"
              />
              {(banners[idx].title || banners[idx].subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8 md:px-14">
                  {banners[idx].title && (
                    <motion.h2
                      initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                      className="text-white font-heading font-bold text-2xl md:text-4xl max-w-lg"
                    >
                      {banners[idx].title}
                    </motion.h2>
                  )}
                  {banners[idx].subtitle && (
                    <motion.p
                      initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                      className="text-white/85 text-sm md:text-base mt-2 max-w-md"
                    >
                      {banners[idx].subtitle}
                    </motion.p>
                  )}
                </div>
              )}
            </Link>
          ) : (
            <Image src={banners[idx].image} alt={`Banner ${idx + 1}`} fill className="object-cover" priority={idx === 0} sizes="(max-width: 768px) 100vw, 90vw" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={() => go(idx - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => go(idx + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <ChevronRight size={18} />
          </button>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button key={i} onClick={() => go(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
