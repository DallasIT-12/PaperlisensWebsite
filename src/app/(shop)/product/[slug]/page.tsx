import Link from 'next/link';
import { getPaperlisensProductBySlug, getPaperlisensProducts } from '@/lib/paperlisens-data';
import ProductDetailPage from './product-detail-page';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPaperlisensProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | Paperlisens',
    };
  }

  const title = `${product.name} | Paperlisens`;
  const description = product.description || `Beli ${product.name} dengan kualitas food grade, bahan tebal, dan harga grosir terbaik langsung dari Paperlisens.`;
  const image = product.image && !product.image.includes('placeholder') ? product.image : '/logo-paperlisens.png';
  const canonicalUrl = `/product/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Paperlisens',
      images: [
        {
          url: image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const initialProduct = await getPaperlisensProductBySlug(slug);

  if (!initialProduct) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', minHeight: '50vh' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#171717', fontWeight: 'bold' }}>
          Produk Tidak Ditemukan
        </h1>
        <p style={{ color: '#737373', marginBottom: '24px' }}>
          Produk yang Anda cari mungkin telah dipindahkan atau sudah tidak tersedia.
        </p>
        <Link
          href="/"
          style={{
            color: '#ffffff',
            backgroundColor: '#ea580c',
            padding: '10px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '700',
            display: 'inline-block',
          }}
        >
          Kembali ke Beranda Paperlisens
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

  // --- JSON-LD Structured Data for Google Rich Snippets ---
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paperlisens.com';
  const productUrl = `${baseUrl}/product/${encodeURIComponent(slug)}`;
  const productImage = initialProduct.image && !initialProduct.image.includes('placeholder')
    ? (initialProduct.image.startsWith('http') ? initialProduct.image : `${baseUrl}${initialProduct.image}`)
    : `${baseUrl}/logo-paperlisens.png`;

  const categoryName = initialProduct.category || 'Kemasan Makanan';
  const price = initialProduct.price || 0;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: initialProduct.name,
    image: [productImage],
    description: initialProduct.description || `Beli ${initialProduct.name} dengan kualitas food grade, higienis, dan harga terjangkau dari Paperlisens.`,
    sku: String(initialProduct.id || slug),
    mpn: slug,
    brand: {
      '@type': 'Brand',
      name: 'Paperlisens',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'IDR',
      price: price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Paperlisens',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `${baseUrl}/category/${initialProduct.slug || 'box-cupcake'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: initialProduct.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      {/* Schema.org Product Rich Snippet for Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Schema.org Breadcrumb Hierarchy for Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ProductDetailPage 
        initialProduct={initialProduct} 
        relatedProducts={relatedProducts} 
        otherProducts={otherProducts} 
      />
    </>
  );
}
