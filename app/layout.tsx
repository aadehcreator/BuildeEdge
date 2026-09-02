import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import CartDrawer from '@/components/cart/CartDrawer';
import PincodeModal from '@/components/layout/PincodeModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Build Edge — 60 Min Construction Materials Delivery in Gwalior', template: '%s | Build Edge' },
  description: 'Cement, Plywood & Hardware delivered in 60 minutes. Best prices on Asian Paints, Fevicol, Bosch, Hettich & more. Open 8 AM – 8 PM.',
  keywords: ['construction materials', 'cement', 'plywood', 'hardware', 'Gwalior', 'quick delivery'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Build Edge',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Build Edge' }],
  },
  twitter: { card: 'summary_large_image', site: '@buildedge' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-surface">
        {children}
        <CartDrawer />
        <PincodeModal />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '10px', background: '#1A1A1A', color: '#fff', fontSize: '14px' },
            success: { iconTheme: { primary: '#E87722', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
