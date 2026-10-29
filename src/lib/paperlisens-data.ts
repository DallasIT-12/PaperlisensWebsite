/**
 * Server-side data access for Paperlisens products.
 * Supports new schema (products_base + variants) and old flat table.
 */

import { createClient } from '@supabase/supabase-js';
import { mergeProductsByName, getBaseId } from './merge-products';
import { flattenBaseAndVariants } from './paperlisens-schema';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type PaperlisensProduct = {
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
  weight?: number | null;
  variants?: any[];
};

function toProduct(row: any): PaperlisensProduct {
  return {
    id: row.id,
    productSlug: row.product_slug ?? row.productSlug,
    name: row.name,
    name_en: row.name_en,
    name_zh: row.name_zh,
    variant: row.variant,
    variant_en: row.variant_en,
    variant_zh: row.variant_zh,
    description: row.description,
    description_en: row.description_en,
    description_zh: row.description_zh,
    category: row.category,
    price: row.price,
    image: row.image || '/placeholder.png',
    images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : []),
    sold: row.sold || 0,
    slug: row.slug,
    weight: row.weight,
  };
}

async function getStaticProducts(category?: string, search?: string): Promise<PaperlisensProduct[]> {
  const { products } = await import('@/data/products');
  let list = [...products];
  if (category) list = list.filter((p: any) => p.slug === category);
  if (search?.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.name_en?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }
  list.sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0));
  return list.map((p: any) => toProduct({ ...p, product_slug: p.productSlug }));
}

export async function getPaperlisensProducts(options?: {
  category?: string;
  search?: string;
}): Promise<PaperlisensProduct[]> {
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      let baseQuery = supabase.from('paperlisens_products_base').select('*');
      if (options?.category) baseQuery = baseQuery.eq('slug', options.category);
      if (options?.search?.trim()) {
        baseQuery = baseQuery.or(
          `name.ilike.%${options.search}%,name_en.ilike.%${options.search}%,category.ilike.%${options.search}%`
        );
      }
      const { data: bases, error: baseErr } = await baseQuery;

      if (!baseErr && bases && bases.length > 0) {
        const baseIds = bases.map((b: any) => b.id);
        const { data: variants } = await supabase
          .from('paperlisens_product_variants')
          .select('*')
          .in('product_id', baseIds);
        const byProductId = new Map<string, any[]>();
        for (const v of variants || []) {
          const list = byProductId.get(v.product_id) || [];
          list.push({ ...v, images: Array.isArray(v.images) ? v.images : (v.images ? JSON.parse(v.images) : []) });
          byProductId.set(v.product_id, list);
        }
        return flattenBaseAndVariants(bases, byProductId);
      }
    } catch {
      /* new schema not used */
    }
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      let query = supabase.from('paperlisens_products').select('*').order('sold', { ascending: false });
      if (options?.category) query = query.eq('slug', options.category);
      if (options?.search?.trim()) {
        query = query.or(
          `name.ilike.%${options.search}%,name_en.ilike.%${options.search}%,category.ilike.%${options.search}%`
        );
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const products = data.map((row: any) => toProduct(row));
        return mergeProductsByName(products);
      }
    } catch (e) {
      console.error('Supabase fetch error:', e);
    }
  }
  const products = await getStaticProducts(options?.category, options?.search);
  return mergeProductsByName(products);
}

export async function getPaperlisensProductBySlug(productSlug: string): Promise<PaperlisensProduct | null> {
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: variant } = await supabase
        .from('paperlisens_product_variants')
        .select('*')
        .eq('variant_slug', productSlug)
        .maybeSingle();
      let base: any = null;
      if (variant) {
        const { data: b } = await supabase
          .from('paperlisens_products_base')
          .select('*')
          .eq('id', variant.product_id)
          .single();
        base = b;
      }
      if (!base) {
        const { data: bBySlug } = await supabase
          .from('paperlisens_products_base')
          .select('*')
          .eq('product_slug', productSlug)
          .maybeSingle();
        base = bBySlug;
        if (base) {
          const { data: firstV } = await supabase
            .from('paperlisens_product_variants')
            .select('*')
            .eq('product_id', base.id)
            .limit(1)
            .maybeSingle();
          if (firstV) {
            const { data: allV } = await supabase
              .from('paperlisens_product_variants')
              .select('*')
              .eq('product_id', base.id);
            const byId = new Map<string, any[]>();
            for (const v of allV || []) {
              byId.set(v.product_id, [...(byId.get(v.product_id) || []), { ...v, images: Array.isArray(v.images) ? v.images : (v.images ? JSON.parse(v.images) : []) }]);
            }
            const [flattened] = flattenBaseAndVariants([base], byId);
            if (flattened) {
              flattened.productSlug = productSlug;
              return flattened;
            }
          }
        }
      } else if (variant) {
        const { data: allV } = await supabase
          .from('paperlisens_product_variants')
          .select('*')
          .eq('product_id', base.id);
        const byId = new Map<string, any[]>();
        for (const v of allV || []) {
          byId.set(v.product_id, [...(byId.get(v.product_id) || []), { ...v, images: Array.isArray(v.images) ? v.images : (v.images ? JSON.parse(v.images) : []) }]);
        }
        const [flattened] = flattenBaseAndVariants([base], byId);
        if (flattened) {
          flattened.productSlug = productSlug;
          return flattened;
        }
      }
    } catch {
      /* new schema not used */
    }
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('paperlisens_products')
        .select('*')
        .eq('product_slug', productSlug)
        .single();

      if (!error && data) {
        const baseId = getBaseId(data.id);
        const { data: sameBase } = await supabase
          .from('paperlisens_products')
          .select('*')
          .or(`id.eq.${baseId},id.like.${baseId}-%`);
        const toMerge = (sameBase && sameBase.length > 0) ? sameBase : [data];
        const products = toMerge.map((row: any) => toProduct(row));
        const [merged] = mergeProductsByName(products);
        return merged || toProduct(data);
      }
    } catch (e) {
      console.error('Supabase fetch error:', e);
    }
  }

  const { products } = await import('@/data/products');
  const found = products.find((p: any) => p.productSlug === productSlug);
  if (!found) return null;
  const baseId = getBaseId(found.id);
  const sameBase = products.filter((p: any) => getBaseId(p.id) === baseId);
  const mapped = sameBase.map((p: any) => toProduct({ ...p, product_slug: p.productSlug }));
  const [merged] = mergeProductsByName(mapped);
  return merged || toProduct({ ...found, product_slug: found.productSlug });
}
