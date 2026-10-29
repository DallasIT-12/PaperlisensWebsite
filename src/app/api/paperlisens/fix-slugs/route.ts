import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\//g, '-')           // Replace / with -
    .replace(/[()]/g, '')          // Remove parentheses
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/-{2,}/g, '-')        // Collapse multiple dashes
    .replace(/^-|-$/g, '');        // Trim leading/trailing dashes
}

/**
 * GET /api/paperlisens/fix-slugs
 * 
 * One-time migration endpoint to fix product slugs containing "/" characters.
 * These cause 404 errors because Next.js interprets "/" as a path separator.
 * 
 * This endpoint:
 * 1. Finds all products in paperlisens_products_base with "/" in product_slug
 * 2. Sanitizes each slug (replaces / with -, removes parentheses, collapses dashes)
 * 3. Updates the database
 * 
 * Safe to run multiple times (idempotent).
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Find all products with "/" in their slug
    const { data: allProducts, error: fetchErr } = await supabase
      .from('paperlisens_products_base')
      .select('id, product_slug, name');
    
    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }
    
    const problematicProducts = (allProducts || []).filter(
      (p: any) => p.product_slug && (p.product_slug.includes('/') || p.product_slug.includes('(') || p.product_slug.includes(')'))
    );
    
    if (problematicProducts.length === 0) {
      return NextResponse.json({ 
        message: 'No problematic slugs found. All slugs are clean!',
        totalProducts: allProducts?.length || 0
      });
    }
    
    const results: any[] = [];
    
    for (const product of problematicProducts) {
      const oldSlug = product.product_slug;
      const newSlug = sanitizeSlug(oldSlug);
      
      if (oldSlug === newSlug) {
        results.push({ id: product.id, name: product.name, oldSlug, newSlug, status: 'unchanged' });
        continue;
      }
      
      // Check if newSlug already exists (to avoid duplicates)
      const { data: existing } = await supabase
        .from('paperlisens_products_base')
        .select('id')
        .eq('product_slug', newSlug)
        .maybeSingle();
      
      if (existing) {
        results.push({ 
          id: product.id, 
          name: product.name, 
          oldSlug, 
          newSlug, 
          status: 'skipped - new slug already exists',
          conflictId: existing.id 
        });
        continue;
      }
      
      // Update the slug
      const { error: updateErr } = await supabase
        .from('paperlisens_products_base')
        .update({ product_slug: newSlug })
        .eq('id', product.id);
      
      if (updateErr) {
        results.push({ id: product.id, name: product.name, oldSlug, newSlug, status: 'error', error: updateErr.message });
      } else {
        results.push({ id: product.id, name: product.name, oldSlug, newSlug, status: 'fixed' });
      }
    }
    
    return NextResponse.json({
      message: `Processed ${problematicProducts.length} problematic slug(s)`,
      totalProducts: allProducts?.length || 0,
      fixed: results.filter(r => r.status === 'fixed').length,
      skipped: results.filter(r => r.status.startsWith('skipped')).length,
      errors: results.filter(r => r.status === 'error').length,
      results
    });
  } catch (err) {
    console.error('Fix slugs error:', err);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
