'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const PLACEHOLDERS = ['Search for Cement...', 'Search for Plywood...', 'Search for Fevicol...', 'Search for Switches...', 'Search for Pipes...'];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder
  useEffect(() => {
    if (isFocused || query) return;
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length), 2500);
    return () => clearInterval(id);
  }, [isFocused, query]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!query.trim()) return;
      // Save recent search
      try {
        const recent = JSON.parse(localStorage.getItem('recentSearches') ?? '[]') as string[];
        const updated = [query.trim(), ...recent.filter((r) => r !== query.trim())].slice(0, 10);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      } catch { /* ignore */ }
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className={`flex items-center bg-gray-50 border rounded-xl transition-all duration-200 ${isFocused ? 'border-primary bg-white shadow-xs ring-1 ring-primary/20' : 'border-gray-200 hover:border-gray-300'}`}>
        <Search size={16} className="ml-3 text-muted flex-shrink-0" />
        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none text-secondary placeholder-transparent"
            placeholder={PLACEHOLDERS[placeholderIdx]}
          />
          {/* Animated placeholder when empty and not focused */}
          {!query && !isFocused && (
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center px-3 text-sm text-muted pointer-events-none select-none truncate"
              >
                {PLACEHOLDERS[placeholderIdx]}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
        {query && (
          <button type="button" onClick={() => setQuery('')} className="p-1 mr-1 text-muted hover:text-secondary flex-shrink-0">
            <X size={14} />
          </button>
        )}
        <button
          type="submit"
          className="mr-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors flex-shrink-0 whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
}
