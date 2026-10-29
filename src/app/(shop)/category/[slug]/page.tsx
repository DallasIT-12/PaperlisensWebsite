import CategoryPageClient from './category-page-client';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formattedCategory = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const title = `Kategori: ${formattedCategory} | Paperlisens`;
  const description = `Jelajahi koleksi kemasan ${formattedCategory} berkualitas food grade dan harga terjangkau di Paperlisens.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CategoryPageClient params={Promise.resolve({ slug })} />;
}
