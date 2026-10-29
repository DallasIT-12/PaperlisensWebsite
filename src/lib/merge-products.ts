/**
 * Merge products by base ID (e.g. bc-002-1, bc-002-2 → same product bc-002).
 * Combines images from all variants into a single images array.
 */

export type ProductWithMerge = {
  id: string;
  productSlug: string;
  name: string;
  name_en?: string | null;
  name_zh?: string | null;
  variant?: string | null;
  variant_en?: string | null;
  variant_zh?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_zh?: string | null;
  category: string;
  price: number;
  image: string;
  images: string[];
  sold: number;
  slug: string;
  variants?: any[];
};

function collectImages(p: ProductWithMerge): string[] {
  const list: string[] = [];
  const seen = new Set<string>();
  const skip = (url: string) =>
    !url || url === '/placeholder.png' || url.includes('placeholder');

  if (p.image && !skip(p.image) && !seen.has(p.image)) {
    list.push(p.image);
    seen.add(p.image);
  }
  for (const url of p.images || []) {
    if (url && !skip(url) && !seen.has(url)) {
      list.push(url);
      seen.add(url);
    }
  }
  return list;
}

/** Get base product id (e.g. bc-002 from bc-002-1, bc-002-2) */
export function getBaseId(id: string): string {
  if (!id) return id;
  const match = id.match(/^(.+?)-\d+$/);
  return match ? match[1] : id;
}

/**
 * Merge products by base ID. Same base (e.g. bc-002) = same product (variants).
 * Images from all variants are combined and deduplicated.
 */
export function mergeProductsByName<T extends ProductWithMerge>(products: T[]): T[] {
  const byBaseId = new Map<string, T[]>();

  for (const p of products) {
    const key = getBaseId(p.id || '');
    if (!key) continue;
    if (!byBaseId.has(key)) byBaseId.set(key, []);
    byBaseId.get(key)!.push(p);
  }

  const merged: T[] = [];

  for (const [, group] of byBaseId) {
    const primary = group[0];
    const allImages: string[] = [];
    const imgSet = new Set<string>();

    for (const p of group) {
      for (const url of collectImages(p)) {
        if (!imgSet.has(url)) {
          allImages.push(url);
          imgSet.add(url);
        }
      }
    }

    const totalSold = group.reduce((sum, p) => sum + (p.sold || 0), 0);
    const bestImage = allImages[0] || primary.image || '/placeholder.png';

    merged.push({
      ...primary,
      image: bestImage,
      images: allImages.length > 0 ? allImages : [primary.image || '/placeholder.png'],
      sold: totalSold,
      variants: group.map(p => ({
        id: p.id,
        variant_name: p.variant || 'Standard',
        price: p.price,
        image: p.image,
        images: p.images || [],
        variant_slug: p.productSlug,
        sold: p.sold
      }))
    });
  }

  merged.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  return merged;
}
