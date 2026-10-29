import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mergeProductsByName, getBaseId } from '@/lib/merge-products';
import { flattenBaseAndVariants } from '@/lib/paperlisens-schema';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
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

// GET /api/paperlisens/products/[slug]
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const supabase = getClient();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    try {
      // Use JOIN to get base + variants in one call for New Schema
      // @ts-ignore
      const { data: bBySlug } = await supabase
        .from('paperlisens_products_base')
        .select('*, variants:paperlisens_product_variants(*)')
        .eq('product_slug', slug)
        .maybeSingle();

      let base = bBySlug;
      if (base) {
        // Variants are now embedded in base.variants
        // @ts-ignore
        const variants = base.variants || [];

        const byId = new Map<string, any[]>();
        byId.set(base.id, variants.map((v: any) => {
          return {
            ...v,
            images: Array.isArray(v.images) ? v.images : (v.images ? JSON.parse(v.images) : [])
          };
        }));

        const [flattened] = flattenBaseAndVariants([base], byId);
        if (flattened) {
          // Kirimkan thumbnail asli dari base agar tidak tertukar dengan foto varian di admin
          return NextResponse.json({
            ...flattened,
            baseImage: base.image,
            baseGallery: Array.isArray(base.images) ? base.images : (base.images ? JSON.parse(base.images) : [])
          });
        }
      }
    } catch (e) {
      console.error('New schema single fetch error:', e);
    }

    const { data, error } = await supabase.from('paperlisens_products').select('*').eq('product_slug', slug).single();
    if (!error && data) {
      const baseId = getBaseId(data.id);
      const { data: sameBase } = await supabase.from('paperlisens_products').select('*').or(`id.eq.${baseId},id.like.${baseId}-%`);
      const [merged] = mergeProductsByName((sameBase || [data]).map(row => toProduct(row)));
      if (merged) {
        return NextResponse.json({
          ...merged,
          baseImage: data.image,
          baseGallery: Array.isArray(data.images) ? data.images : (data.images ? JSON.parse(data.images) : [])
        });
      }
    }

    const { products } = await import('@/data/products');
    const staticProd = products.find((p: any) => p.productSlug === slug);
    if (staticProd) return NextResponse.json(toProduct({ ...staticProd, product_slug: staticProd.productSlug }));

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

// Helper: check if a URL is a Supabase Storage file (not a local path)
function isSupabaseStorageUrl(url: string): boolean {
  return typeof url === 'string' && url.includes('/storage/v1/object/public/');
}

// Helper: extract bucket + file path from a Supabase public URL
function extractStoragePath(url: string): { bucket: string; path: string } | null {
  const marker = '/storage/v1/object/public/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const after = url.substring(idx + marker.length);
  const slash = after.indexOf('/');
  if (slash === -1) return null;
  return { bucket: after.substring(0, slash), path: after.substring(slash + 1) };
}

// Helper: delete a list of Supabase Storage URLs
async function deleteStorageUrls(supabase: any, urls: string[]) {
  if (urls.length === 0) return;
  // Group by bucket
  const byBucket = new Map<string, string[]>();
  for (const url of urls) {
    const parsed = extractStoragePath(url);
    if (!parsed) continue;
    if (!byBucket.has(parsed.bucket)) byBucket.set(parsed.bucket, []);
    byBucket.get(parsed.bucket)!.push(parsed.path);
  }
  for (const [bucket, paths] of byBucket.entries()) {
    console.log(`CLEANUP_STORAGE: Deleting ${paths.length} file(s) from bucket "${bucket}":`, paths);
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) console.warn(`CLEANUP_STORAGE_WARN: ${error.message}`);
    else console.log(`CLEANUP_STORAGE_OK: Deleted from "${bucket}"`);
  }
}

