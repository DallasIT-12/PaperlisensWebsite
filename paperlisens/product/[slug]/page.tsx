import Link from 'next/link';
import { getPaperlisensProductBySlug, getPaperlisensProducts } from '@/lib/paperlisens-data';
import ProductDetailPage from './product-detail-page';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale = 'id' } = await params;
  const messages = await getMessages();

  const initialProduct = await getPaperlisensProductBySlug(slug);

  if (!initialProduct) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', minHeight: '50vh' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#1a3636' }}>
          Product not found
        </h1>
        <Link
          href={`/${locale}/paperlisens`}
          style={{
            color: '#40534c',
            textDecoration: 'underline',
            fontWeight: '500',
          }}
        >
          ← Back to Paperlisens
        </Link>
      </div>
    );
  }

  const allProducts = await getPaperlisensProducts();

  // Filter out current product, no placeholders, deduplicate by name
  const uniqueProducts = allProducts
    .filter(p => p.id !== initialProduct.id && p.image && p.image !== '/placeholder.png')
    .filter((p, index, self) =>
      index === self.findIndex(t => t.name === p.name)
    );

  const shuffled = [...uniqueProducts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const relatedProducts = shuffled.slice(0, 8);
  const otherProducts = shuffled.slice(8, 16);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ProductDetailPage initialProduct={initialProduct} relatedProducts={relatedProducts} otherProducts={otherProducts} />
    </NextIntlClientProvider>
  );
}
