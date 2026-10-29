/**
 * Seed Paperlisens products from src/data/products.ts into Supabase.
 * Run: npx tsx scripts/seed-paperlisens.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';
import { products } from '../src/data/products';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  const rows = products.map((p) => ({
    id: p.id,
    product_slug: p.productSlug,
    name: p.name,
    name_en: p.name_en ?? null,
    name_zh: p.name_zh ?? null,
    variant: p.variant ?? null,
    variant_en: p.variant_en ?? null,
    variant_zh: p.variant_zh ?? null,
    description: p.description ?? null,
    description_en: p.description_en ?? null,
    description_zh: p.description_zh ?? null,
    category: p.category,
    price: p.price ?? 0,
    image: p.image ?? '/placeholder.png',
    images: Array.isArray(p.images) ? p.images : [],
    sold: p.sold ?? 0,
    slug: p.slug,
  }));

  console.log(`Seeding ${rows.length} products...`);

  const chunkSize = 100;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from('paperlisens_products').upsert(chunk, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });
    if (error) {
      console.error('Chunk error:', error);
      process.exit(1);
    }
    inserted += chunk.length;
    console.log(`Inserted ${inserted}/${rows.length}`);
  }

  console.log('Done!');
}

seed().catch(console.error);
