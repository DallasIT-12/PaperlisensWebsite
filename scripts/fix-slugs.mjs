// One-time script to fix product slugs containing "/" in Supabase
// Run: node scripts/fix-slugs.mjs

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dvduwjfazvtchdozzfvo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZHV3amZhenZ0Y2hkb3p6ZnZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3NDg2MSwiZXhwIjoyMDg3MDUwODYxfQ.DuSfaaoSXmMY6JBEy4iPhuhRnpu_2DGKPrkZ_CoFlJ0";

const supabase = createClient(supabaseUrl, supabaseKey);

function sanitizeSlug(text) {
  return text
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('=== Fixing Product Slugs ===\n');
  
  const { data: allProducts, error } = await supabase
    .from('paperlisens_products_base')
    .select('id, product_slug, name');
  
  if (error) {
    console.error('Fetch error:', error.message);
    process.exit(1);
  }
  
  console.log(`Total products in database: ${allProducts.length}`);
  
  const problematic = allProducts.filter(
    p => p.product_slug && (p.product_slug.includes('/') || p.product_slug.includes('(') || p.product_slug.includes(')'))
  );
  
  console.log(`Products with problematic slugs: ${problematic.length}\n`);
  
  if (problematic.length === 0) {
    console.log('All slugs are clean! Nothing to fix.');
    return;
  }
  
  for (const product of problematic) {
    const oldSlug = product.product_slug;
    const newSlug = sanitizeSlug(oldSlug);
    
    console.log(`[${product.name}]`);
    console.log(`  OLD: ${oldSlug}`);
    console.log(`  NEW: ${newSlug}`);
    
    if (oldSlug === newSlug) {
      console.log(`  STATUS: unchanged\n`);
      continue;
    }
    
    // Check for conflicts
    const { data: existing } = await supabase
      .from('paperlisens_products_base')
      .select('id')
      .eq('product_slug', newSlug)
      .maybeSingle();
    
    if (existing) {
      console.log(`  STATUS: SKIPPED - "${newSlug}" already exists (id: ${existing.id})\n`);
      continue;
    }
    
    const { error: updateErr } = await supabase
      .from('paperlisens_products_base')
      .update({ product_slug: newSlug })
      .eq('id', product.id);
    
    if (updateErr) {
      console.log(`  STATUS: ERROR - ${updateErr.message}\n`);
    } else {
      console.log(`  STATUS: ✅ FIXED\n`);
    }
  }
  
  console.log('\n=== Migration Complete ===');
}

main().catch(console.error);
