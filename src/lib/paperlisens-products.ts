/**
 * Paperlisens products data layer.
 * Fetches from API (Supabase) when configured, falls back to static data.
 */

const API_BASE = '/api/paperlisens/products';

export type PaperlisensProduct = {
  id: string;
  productSlug: string;
  name: string;
  name_en?: string;
  name_zh?: string;
  variant?: string;
  variant_en?: string;
  variant_zh?: string;
  description?: string;
  description_en?: string;
  description_zh?: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  sold: number;
  slug: string;
};

export async function fetchProducts(options?: {
  category?: string;
  search?: string;
}): Promise<PaperlisensProduct[]> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.set('category', options.category);
    if (options?.search) params.set('search', options.search);
    const url = `${API_BASE}${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchProductBySlug(productSlug: string): Promise<PaperlisensProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(productSlug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('API error');
    }
    return await res.json();
  } catch {
    return null;
  }
}