// PUT /api/paperlisens/products/[slug] - FIXED UNIQUE ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    const body = await request.json();
    const slug = decodeURIComponent(rawSlug);
    const supabase = getClient();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    console.log(`--- API PUT START ---`);
    console.log(`RAW_SLUG: "${rawSlug}"`);
    console.log(`DECODED_SLUG: "${slug}" (Length: ${slug.length})`);
    console.log(`SLUG_HEX: ${Buffer.from(slug).toString('hex')}`);
    console.log(`BODY_ID: ${body.id}`);
    console.log(`BODY_NAME: ${body.name}`);

    // 1. Cari Base berdasarkan SLUG (Slug adalah identitas paling unik)
    const { data: foundBase, error: findErr } = await supabase.from('paperlisens_products_base').select('*').eq('product_slug', slug).maybeSingle();

    if (findErr) {
      console.error('FIND_BASE_ERROR:', findErr);
      return NextResponse.json({ error: findErr.message }, { status: 500 });
    }

    let base = foundBase;

    // 2. Jika tidak ada, buat baru dengan ID yang dijamin unik
    if (!base) {
      console.log(`BASE_NOT_FOUND: Slug "${slug}" not in paperlisens_products_base. Attempting insert...`);
      // JANGAN memotong ID lagi (pt-011 -> pt adalah kesalahan). 
      // Gunakan ID unik baru untuk setiap entitas produk utama.
      const uniqueBaseId = `prod-${slug.slice(0, 15).replace(/\//g, '-')}-${Math.random().toString(36).substr(2, 5)}`;

      const { data: newBase, error: insErr } = await supabase.from('paperlisens_products_base').insert({
        id: uniqueBaseId,
        product_slug: slug,
        name: body.name,
        description: body.description || '',
        category: body.category || 'Lain-lain',
        slug: body.slug || 'lain-lain',
        image: body.image || '/placeholder.png',
        images: body.images || []
      }).select().single();

      if (insErr) {
        console.error('INSERT_ERROR (Base not found in select but exists on insert):', insErr);
        // Jika gagal karena duplicate key, coba cari sekali lagi dengan paksa?
        // Tapi unique constraint error 23505 itu berarti BENAR ada.
        return NextResponse.json({ error: `Slug "${slug}" already exists but could not be retrieved. DB Error: ${insErr.message}` }, { status: 500 });
      }
      base = newBase;
    }

    if (base) {
      console.log(`UPDATING_BASE: ${base.id}`);

      // --- SERVER-SIDE STORAGE CLEANUP ---
      // Collect all image URLs currently stored in the database for this product
      const oldBaseImages: string[] = [
        base.image,
        ...(Array.isArray(base.images) ? base.images : [])
      ].filter(isSupabaseStorageUrl);

      // Also collect variant images stored in the database
      const { data: oldVariants } = await supabase
        .from('paperlisens_product_variants')
        .select('image, images')
        .eq('product_id', base.id);

      const oldVariantImages: string[] = (oldVariants || []).flatMap((v: any) => [
        v.image,
        ...(Array.isArray(v.images) ? v.images : [])
      ]).filter(isSupabaseStorageUrl);

      const allOldUrls = new Set([...oldBaseImages, ...oldVariantImages]);

      // Collect all image URLs in the new payload
      const newBaseImages: string[] = [
        body.image,
        ...(Array.isArray(body.images) ? body.images : [])
      ].filter(isSupabaseStorageUrl);

      const newVariantImages: string[] = (Array.isArray(body.variants) ? body.variants : []).flatMap((v: any) => [
        v.image,
        ...(Array.isArray(v.images) ? v.images : [])
      ]).filter(isSupabaseStorageUrl);

      const allNewUrls = new Set([...newBaseImages, ...newVariantImages]);

      // Orphaned = in old but not in new
      const orphanedUrls = [...allOldUrls].filter(url => !allNewUrls.has(url));
      if (orphanedUrls.length > 0) {
        console.log(`CLEANUP: Found ${orphanedUrls.length} orphaned image(s) to delete from storage.`);
        await deleteStorageUrls(supabase, orphanedUrls);
      }
      // --- END STORAGE CLEANUP ---
      const { error: updateErr } = await supabase.from('paperlisens_products_base').update({
        name: body.name,
        name_en: body.name_en || null,
        name_zh: body.name_zh || null,
        description: body.description,
        description_en: body.description_en || null,
        description_zh: body.description_zh || null,
        category: body.category,
        slug: body.slug,
        image: body.image || '/placeholder.png',
        images: Array.isArray(body.images) ? body.images : [],
        attr_label_1: body.attr_label_1 || 'Pilih Variasi',
        attr_label_2: body.attr_label_2 || null,
        price: parseInt(String(body.price), 10) || 0,
        weight: parseInt(String(body.weight), 10) || 200,
        updated_at: new Date().toISOString()
      }).eq('id', base.id);

      if (updateErr) {
        console.error('UPDATE_BASE_ERROR:', updateErr);
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      // ... (kode penghapusan tabel lama tetap sama) ...

      // 3. UPDATE VARIAN
      if (Array.isArray(body.variants)) {
        await supabase.from('paperlisens_product_variants').delete().eq('product_id', base.id);
        for (let i = 0; i < body.variants.length; i++) {
          const v = body.variants[i];
          const variantId = `${base.id}-v${i + 1}-${Math.random().toString(36).substr(2, 3)}`;

          await supabase.from('paperlisens_product_variants').insert({
            id: variantId,
            product_id: base.id,
            variant_name: v.variant_name || null,
            variant_name_en: v.variant_name_en || null,
            variant_name_zh: v.variant_name_zh || null,
            variant_name_2: v.variant_name_2 || null,
            variant_name_2_en: v.variant_name_2_en || null,
            variant_name_2_zh: v.variant_name_2_zh || null,
            price: parseInt(String(v.price)) || 0,
            image: v.image || body.image || '/placeholder.png',
            images: [],
            variant_slug: v.variant_slug || `${slug}-v${i + 1}`,
            updated_at: new Date().toISOString(),
          });
        }
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// PATCH /api/paperlisens/products/[slug] - Increment Sold Count
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { variant_id } = await request.json();
    const supabase = getClient();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    console.log(`--- INCREMENTING SOLD: ${slug} (Variant: ${variant_id || 'Base'}) ---`);

    if (variant_id) {
      // Increment variant sold count
      const { data: vData } = await supabase.from('paperlisens_product_variants').select('sold').eq('id', variant_id).single();
      await supabase.from('paperlisens_product_variants').update({ sold: (vData?.sold || 0) + 1 }).eq('id', variant_id);
    } else {
      // Fallback to base or old table
      const { data: bData } = await supabase.from('paperlisens_products_base').select('id').eq('product_slug', slug).maybeSingle();
      if (bData) {
        // If base has variants, increment the first one
        const { data: firstV } = await supabase.from('paperlisens_product_variants').select('id, sold').eq('product_id', bData.id).limit(1).maybeSingle();
        if (firstV) {
          await supabase.from('paperlisens_product_variants').update({ sold: (firstV.sold || 0) + 1 }).eq('id', firstV.id);
        }
      }

      // Also try old table
      const { data: oldData } = await supabase.from('paperlisens_products').select('sold').eq('product_slug', slug).maybeSingle();
      if (oldData) {
        await supabase.from('paperlisens_products').update({ sold: (oldData.sold || 0) + 1 }).eq('product_slug', slug);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = getClient();
    if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    // Cari base product beserta semua data gambar sebelum menghapus
    const { data: base } = await supabase
      .from('paperlisens_products_base')
      .select('id, image, images')
      .eq('product_slug', slug)
      .maybeSingle();

    if (base) {
      // 1. Kumpulkan semua URL gambar dari base + varian untuk cleanup storage
      const allImageUrls: string[] = [];

      // Gambar base product
      if (base.image) allImageUrls.push(base.image);
      const baseImages = Array.isArray(base.images) ? base.images : [];
      allImageUrls.push(...baseImages);

      // Gambar semua varian
      const { data: variants } = await supabase
        .from('paperlisens_product_variants')
        .select('image, images')
        .eq('product_id', base.id);

      for (const v of variants || []) {
        if (v.image) allImageUrls.push(v.image);
        const vImages = Array.isArray(v.images) ? v.images : [];
        allImageUrls.push(...vImages);
      }

      // 2. Hapus file dari Supabase Storage
      const supabaseUrls = allImageUrls.filter(isSupabaseStorageUrl);
      if (supabaseUrls.length > 0) {
        console.log(`DELETE_CLEANUP: Deleting ${supabaseUrls.length} image(s) from storage for product "${slug}"`);
        await deleteStorageUrls(supabase, supabaseUrls);
      }

      // 3. Hapus data dari database
      await supabase.from('paperlisens_product_variants').delete().eq('product_id', base.id);
      await supabase.from('paperlisens_products_base').delete().eq('id', base.id);
    }

    // Hapus juga dari tabel lama (tanpa cleanup storage karena tabel lama tidak dikelola)
    await supabase.from('paperlisens_products').delete().eq('product_slug', slug);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE_ERROR:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
