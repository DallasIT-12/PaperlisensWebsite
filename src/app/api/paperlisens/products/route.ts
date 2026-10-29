import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mergeProductsByName } from '@/lib/merge-products';
import { flattenBaseAndVariants } from '@/lib/paperlisens-schema';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\//g, '-')           // Replace / with -
    .replace(/[()]/g, '')          // Remove parentheses
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/-{2,}/g, '-')        // Collapse multiple dashes
    .replace(/^-|-$/g, '');        // Trim leading/trailing dashes
}

function toProduct(row: any) {
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

async function getStaticProducts(category?: string, search?: string) {
  const { products } = await import('@/data/products');
  let list = [...products];
  if (category) list = list.filter((p: any) => p.slug === category);
  if (search && search.trim()) {
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

// GET /api/paperlisens/products?category=box-cupcake&search=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const supabase = getClient();
    let allMergedProducts: any[] = [];

    if (supabase) {
      // 1. Ambil dari New Schema (Base + Variants)
      try {
        // 1. Ambil dari New Schema (Base + Variants) using JOIN
        let baseQuery = supabase
          .from('paperlisens_products_base')
          .select('*, variants:paperlisens_product_variants(*)');

        if (category) baseQuery = baseQuery.eq('slug', category);
        if (search?.trim()) {
          baseQuery = baseQuery.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
        }

        // @ts-ignore
        const { data: bases } = await baseQuery;

        if (bases && bases.length > 0) {
          const byProductId = new Map<string, any[]>();

          for (const b of bases) {
            // @ts-ignore
            const variants = b.variants || [];
            if (variants.length > 0) {
              const list = variants.map((v: any) => {
                return {
                  ...v,
                  images: Array.isArray(v.images) ? v.images : (v.images ? JSON.parse(v.images) : [])
                };
              });
              byProductId.set(b.id, list);
            }
          }

          const formattedBases = flattenBaseAndVariants(bases, byProductId);
          allMergedProducts = [...allMergedProducts, ...formattedBases];
        }
      } catch (e) { console.error('New schema fetch error:', e); }

      // 2. Ambil dari Old Flat Table
      try {
        let query = supabase.from('paperlisens_products').select('*');
        if (category) query = query.eq('slug', category);
        if (search?.trim()) {
          query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
        }

        const { data: flatData } = await query;
        if (flatData && flatData.length > 0) {
          const formattedFlat = mergeProductsByName(flatData.map(row => toProduct(row)));

          // HANYA masukkan produk flat yang belum ada di New Schema (berdasarkan slug)
          const existingSlugs = new Set(allMergedProducts.map(p => p.productSlug));
          const filteredFlat = formattedFlat.filter(p => !existingSlugs.has(p.productSlug));

          allMergedProducts = [...allMergedProducts, ...filteredFlat];
        }
      } catch (e) { console.error('Flat schema fetch error:', e); }
    }

    // 3. Fallback ke Static jika masih kosong
    if (allMergedProducts.length === 0) {
      allMergedProducts = await getStaticProducts(category, search);
    }

    // Urutkan berdasarkan sold (paling laku di atas)
    allMergedProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));

    return NextResponse.json(allMergedProducts, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/paperlisens/products - Add base product OR variant
// If body.product_id provided → add variant. Else → add base product.
export async function POST(request: NextRequest) {
  try {
    const supabase = getClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured. Add Supabase env variables.' },
        { status: 503 }
      );
    }
    const body = await request.json();
    console.log('--- API POST START (ADD PRODUCT) ---');
    console.log('BODY_NAME:', body.name);
    console.log('BODY_ID:', body.id);

    if (body.product_id) {
      // Add variant to existing product
      const variantId = body.id || `${body.product_id}-${Date.now()}`;
      const variantSlug = body.variantSlug || body.variant_slug || `${body.product_slug || 'prod'}-${Date.now()}`;
      const row = {
        id: variantId,
        product_id: body.product_id,
        variant_name: body.variantName ?? body.variant_name ?? null,
        variant_name_en: body.variantName_en ?? body.variant_name_en ?? null,
        variant_name_zh: body.variantName_zh ?? body.variant_name_zh ?? null,
        price: parseInt(String(body.price), 10) || 0,
        image: body.image || '/placeholder.png',
        images: Array.isArray(body.images) ? body.images : (body.images ? JSON.parse(body.images || '[]') : []),
        sold: parseInt(String(body.sold), 10) || 0,
        variant_slug: variantSlug,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('paperlisens_product_variants')
        .insert(row)
        .select()
        .single();
      if (error) {
        console.error('Supabase variant insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ...data, productSlug: variantSlug });
    }

    // Add base product (try new schema first)
    // Jika ID kosong atau mengandung 'new-', paksa generate ID baru agar tidak bentrok
    const rawId = body.id || body.productKey;
    const baseId = (!rawId || String(rawId).startsWith('new-'))
      ? `prod-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`
      : rawId;

    const productSlug = sanitizeSlug(body.productSlug || body.product_slug || body.name || baseId);

    try {
      // Cek apakah slug sudah ada untuk menghindari 'menimpa' data via slug
      const { data: existing } = await supabase.from('paperlisens_products_base').select('id').eq('product_slug', productSlug).maybeSingle();
      if (existing) {
        return NextResponse.json({ error: `Product with slug '${productSlug}' already exists. Use PUT to update.` }, { status: 400 });
      }

      const baseRow = {
        id: baseId,
        product_slug: productSlug,
        name: body.name,
        name_en: body.name_en ?? null,
        name_zh: body.name_zh ?? null,
        description: body.description ?? null,
        description_en: body.description_en ?? null,
        description_zh: body.description_zh ?? null,
        category: body.category,
        image: body.image || '/placeholder.png',
        images: Array.isArray(body.images) ? body.images : [],
        slug: body.slug || body.category?.toLowerCase().replace(/\s+/g, '-') || 'box-cupcake',
        attr_label_1: body.attr_label_1 || 'Pilih Variasi',
        attr_label_2: body.attr_label_2 || null,
        price: parseInt(String(body.price), 10) || 0,
        weight: parseInt(String(body.weight), 10) || 200,
        updated_at: new Date().toISOString(),
      };
      const { data: baseData, error: baseErr } = await supabase
        .from('paperlisens_products_base')
        .insert(baseRow)
        .select()
        .single();

      if (!baseErr && baseData) {
        // Add variants if provided in array
        if (Array.isArray(body.variants) && body.variants.length > 0) {
          for (let i = 0; i < body.variants.length; i++) {
            const v = body.variants[i];
            const vSlug = v.variant_slug || `${productSlug}-v${i + 1}-${Math.random().toString(36).substr(2, 3)}`;
            // Selalu generate ID baru untuk varian saat POST (produk baru)
            const vId = `${baseId}-v${i + 1}-${Math.random().toString(36).substr(2, 3)}`;

            await supabase.from('paperlisens_product_variants').insert({
              id: vId,
              product_id: baseId,
              variant_name: v.variant_name || null,
              price: parseInt(String(v.price), 10) || 0,
              image: v.image || '/placeholder.png',
              images: Array.isArray(v.images) ? v.images : [],
              sold: parseInt(String(v.sold), 10) || 0,
              variant_slug: vSlug,
            });
          }
        } else if (body.price != null || body.image) {
          // Fallback: add first variant if single price/image provided
          const variantSlug = body.variantSlug || productSlug;
          await supabase.from('paperlisens_product_variants').insert({
            id: `${baseId}-1`,
            product_id: baseId,
            variant_name: body.variantName ?? body.variant ?? null,
            variant_name_en: body.variantName_en ?? body.variant_en ?? null,
            variant_name_zh: body.variantName_zh ?? body.variant_zh ?? null,
            price: parseInt(String(body.price), 10) || 0,
            image: body.image || '/placeholder.png',
            images: Array.isArray(body.images) ? body.images : [],
            sold: parseInt(String(body.sold), 10) || 0,
            variant_slug: variantSlug,
          });
        }
        return NextResponse.json({ ...baseData, productSlug });
      }
    } catch (e) {
      // New table may not exist
    }

    // Fallback: old flat table
    const fallbackId = (!body.id || String(body.id).startsWith('new-'))
      ? `pl-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 3)}`
      : body.id;

    const row = {
      id: fallbackId,
      product_slug: body.productSlug || body.product_slug || productSlug,
      name: body.name,
      name_en: body.name_en ?? null,
      name_zh: body.name_zh ?? null,
      variant: body.variant ?? null,
      variant_en: body.variant_en ?? null,
      variant_zh: body.variant_zh ?? null,
      description: body.description ?? null,
      description_en: body.description_en ?? null,
      description_zh: body.description_zh ?? null,
      category: body.category,
      price: parseInt(String(body.price), 10) || 0,
      image: body.image || '/placeholder.png',
      images: Array.isArray(body.images) ? body.images : (body.images ? JSON.parse(body.images) : []),
      sold: parseInt(String(body.sold), 10) || 0,
      slug: body.slug,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('paperlisens_products')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
