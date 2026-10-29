import { NextIntlClientProvider } from 'next-intl';
import idMessages from '../../../messages/id.json';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/app/globals.css';
import { CartProvider } from '@/context/CartContext';
import CartModal from '@/components/cart/CartModal';
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp';
import AuthProvider from '@/components/auth/AuthProvider';
import type { Metadata } from 'next';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://paperlisens.com'),
  title: {
    default: 'Paperlisens - Marketplace Kemasan & Paper Tray Food Grade Terpercaya',
    template: '%s | Paperlisens'
  },
  description: 'Pusat belanja kemasan berkualitas untuk kuliner, bakery, dan UMKM. Box cupcake, paper tray, box takeaway, dan custom packaging dengan harga terbaik langsung dari pabrik.',
  keywords: ['paperlisens', 'box cupcake', 'paper tray', 'box take away', 'kemasan makanan', 'custom box', 'packaging umkm', 'kemasan food grade'],
  authors: [{ name: 'Paperlisens' }],
  creator: 'Paperlisens',
  publisher: 'Paperlisens',
  icons: {
    icon: '/logo-paperlisens.png',
    apple: '/logo-paperlisens.png',
  },
  alternates: {
    canonical: '/',
  },
};

import CookieConsent from '@/components/common/CookieConsent';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Paperlisens',
    url: 'https://paperlisens.com',
    logo: 'https://paperlisens.com/logo-paperlisens.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-812-6000-1487',
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: ['Indonesian'],
    },
    sameAs: [
      'https://www.instagram.com/paperlisens22',
      'https://www.tiktok.com/@paperlisenss22',
      'https://id.shp.ee/tpQ9dbH',
      'https://www.facebook.com/share/1G3GADNMZi/',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Paperlisens',
    url: 'https://paperlisens.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://paperlisens.com/produk?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="id" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.iconify.design" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.simplesvg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.unisvg.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-neutral-50 text-neutral-900 selection:bg-orange-500 selection:text-white">
        <NextIntlClientProvider locale="id" messages={idMessages}>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartModal />
              <FloatingWhatsApp />
              <CookieConsent />
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
