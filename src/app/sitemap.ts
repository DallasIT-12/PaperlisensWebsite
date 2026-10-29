import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getPaperlisensProducts } from '@/lib/paperlisens-data';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Cache and revalidate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paperlisens.com';

  // 1. High-priority Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/produk`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 2. High-priority Category Pages
  const categorySlugs = [
    'box-cupcake',
    'paper-tray',
    'box-take-away',
    'tempat-pensil',
    'lain-lain',
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Dynamic Products & Variants from Database
  let productRoutes: MetadataRoute.Sitemap = [];
  const seenSlugs = new Set<string>();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch all base products
      const { data: bases } = await supabase
        .from('paperlisens_products_base')
        .select('product_slug, created_at');

      for (const b of bases || []) {
        if (b.product_slug && !seenSlugs.has(b.product_slug)) {
          seenSlugs.add(b.product_slug);
          productRoutes.push({
            url: `${baseUrl}/product/${encodeURIComponent(b.product_slug)}`,
            lastModified: b.created_at ? new Date(b.created_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
          });
        }
      }

      // Fetch all variant slugs
      const { data: variants } = await supabase
        .from('paperlisens_product_variants')
        .select('variant_slug');

      for (const v of variants || []) {
        if (v.variant_slug && !seenSlugs.has(v.variant_slug)) {
          seenSlugs.add(v.variant_slug);
          productRoutes.push({
            url: `${baseUrl}/product/${encodeURIComponent(v.variant_slug)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    } catch (e) {
      console.error('Error fetching sitemap from supabase:', e);
    }
  }

  // Fallback to getPaperlisensProducts if supabase direct query was empty
  if (productRoutes.length === 0) {
    try {
      const products = await getPaperlisensProducts();
      for (const p of products) {
        const slug = p.productSlug || p.slug;
        if (slug && !seenSlugs.has(slug)) {
          seenSlugs.add(slug);
          productRoutes.push({
            url: `${baseUrl}/product/${encodeURIComponent(slug)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
          });
        }
      }
    } catch (err) {
      console.error('Fallback sitemap error:', err);
    }
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
