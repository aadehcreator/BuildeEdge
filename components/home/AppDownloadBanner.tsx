import { Phone } from 'lucide-react';

export default function AppDownloadBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-secondary to-gray-800 rounded-2xl p-6 md:p-10 text-white">
      <div className="relative z-10 max-w-lg">
        <div className="flex items-center gap-2 mb-3">
          <Phone size={18} className="text-primary" />
          <span className="text-sm font-semibold text-primary">Coming Soon — Android & iOS</span>
        </div>
        <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2">
          Order on the go with the Build Edge App
        </h2>
        <p className="text-gray-300 text-sm md:text-base mb-6">
          Track deliveries live, get exclusive app-only deals, and reorder in one tap. Built for contractors and builders.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-secondary rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">▶</span>
            <div>
              <p className="text-[10px] text-gray-500 leading-none">Get it on</p>
              <p className="text-sm font-bold leading-snug">Google Play</p>
            </div>
          </a>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-secondary rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">🍎</span>
            <div>
              <p className="text-[10px] text-gray-500 leading-none">Download on the</p>
              <p className="text-sm font-bold leading-snug">App Store</p>
            </div>
          </a>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/10 rounded-full" />
      <div className="absolute -right-4 -bottom-16 w-64 h-64 bg-primary/5 rounded-full" />
    </section>
  );
}
