const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dvduwjfazvtchdozzfvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZHV3amZhenZ0Y2hkb3p6ZnZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ3NDg2MSwiZXhwIjoyMDg3MDUwODYxfQ.DuSfaaoSXmMY6JBEy4iPhuhRnpu_2DGKPrkZ_CoFlJ0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDuplicateImages() {
  // Fix product pt-011-5: remove duplicate thumbnail from images array
  const productId = 'pt-011-5';
  
  const { data: product, error } = await supabase
    .from('paperlisens_products_base')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return;
  }

  console.log('Current image (thumbnail):', product.image);
  console.log('Current images array:', product.images);

  // The duplicate thumbnail URL to remove
  const duplicateUrl = 'https://dvduwjfazvtchdozzfvo.supabase.co/storage/v1/object/public/products/1770972712193-tumbnail-1772174410167.webp';
  
  let images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]');
  
  console.log('\nBefore fix - images count:', images.length);
  
  // Remove the duplicate
  images = images.filter(url => url !== duplicateUrl);
  
  console.log('After fix - images count:', images.length);
  console.log('New images array:', images);

  // Update the database
  const { error: updateError } = await supabase
    .from('paperlisens_products_base')
    .update({ images: images })
    .eq('id', productId);

  if (updateError) {
    console.error('Error updating product:', updateError);
  } else {
    console.log('\n✅ Successfully removed duplicate thumbnail from product', productId);
  }
}

fixDuplicateImages();
