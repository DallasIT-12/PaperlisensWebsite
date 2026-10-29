/**
 * Paperlisens product + variants schema helpers.
 * Base product: shared name, description, and MAIN GALLERY.
 * Variants: specific price and ONE specific image per variant.
 */

export type ProductBase = {
  id: string;
  product_slug: string;
  name: string;
  name_en?: string | null;
  name_zh?: string | null;
  description?: string | null;
  description_en?: string | null;
  description_zh?: string | null;
  category: string;
  image?: string | null; // Thumbnail Utama
  images?: string[] | any; // Galeri Utama
  weight?: number | null; // Berat dalam gram
  slug: string;
  attr_label_1?: string | null;
  attr_label_2?: string | null;
  price?: number | null;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  variant_name?: string | null;
  variant_name_en?: string | null;
  variant_name_zh?: string | null;
  variant_name_2?: string | null;
  variant_name_2_en?: string | null;
  variant_name_2_zh?: string | null;
  price: number;
  image: string;
  images: string[] | any;
  sold: number;
  variant_slug: string;
};

function toImages(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Flatten base + variants into display format (Marketplace Style) */
export function flattenBaseAndVariants(
  bases: ProductBase[],
  variantsByProductId: Map<string, ProductVariant[]>
): Array<{
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
  variants?: ProductVariant[];
  attr_label_1?: string | null;
  attr_label_2?: string | null;
  weight?: number | null;
}> {
  const result: any[] = [];

  for (const base of bases) {
    const vars = variantsByProductId.get(base.id) || [];
    const imgSet = new Set<string>();
    const finalImages: string[] = [];

    const skip = (url: string) => !url || url === '/placeholder.png' || url.includes('placeholder');

    // 1. PRIORITAS UTAMA: Gunakan Galeri dari BASE (Produk Utama)
    const baseGallery = toImages(base.images);
    if (base.image && !skip(base.image)) {
      finalImages.push(base.image);
      imgSet.add(base.image);
    }

    for (const url of baseGallery) {
      if (url && !skip(url) && !imgSet.has(url)) {
        finalImages.push(url);
        imgSet.add(url);
      }
    }

    // 2. JANGAN ambil dari varian secara otomatis agar tidak mencampuradukkan foto.
    // Biarkan galeri produk hanya berisi foto produk utama saja.
    if (finalImages.length === 0) {
      finalImages.push('/placeholder.png');
    }

    const totalSold = vars.reduce((s, v) => s + (v.sold || 0), 0);

    // Logika Angka Terjual yang Konsisten & Akumulatif:
    // 1. Generate angka "bonus" tetap berdasarkan ID produk (agar tidak berubah saat refresh)
    const getBaseSold = (id: string) => {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash % 400) + 50; // Menghasilkan angka tetap antara 50 - 450
    };

    const initialBonus = getBaseSold(base.id);

    // 2. Hasil akhir adalah Bonus Tetap + Data Riil dari Database
    const displaySold = initialBonus + totalSold;

    const firstVariant = vars[0];
    const minPrice = vars.length ? Math.min(...vars.map((v) => v.price)) : 0;

    result.push({
      id: base.id,
      productSlug: base.product_slug,
      name: base.name,
      name_en: base.name_en,
      name_zh: base.name_zh,
      variant: firstVariant?.variant_name ?? null,
      variant_en: firstVariant?.variant_name_en ?? null,
      variant_zh: firstVariant?.variant_name_zh ?? null,
      description: base.description,
      description_en: base.description_en,
      description_zh: base.description_zh,
      category: base.category,
      price: minPrice || firstVariant?.price || base.price || 0,
      image: finalImages[0] || base.image || '/placeholder.png',
      images: finalImages.length > 0 ? finalImages : ['/placeholder.png'],
      sold: displaySold,
      slug: base.slug,
      variants: vars.map(v => ({
        ...v,
        images: toImages(v.images)
      })),
      attr_label_1: base.attr_label_1,
      attr_label_2: base.attr_label_2,
      weight: base.weight ?? 200,
    });
  }

  result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  return result;
}
