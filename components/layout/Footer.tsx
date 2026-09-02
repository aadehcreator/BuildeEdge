import Link from 'next/link';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/press', label: 'Press' },
];
const policyLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/return-policy', label: 'Return Policy' },
  { href: '/shipping-policy', label: 'Shipping Policy' },
];
const categories = [
  { href: '/collections/civil-interiors', label: 'Civil & Interiors' },
  { href: '/collections/electrical', label: 'Electrical' },
  { href: '/collections/plumbing', label: 'Plumbing' },
  { href: '/collections/tools', label: 'Tools & Hardware' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">BE</div>
              <span className="font-heading font-bold text-lg">Build Edge</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Gwalior&apos;s fastest construction materials platform. Cement, Plywood & Hardware delivered in 60 minutes.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-primary flex-shrink-0" />
                <span>Gwalior, Madhya Pradesh</span>
              </div>
              <a href="tel:+918109585179" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={13} className="text-primary" />
                <span>+91 8109585179</span>
              </a>
              <a href="mailto:adeshrajak890@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={13} className="text-primary" />
                <span>adeshrajak890@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              {categories.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies + App */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-white">Policies</h4>
            <ul className="space-y-2 mb-6">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-heading font-semibold mb-3 text-white">Download App</h4>
            <div className="space-y-2">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors"
              >
                <ExternalLink size={12} /> Google Play Store
              </a>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors"
              >
                <ExternalLink size={12} /> Apple App Store
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Build Edge. All rights reserved. Open 8 AM – 8 PM · All Days
          </p>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-xs">We accept:</span>
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">UPI</span>
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">Cards</span>
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">COD</span>
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
