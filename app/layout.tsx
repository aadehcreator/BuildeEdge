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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: { default: 'BuildeHive Store — 60 Min Construction Materials Delivery in Gwalior', template: '%s | BuildeHive Store' },
  description: 'Cement, Plywood & Hardware delivered in 60 minutes. Best prices on Asian Paints, Fevicol, Bosch, Hettich & more. Open 8 AM – 8 PM.',
  keywords: ['construction materials', 'cement', 'plywood', 'hardware', 'Gwalior', 'quick delivery'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'BuildeHive Store',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'BuildeHive Store' }],
  },
  twitter: { card: 'summary_large_image', site: '@buildhive' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-surface" suppressHydrationWarning>
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
