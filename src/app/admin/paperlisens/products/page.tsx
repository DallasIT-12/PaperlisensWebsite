'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { smartCompressToWebP } from '@/utils/image-utils';

// --- DND KIT IMPORTS ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- SORTABLE IMAGE COMPONENT ---
function SortableImage({ url, index, onRemove }: { url: string; index: number; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 group shadow-2xl cursor-grab active:cursor-grabbing"
    >
      <img
        src={url}
        alt=""
        className="w-full h-full object-cover select-none"
        {...attributes}
        {...listeners}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <Icon icon="lucide:x" className="text-xs" />
      </button>
      {index === 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#d6bd98] text-[#111827] text-[7px] font-black py-1 text-center uppercase tracking-tighter">
          Thumbnail
        </div>
      )}
    </div>
  );
}

// --- TYPE DEFINITIONS ---
type ProductVariant = {
  id: string;
  variant_name?: string | null;
  variant_name_en?: string | null;
  variant_name_zh?: string | null;
  variant_name_2?: string | null;
  variant_name_2_en?: string | null;
  variant_name_2_zh?: string | null;
  price: number;
  image: string;
  images: string[];
  variant_slug: string;
};

type Product = {
  id: string;
  productSlug: string;
  name: string;
  name_en?: string;
  name_zh?: string;
  category: string;
  slug?: string;
  price: number;
  image: string;
  images: string[];
  description?: string;
  description_en?: string;
  description_zh?: string;
  variants?: ProductVariant[];
  attr_label_1?: string;
  attr_label_2?: string;
};

const CATEGORY_SLUGS = [
  { slug: 'box-cupcake', label: 'Box Cupcake' },
  { slug: 'paper-tray', label: 'Paper Tray' },
  { slug: 'box-take-away', label: 'Box Take Away' },
  { slug: 'tempat-pensil', label: 'Tempat Pensil' },
  { slug: 'lain-lain', label: 'Lain-lain' },
];

const labelClasses = "block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]";
const inputClasses = "w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-[#d6bd98] text-white transition-all shadow-inner";

// --- HELPER: Check if URL is a Supabase Storage URL ---
function isSupabaseUrl(url: string): boolean {
  return typeof url === 'string' && url.includes('/storage/v1/object/public/');
}

// --- MAIN PAGE COMPONENT ---
export default function PaperlisensProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Shopee-style Variant Options
  const [v1Options, setV1Options] = useState<string[]>([]);
  const [v2Options, setV2Options] = useState<string[]>([]);
  const [isBulkPrice, setIsBulkPrice] = useState(false);

  // Track image URLs removed from gallery — used to delete them from Supabase Storage on save
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/paperlisens/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => filterCategory ? p.category === filterCategory : true)
      .filter(p => searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);
  }, [products, searchQuery, filterCategory]);

  const handleEditClick = async (product: Product) => {
    try {
      const res = await fetch(`/api/paperlisens/products/${encodeURIComponent(product.productSlug)}`);
      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        data = JSON.parse(JSON.stringify(product));
      }

      const dbImage = data.baseImage || '/placeholder.png';
      const dbGallery = Array.isArray(data.baseGallery) && data.baseGallery.length > 0
        ? data.baseGallery : [dbImage];
      const finalGallery = Array.from(new Set(dbGallery.filter((img: string) => !!img)));

      // Compute variant options first so we can run migration
      const v1s = Array.from(new Set((data.variants || []).map((v: any) => v.variant_name).filter(Boolean))) as string[];
      const v2s = Array.from(new Set((data.variants || []).map((v: any) => v.variant_name_2).filter(Boolean))) as string[];
      setV1Options(v1s);
      setV2Options(v2s);

      // MIGRATION: If product has v2, consolidate photos — one shared photo per v1 group.
      // Takes the first non-placeholder image found in each group and applies it to all children.
      // This means old per-combination photos are preserved and consolidated automatically.
      let finalVariants = data.variants || [];
      if (v2s.length > 0) {
        const groupPhotos: Record<string, string> = {};
        finalVariants.forEach((v: any) => {
          if (v.variant_name && v.image && v.image !== '/placeholder.png' && !v.image.includes('placeholder')) {
            if (!groupPhotos[v.variant_name]) groupPhotos[v.variant_name] = v.image;
          }
        });
        finalVariants = finalVariants.map((v: any) => ({
          ...v,
          image: groupPhotos[v.variant_name] || '/placeholder.png'
        }));
      }

      setEditingProduct({
        ...data,
        images: finalGallery,
        image: dbImage,
        variants: finalVariants,
        slug: data.slug || CATEGORY_SLUGS.find(c => c.label === data.category)?.slug || 'lain-lain'
      });

    } catch (err) {
      setEditingProduct(JSON.parse(JSON.stringify(product)));
    }
    setDeletedImageUrls([]);
    setIsEditModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct({
      id: '',
      productSlug: '',
      name: '',
      category: CATEGORY_SLUGS[0].label,
      slug: CATEGORY_SLUGS[0].slug,
      price: 0,
      image: '/placeholder.png',
      images: ['/placeholder.png'],
      description: '',
      variants: []
    });
    setV1Options([]);
    setV2Options([]);
    setDeletedImageUrls([]); // Reset deleted list for new products
    setIsEditModalOpen(true);
  };

  const generateVariants = () => {
    if (!editingProduct) return;

    const opt1 = v1Options.map(s => s.trim()).filter(Boolean);
    const opt2 = v2Options.map(s => s.trim()).filter(Boolean);

    if (opt1.length === 0 && opt2.length === 0) {
      alert('Masukkan setidaknya satu pilihan variasi.');
      return;
    }

    const existingVariants = editingProduct.variants || [];
    const variantMap = new Map();
    existingVariants.forEach(v => {
      const key = `${v.variant_name || ''}|${(v as any).variant_name_2 || ''}`;
      variantMap.set(key, v);
    });

    const newVariants: ProductVariant[] = [];

    if (opt1.length > 0 && opt2.length > 0) {
      opt1.forEach(o1 => {
        opt2.forEach(o2 => {
          const key = `${o1}|${o2}`;
          if (variantMap.has(key)) {
            newVariants.push(variantMap.get(key));
          } else {
            newVariants.push({
              id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              variant_name: o1,
              variant_name_2: o2,
              price: editingProduct.price,
              image: '/placeholder.png',
              images: [],
              variant_slug: `${editingProduct.productSlug || 'prod'}-v${Math.random().toString(36).substr(2, 5)}`
            } as any);
          }
        });
      });
    } else if (opt1.length > 0) {
      opt1.forEach(o1 => {
        const key = `${o1}|`;
        if (variantMap.has(key)) {
          newVariants.push(variantMap.get(key));
        } else {
          newVariants.push({
            id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            variant_name: o1,
            price: editingProduct.price,
            image: '/placeholder.png',
            images: [],
            variant_slug: `${editingProduct.productSlug || 'prod'}-v${Math.random().toString(36).substr(2, 5)}`
          } as any);
        }
      });
    } else if (opt2.length > 0) {
      opt2.forEach(o2 => {
        const key = `|${o2}`;
        if (variantMap.has(key)) {
          newVariants.push(variantMap.get(key));
        } else {
          newVariants.push({
            id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            variant_name: '',
            variant_name_2: o2,
            price: editingProduct.price,
            image: '/placeholder.png',
            images: [],
            variant_slug: `${editingProduct.productSlug || 'prod'}-v${Math.random().toString(36).substr(2, 5)}`
          } as any);
        }
      });
    }

    setEditingProduct({
      ...editingProduct,
      variants: newVariants
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    try {
      // 1. Delete removed images from Supabase Storage first
      if (deletedImageUrls.length > 0) {
        // Only attempt to delete files that are actually in Supabase Storage
        const supabaseToDelete = deletedImageUrls.filter(url => url.includes('/storage/v1/object/public/'));

        if (supabaseToDelete.length > 0) {
          console.log(`[ADMIN_SAVE] Cleaning up ${supabaseToDelete.length} deleted image(s) from storage...`);
          await Promise.allSettled(
            supabaseToDelete.map((imgUrl) =>
              fetch('/api/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: imgUrl }),
              }).then(r => r.json()).then(d => {
                if (d.deleted) console.log(`[STORAGE_CLEANUP] Deleted: ${imgUrl}`);
                else console.warn(`[STORAGE_CLEANUP] Failed: ${imgUrl}`, d);
              })
            )
          );
        }
        setDeletedImageUrls([]);
      }

      // 2. Save product data to database
      const isNew = !editingProduct.id || editingProduct.id.startsWith('new-');
      const targetSlug = editingProduct.productSlug;
      const url = isNew ? '/api/paperlisens/products' : `/api/paperlisens/products/${encodeURIComponent(targetSlug || '')}`;
      const method = isNew ? 'POST' : 'PUT';

      // Pastikan data yang dikirim bersih
      const payload = { ...editingProduct };
      if (isNew) {
        // Jangan kirim ID temporary ke backend agar backend generate ID baru yang valid
        delete (payload as any).id;
      }

      console.log(`[ADMIN_SAVE] Method: ${method}, URL: ${url}`);
      console.log(`[ADMIN_SAVE] Payload ID: ${payload.id || '(New Product)'}`);
      console.log(`[ADMIN_SAVE] Target Slug: ${targetSlug || '(Generated from name)'}`);

      if (!isNew && !targetSlug) {
        throw new Error('Product Slug tidak ditemukan. Tidak dapat mengupdate produk.');
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log('[ADMIN_SAVE] Success!');
        await fetchProducts();
        setIsEditModalOpen(false);
      } else {
        let errorMsg = 'Unknown error';
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errData = await res.json();
          errorMsg = errData.error || errData.message || JSON.stringify(errData);
        } else {
          const text = await res.text();
          errorMsg = text.slice(0, 200); // Ambil dikit aja kalau HTML
        }
        console.error('[ADMIN_SAVE] Error Response:', errorMsg);
        alert('Gagal menyimpan: ' + errorMsg);
      }
    } catch (err: any) {
      console.error('[ADMIN_SAVE] Fatal Error:', err);
      alert('Terjadi kesalahan saat menyimpan: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini? Semua varian juga akan terhapus.')) return;

    try {
      const res = await fetch(`/api/paperlisens/products/${encodeURIComponent(slug)}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
      } else {
        alert('Gagal menghapus produk.');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus.');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && editingProduct) {
      const oldIndex = editingProduct.images.indexOf(active.id as string);
      const newIndex = editingProduct.images.indexOf(over.id as string);

      const newImages = arrayMove(editingProduct.images, oldIndex, newIndex);
      setEditingProduct({
        ...editingProduct,
        images: newImages,
        image: newImages[0] // Update thumbnail utama otomatis
      });
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      {!isEditModalOpen ? (
        <div className="space-y-10">
          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-[#d6bd98] rounded-full" />
                <h1 className="text-3xl font-black text-white tracking-tight">Katalog Produk</h1>
              </div>
              <p className="text-slate-400 text-sm font-medium">
                Manajemen inventaris <span className="text-[#d6bd98] font-bold">Paperlisens</span> &bull; Total {products.length} Item
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/5 text-white rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                <Icon icon="lucide:download" className="text-lg" />
                Export CSV
              </button>
              <button
                onClick={handleAddClick}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#d6bd98] text-[#111827] rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#d6bd98]/20 hover:bg-white transition-all active:scale-95"
              >
                <Icon icon="lucide:plus-circle" className="text-lg" />
                Tambah Produk
              </button>
            </div>
          </div>

          {/* FILTER & SEARCH BOX */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 relative group">
              <Icon icon="lucide:search" className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d6bd98] transition-colors text-xl" />
              <input
                type="text"
                placeholder="Cari nama produk, kategori, atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-[#1e293b] border border-white/5 rounded-3xl outline-none focus:ring-2 focus:ring-[#d6bd98] text-slate-200 placeholder:text-slate-600 transition-all shadow-xl"
              />
            </div>
            <div className="relative">
              <Icon icon="lucide:filter" className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-lg" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-[#1e293b] border border-white/5 rounded-3xl outline-none focus:ring-2 focus:ring-[#d6bd98] text-slate-300 font-bold text-sm cursor-pointer appearance-none shadow-xl"
              >
                <option value="">Semua Kategori</option>
                {CATEGORY_SLUGS.map(cat => <option key={cat.slug} value={cat.label}>{cat.label}</option>)}
              </select>
              <Icon icon="lucide:chevron-down" className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-[#1e293b] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Informasi Produk</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Kategori</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Harga Satuan</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-40 text-center">
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-[#d6bd98]/10 rounded-full" />
                            <div className="absolute inset-0 border-4 border-[#d6bd98] rounded-full border-t-transparent animate-spin" />
                          </div>
                          <p className="text-slate-500 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Sinkronisasi Database...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-40 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-600">
                          <Icon icon="lucide:package-search" className="text-6xl opacity-20" />
                          <p className="font-bold text-lg">Produk tidak ditemukan</p>
                          <p className="text-sm font-medium max-w-xs mx-auto">Coba gunakan kata kunci lain atau reset filter kategori.</p>
                          <button
                            onClick={() => { setSearchQuery(''); setFilterCategory(''); }}
                            className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all"
                          >
                            Reset Pencarian
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6 max-w-md">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-[#0f172a] flex-shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-white text-base leading-snug line-clamp-2 group-hover:text-[#d6bd98] transition-colors">
                                {p.name}
                              </p>
                              <p className="text-[10px] font-black text-slate-500 uppercase mt-2 tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                                UID: {p.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            <Icon icon="lucide:tag" className="text-xs text-[#d6bd98]" />
                            {p.category}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col">
                            <p className="text-white font-black text-lg">
                              {(() => {
                                if (p.variants && p.variants.length > 0) {
                                  const prices = p.variants.map(v => v.price).filter(price => price > 0);
                                  if (prices.length > 0) {
                                    const min = Math.min(...prices);
                                    const max = Math.max(...prices);
                                    if (min === max) return `Rp ${min.toLocaleString('id-ID')}`;
                                    return `Rp ${min.toLocaleString('id-ID')} - ${max.toLocaleString('id-ID')}`;
                                  }
                                }
                                return `Rp ${p.price.toLocaleString('id-ID')}`;
                              })()}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Range Harga</p>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end items-center gap-3">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-[#d6bd98] text-[#d6bd98] hover:text-[#111827] rounded-2xl transition-all shadow-lg border border-white/5 group-hover:border-[#d6bd98]/50"
                            >
                              <Icon icon="lucide:edit-3" className="text-xl" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.productSlug)}
                              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-2xl transition-all shadow-lg border border-white/5 hover:border-rose-500/30"
                            >
                              <Icon icon="lucide:trash-2" className="text-xl" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        editingProduct && (
          <form onSubmit={handleSave} className="pb-28">
            {/* HEADER SECTION FOR EDIT */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl mb-8">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-all border border-white/10"
                >
                  <Icon icon="lucide:arrow-left" className="text-2xl" />
                </button>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-1.5 h-6 bg-[#d6bd98] rounded-full" />
                    <h1 className="text-3xl font-black text-white tracking-tight">
                      {editingProduct.id && !editingProduct.id.startsWith('new-') ? 'Edit Produk' : 'Tambah Produk Baru'}
                    </h1>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">
                    {editingProduct.id && !editingProduct.id.startsWith('new-') ? `UID: ${editingProduct.id}` : 'Silahkan isi detail produk di bawah ini'}
                  </p>
                </div>
              </div>
            </div>

            {/* ═══════════ SECTION 1: FOTO PRODUK ═══════════ */}
            <div className="bg-[#1e293b] rounded-3xl border border-white/5 shadow-2xl p-8 lg:p-10 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="lucide:image" className="text-[#d6bd98] text-xl" />
                <h2 className="text-lg font-black text-white tracking-tight">Foto Produk</h2>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-auto">Klik & tahan untuk mengurutkan</span>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="flex flex-wrap gap-4">
                  <SortableContext
                    items={editingProduct.images || []}
                    strategy={rectSortingStrategy}
                  >
                    {(editingProduct.images || []).map((img, idx) => (
                      <SortableImage
                        key={img}
                        url={img}
                        index={idx}
                        onRemove={() => {
                          const removedUrl = editingProduct.images[idx];
                          const newList = editingProduct.images.filter((_, i) => i !== idx);
                          setEditingProduct({
                            ...editingProduct,
                            images: newList,
                            image: newList.length > 0 ? newList[0] : '/placeholder.png'
                          });
                          // Track this URL for storage cleanup on save
                          setDeletedImageUrls(prev => [...prev, removedUrl]);
                        }}
                      />
                    ))}
                  </SortableContext>

                  <input
                    type="file"
                    id="main-gallery-upload"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      setIsSaving(true);
                      const uploadPromises = files.map(async (file) => {
                        try {
                          console.log(`[GALLERY_UPLOAD] Compressing ${file.name}...`);
                          const webpBlob = await smartCompressToWebP(file, 0.5);
                          if (!webpBlob) throw new Error('Compression failed');

                          const webpFile = new File([webpBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
                          const formData = new FormData();
                          formData.append('file', webpFile);

                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const data = await res.json();
                          return data.url;
                        } catch (err) {
                          console.error(`[GALLERY_UPLOAD] Error processing ${file.name}:`, err);
                          return null;
                        }
                      });
                      const urls = await Promise.all(uploadPromises);
                      const validUrls = urls.filter(u => !!u);
                      const newList = [...(editingProduct.images || []), ...validUrls];
                      setEditingProduct({
                        ...editingProduct,
                        images: newList,
                        image: newList[0]
                      });
                      setIsSaving(false);
                    }}
                  />
                  <label htmlFor="main-gallery-upload" className="w-24 h-24 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-2xl cursor-pointer transition-all gap-2">
                    <Icon icon="lucide:plus-circle" className="text-[#d6bd98] text-2xl" />
                    <span className="text-[8px] font-black text-slate-500 uppercase">Tambah</span>
                  </label>
                </div>
              </DndContext>

              <p className="text-[9px] text-slate-500 font-medium italic mt-4">Foto di urutan pertama (paling kiri) otomatis menjadi Thumbnail utama.</p>
            </div>

            {/* ═══════════ SECTION 2: INFORMASI DASAR ═══════════ */}
            <div className="bg-[#1e293b] rounded-3xl border border-white/5 shadow-2xl p-8 lg:p-10 mb-6">
              <div className="flex items-center gap-3 mb-8">
                <Icon icon="lucide:file-text" className="text-[#d6bd98] text-xl" />
                <h2 className="text-lg font-black text-white tracking-tight">Informasi Dasar</h2>
              </div>

              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className={labelClasses}>Nama Produk (ID) <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className={inputClasses}
                    required
                    placeholder="Masukkan nama produk"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Product Name (EN)</label>
                    <input
                      type="text"
                      value={(editingProduct as any).name_en || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value } as any)}
                      className={inputClasses}
                      placeholder="English name"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>产品名称 (ZH)</label>
                    <input
                      type="text"
                      value={(editingProduct as any).name_zh || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name_zh: e.target.value } as any)}
                      className={inputClasses}
                      placeholder="Chinese name"
                    />
                  </div>
                </div>

                {/* Category & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Kategori <span className="text-rose-400">*</span></label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => {
                        const selectedLabel = e.target.value;
                        const selectedSlug = CATEGORY_SLUGS.find(c => c.label === selectedLabel)?.slug || 'lain-lain';
                        setEditingProduct({
                          ...editingProduct,
                          category: selectedLabel,
                          slug: selectedSlug
                        });
                      }}
                      className={inputClasses}
                    >
                      {CATEGORY_SLUGS.map(cat => <option key={cat.slug} value={cat.label}>{cat.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Product Slug (Read-only)</label>
                    <input
                      type="text"
                      value={editingProduct.productSlug}
                      readOnly
                      className={`${inputClasses} opacity-50 cursor-not-allowed`}
                    />
                  </div>
                </div>

                {/* Berat Produk */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Berat Produk (gram) <span className="text-rose-400">*</span></label>
                    <input
                      type="number"
                      min="1"
                      value={(editingProduct as any).weight || 200}
                      onChange={(e) => setEditingProduct({ ...editingProduct, weight: parseInt(e.target.value) || 200 } as any)}
                      className={inputClasses}
                      placeholder="Contoh: 200"
                    />
                    <p className="text-[9px] text-slate-500 font-medium mt-2">Digunakan untuk menghitung ongkos kirim otomatis via RajaOngkir</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={labelClasses}>Deskripsi Produk (ID)</label>
                  <textarea
                    rows={4}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className={`${inputClasses} resize-none`}
                    placeholder="Jelaskan detail produk anda"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Description (EN)</label>
                    <textarea
                      rows={3}
                      value={(editingProduct as any).description_en || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description_en: e.target.value } as any)}
                      className={`${inputClasses} resize-none`}
                      placeholder="English description"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>产品描述 (ZH)</label>
                    <textarea
                      rows={3}
                      value={(editingProduct as any).description_zh || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description_zh: e.target.value } as any)}
                      className={`${inputClasses} resize-none`}
                      placeholder="Chinese description"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════ SECTION 3: INFORMASI PENJUALAN ═══════════ */}
            <div className="bg-[#1e293b] rounded-3xl border border-white/5 shadow-2xl p-8 lg:p-10 mb-6">
              <div className="flex items-center gap-3 mb-8">
                <Icon icon="lucide:bar-chart-3" className="text-[#d6bd98] text-xl" />
                <h2 className="text-lg font-black text-white tracking-tight">Informasi Penjualan</h2>
              </div>

              <div className="space-y-6">
                {/* Variant Labels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={labelClasses}>Label Variasi 1 (Contoh: Warna)</label>
                      <input
                        type="text"
                        value={(editingProduct as any).attr_label_1 || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, attr_label_1: e.target.value } as any)}
                        className={inputClasses}
                        placeholder="Contoh: Warna"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Pilihan Variasi 1</label>
                      <div className="space-y-3">
                        {v1Options.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...v1Options];
                                newOpts[idx] = e.target.value;
                                setV1Options(newOpts);
                              }}
                              className={`${inputClasses} py-3`}
                              placeholder="Contoh: Coklat"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newOpts = v1Options.filter((_, i) => i !== idx);
                                setV1Options(newOpts);
                              }}
                              className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/30"
                            >
                              <Icon icon="lucide:trash-2" className="text-lg" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setV1Options([...v1Options, ''])}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 border-dashed rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-2"
                        >
                          <Icon icon="lucide:plus" className="text-sm" /> Tambah Pilihan
                        </button>
                      </div>
                    </div>
                  </div>
                  {v2Options.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className={labelClasses}>Label Variasi 2 (Opsional: Ukuran)</label>
                        <button
                          type="button"
                          onClick={() => {
                            setV2Options([]);
                            if (editingProduct) {
                              setEditingProduct({ ...editingProduct, attr_label_2: '' } as any);
                            }
                          }}
                          className="text-[9px] font-bold text-rose-400 uppercase tracking-wider hover:text-rose-300 transition-colors flex items-center gap-1"
                        >
                          <Icon icon="lucide:x" className="text-xs" /> Hapus Variasi 2
                        </button>
                      </div>
                      <input
                        type="text"
                        value={(editingProduct as any).attr_label_2 || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, attr_label_2: e.target.value } as any)}
                        className={inputClasses}
                        placeholder="Contoh: Ukuran"
                      />
                      <div>
                        <label className={labelClasses}>Pilihan Variasi 2</label>
                        <div className="space-y-3">
                          {v2Options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...v2Options];
                                  newOpts[idx] = e.target.value;
                                  setV2Options(newOpts);
                                }}
                                className={`${inputClasses} py-3`}
                                placeholder="Contoh: 20 pcs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newOpts = v2Options.filter((_, i) => i !== idx);
                                  setV2Options(newOpts);
                                }}
                                className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/30"
                              >
                                <Icon icon="lucide:trash-2" className="text-lg" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setV2Options([...v2Options, ''])}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 border-dashed rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center gap-2"
                          >
                            <Icon icon="lucide:plus" className="text-sm" /> Tambah Pilihan
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setV2Options([''])}
                        className="w-full py-6 bg-white/[0.02] hover:bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5 border-dashed rounded-2xl font-bold text-xs uppercase transition-all flex flex-col items-center justify-center gap-2"
                      >
                        <Icon icon="lucide:plus-circle" className="text-2xl" />
                        <span>Tambah Variasi 2 (Opsional)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Default Price (Visible only if no variants) */}
                {(!editingProduct.variants || editingProduct.variants.length === 0) && (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className={labelClasses}>Harga Jual Dasar <span className="text-rose-400">*</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">Rp</span>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                          className={`${inputClasses} pl-12`}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={generateVariants}
                  className="w-full py-4 bg-white/5 hover:bg-[#d6bd98]/10 text-[#d6bd98] border border-[#d6bd98]/20 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 group"
                >
                  <Icon icon="lucide:refresh-cw" className="group-hover:rotate-180 transition-transform duration-500" />
                  {editingProduct.variants && editingProduct.variants.length > 0 ? 'Update Kombinasi Varian' : 'Generate Kombinasi Varian'}
                </button>

                {/* Price Range Display */}
                <div className="p-5 bg-[#0f172a] rounded-2xl border border-white/5">
                  <label className={labelClasses}>{editingProduct.variants && editingProduct.variants.length > 0 ? 'Rentang Harga (Otomatis dari Varian)' : 'Status Harga'}</label>
                  <p className="font-black text-[#d6bd98] text-xl mt-2">
                    {(() => {
                      if (editingProduct.variants && editingProduct.variants.length > 0) {
                        const prices = editingProduct.variants.map(v => v.price).filter(p => p > 0);
                        if (prices.length > 0) {
                          const min = Math.min(...prices);
                          const max = Math.max(...prices);
                          if (min === max) return `Rp ${min.toLocaleString('id-ID')}`;
                          return `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`;
                        }
                        return 'Harga varian belum diatur';
                      }
                      return editingProduct.price > 0 ? `Rp ${editingProduct.price.toLocaleString('id-ID')}` : 'Harga belum diatur';
                    })()}
                  </p>
                </div>
              </div>
            </div>


            {/* ═══════════ SECTION 4: DAFTAR VARIAN ═══════════ */}
            {editingProduct.variants && editingProduct.variants.length > 0 && (
              <div className="bg-[#1e293b] rounded-3xl border border-white/5 shadow-2xl p-8 lg:p-10 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon icon="lucide:layers" className="text-[#d6bd98] text-xl" />
                  <h2 className="text-lg font-black text-white tracking-tight">Daftar Varian</h2>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-2">({editingProduct.variants.length} kombinasi)</span>
                  <div className="ml-auto flex items-center gap-4">
                    {v2Options.length === 0 && (
                      <button type="button" onClick={() => {
                        const nv = [...(editingProduct.variants || [])];
                        nv.push({ id: `new-${Date.now()}`, variant_name: 'Varian Baru', price: editingProduct.price, image: '/placeholder.png', images: [], variant_slug: `${editingProduct.productSlug || 'prod'}-v${Date.now().toString(36)}` });
                        setEditingProduct({ ...editingProduct, variants: nv });
                      }} className="text-[10px] font-black text-[#d6bd98] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
                        <Icon icon="lucide:plus" /> Tambah
                      </button>
                    )}
                  </div>
                </div>

                {/* Bulk Update Controls */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl mb-6">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:sliders" className="text-[#d6bd98] text-base" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ubah Massal Varian:</span>
                  </div>
                  
                  {/* Bulk Price */}
                  <div className="flex items-center gap-2">
                    <div className="relative w-36">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px]">Rp</span>
                      <input
                        type="number"
                        placeholder="Harga Jual"
                        id="bulkPriceInput"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#d6bd98] text-white font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('bulkPriceInput') as HTMLInputElement;
                        const val = parseInt(input?.value);
                        if (isNaN(val) || val < 0) return;
                        const nv = (editingProduct.variants || []).map(v => ({ ...v, price: val }));
                        setEditingProduct({ ...editingProduct, variants: nv });
                      }}
                      className="px-3 py-2 bg-[#d6bd98] text-[#1a3636] font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-white hover:text-black transition-colors"
                    >
                      Set Harga
                    </button>
                  </div>

                  {/* Bulk Sold */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Terjual"
                      id="bulkSoldInput"
                      className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#d6bd98] text-white font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('bulkSoldInput') as HTMLInputElement;
                        const val = parseInt(input?.value);
                        if (isNaN(val) || val < 0) return;
                        const nv = (editingProduct.variants || []).map(v => ({ ...v, sold: val }));
                        setEditingProduct({ ...editingProduct, variants: nv });
                      }}
                      className="px-3 py-2 bg-slate-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-slate-600 transition-colors"
                    >
                      Set Terjual
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
                  {v2Options.length > 0 ? (
                    // ── GROUPED VIEW: Varian 1 = Parent (foto), Varian 2 = Children (harga) ──
                    (() => {
                      const groupOrder: string[] = [];
                      const groups: Record<string, { v: ProductVariant; idx: number }[]> = {};
                      (editingProduct.variants || []).forEach((v, idx) => {
                        const key = v.variant_name || '';
                        if (!groups[key]) { groups[key] = []; groupOrder.push(key); }
                        groups[key].push({ v, idx });
                      });

                      return groupOrder.map((groupName) => {
                        const groupItems = groups[groupName];
                        const groupPhoto = groupItems.find(g => g.v.image && g.v.image !== '/placeholder.png' && !g.v.image.includes('placeholder'))?.v.image || '/placeholder.png';
                        const hasPhoto = groupPhoto !== '/placeholder.png';
                        const uploadId = `v-group-${Date.now()}-${groupName.replace(/\W/g, '')}`;

                        return (
                          <div key={groupName} className="bg-[#0f172a] rounded-2xl border border-white/5 hover:border-[#d6bd98]/20 transition-all overflow-hidden">
                            {/* Parent Row */}
                            <div className="flex items-center gap-4 p-4 bg-white/[0.02] border-b border-white/5">
                              {/* Foto (shared for all children) */}
                              <div className="relative flex-shrink-0">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/30 border border-white/10">
                                  <img src={groupPhoto} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
                                </div>
                                <input type="file" id={uploadId} className="hidden" accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]; if (!file) return;
                                    setIsSaving(true);
                                    try {
                                      // Track old group photo for storage cleanup
                                      if (isSupabaseUrl(groupPhoto)) {
                                        setDeletedImageUrls(prev => [...prev, groupPhoto]);
                                      }
                                      const blob = await smartCompressToWebP(file, 0.5);
                                      if (!blob) throw new Error();
                                      const wf = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.webp', { type: 'image/webp' });
                                      const fd = new FormData(); fd.append('file', wf);
                                      const r = await fetch('/api/upload', { method: 'POST', body: fd });
                                      const d = await r.json();
                                      if (d.url) {
                                        const nv = (editingProduct.variants || []).map(v => v.variant_name === groupName ? { ...v, image: d.url } : v);
                                        setEditingProduct({ ...editingProduct, variants: nv });
                                      }
                                    } catch { } finally { setIsSaving(false); }
                                  }} />
                                <label htmlFor={uploadId} className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#d6bd98] hover:bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors" title="Upload foto (berlaku untuk semua varian 2)">
                                  <Icon icon="lucide:camera" className="text-[#111827] text-[10px]" />
                                </label>
                              </div>

                              {/* V1 Name */}
                              <div className="flex-1 min-w-0">
                                <span className="text-[8px] font-black text-[#d6bd98] uppercase tracking-widest block mb-1">Varian 1 · {groupItems.length} pilihan</span>
                                <input type="text" value={groupItems[0].v.variant_name || ''} placeholder="Nama Varian 1"
                                  onChange={(e) => {
                                    const newName = e.target.value;
                                    const nv = (editingProduct.variants || []).map(v => v.variant_name === groupName ? { ...v, variant_name: newName } : v);
                                    setEditingProduct({ ...editingProduct, variants: nv });
                                  }}
                                  className="bg-transparent border-b border-white/10 outline-none text-white font-bold text-sm focus:border-[#d6bd98] pb-1 w-full" />
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  <input type="text" value={(groupItems[0].v as any).variant_name_en || ''} placeholder="EN"
                                    onChange={(e) => { const nv = (editingProduct.variants || []).map(v => v.variant_name === groupName ? { ...v, variant_name_en: e.target.value } : v); setEditingProduct({ ...editingProduct, variants: nv }); }}
                                    className="bg-transparent border-b border-white/5 outline-none text-slate-400 text-[10px] focus:border-blue-400 pb-1 w-full" />
                                  <input type="text" value={(groupItems[0].v as any).variant_name_zh || ''} placeholder="ZH"
                                    onChange={(e) => { const nv = (editingProduct.variants || []).map(v => v.variant_name === groupName ? { ...v, variant_name_zh: e.target.value } : v); setEditingProduct({ ...editingProduct, variants: nv }); }}
                                    className="bg-transparent border-b border-white/5 outline-none text-slate-400 text-[10px] focus:border-emerald-400 pb-1 w-full" />
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                {hasPhoto && (
                                  <button type="button" onClick={() => {
                                    // Track the old photo URL for storage cleanup on save
                                    if (isSupabaseUrl(groupPhoto)) {
                                      setDeletedImageUrls(prev => [...prev, groupPhoto]);
                                    }
                                    const nv = (editingProduct.variants || []).map(v => v.variant_name === groupName ? { ...v, image: '/placeholder.png' } : v);
                                    setEditingProduct({ ...editingProduct, variants: nv });
                                  }} className="text-[8px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider transition-colors">Hapus Foto</button>
                                )}
                                <button type="button" onClick={() => {
                                  const newChild = { id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, variant_name: groupName, variant_name_2: '', price: editingProduct.price, image: groupPhoto, images: [], variant_slug: `${editingProduct.productSlug || 'prod'}-v${Math.random().toString(36).substr(2, 5)}` } as any;
                                  setEditingProduct({ ...editingProduct, variants: [...(editingProduct.variants || []), newChild] });
                                }} className="text-[8px] text-[#d6bd98] hover:text-white font-bold uppercase tracking-wider transition-colors flex items-center gap-1">
                                  <Icon icon="lucide:plus" className="text-[10px]" />+ Pilihan
                                </button>
                              </div>
                            </div>

                            {/* Children Rows (Varian 2) */}
                            <div className="divide-y divide-white/[0.03]">
                              {groupItems.map(({ v, idx }) => (
                                <div key={v.id} className="flex items-center gap-3 px-4 py-2.5 pl-6 hover:bg-white/[0.02] transition-colors">
                                  <span className="text-slate-600 text-xs flex-shrink-0">↳</span>
                                  <div className="flex-1 min-w-0">
                                    <input type="text" value={v.variant_name_2 || ''} placeholder="Nama Varian 2 (ID)"
                                      onChange={(e) => { const nv = [...(editingProduct.variants || [])]; nv[idx].variant_name_2 = e.target.value; setEditingProduct({ ...editingProduct, variants: nv }); }}
                                      className="bg-transparent border-b border-white/5 outline-none text-slate-200 font-medium text-sm focus:border-[#d6bd98] pb-0.5 w-full" />
                                    <div className="grid grid-cols-2 gap-2 mt-0.5">
                                      <input type="text" value={v.variant_name_2_en || ''} placeholder="EN"
                                        onChange={(e) => { const nv = [...(editingProduct.variants || [])]; nv[idx].variant_name_2_en = e.target.value; setEditingProduct({ ...editingProduct, variants: nv }); }}
                                        className="bg-transparent border-b border-white/5 outline-none text-slate-500 text-[10px] focus:border-blue-400 pb-0.5 w-full" />
                                      <input type="text" value={v.variant_name_2_zh || ''} placeholder="ZH"
                                        onChange={(e) => { const nv = [...(editingProduct.variants || [])]; nv[idx].variant_name_2_zh = e.target.value; setEditingProduct({ ...editingProduct, variants: nv }); }}
                                        className="bg-transparent border-b border-white/5 outline-none text-slate-500 text-[10px] focus:border-emerald-400 pb-0.5 w-full" />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="flex flex-col items-end">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] text-slate-500 font-bold">Rp</span>
                                        <input type="number" value={v.price}
                                          onChange={(e) => { const nv = [...(editingProduct.variants || [])]; nv[idx].price = parseInt(e.target.value) || 0; setEditingProduct({ ...editingProduct, variants: nv }); }}
                                          className="w-24 bg-white/5 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#d6bd98] text-white font-bold" />
                                      </div>
                                      <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter mt-1">Harga Jual</span>
                                    </div>

                                    <button type="button" onClick={() => { const nv = (editingProduct.variants || []).filter((_, i) => i !== idx); setEditingProduct({ ...editingProduct, variants: nv }); }}
                                      className="text-slate-600 hover:text-rose-500 transition-colors p-1">
                                      <Icon icon="lucide:trash-2" className="text-base" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    // ── FLAT LIST: Only Varian 1, each has own photo ──
                    (editingProduct.variants || []).map((v, idx) => (
                      <div key={v.id} className="flex items-center gap-4 p-4 bg-[#0f172a] rounded-2xl border border-white/5 hover:border-[#d6bd98]/20 transition-all">
                        {/* Photo */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/20 border border-white/10">
                            <img src={v.image || '/placeholder.png'} className="w-full h-full object-cover" />
                          </div>
                          <input type="file" id={`vf-${idx}`} className="hidden" accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]; if (!file) return;
                              setIsSaving(true);
                              try {
                                // Track old image for cleanup if replacing
                                const oldImg = editingProduct.variants?.[idx]?.image;
                                if (oldImg && isSupabaseUrl(oldImg)) {
                                  setDeletedImageUrls(prev => [...prev, oldImg]);
                                }
                                const blob = await smartCompressToWebP(file, 0.5); if (!blob) throw new Error();
                                const wf = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.webp', { type: 'image/webp' });
                                const fd = new FormData(); fd.append('file', wf);
                                const r = await fetch('/api/upload', { method: 'POST', body: fd });
                                const d = await r.json();
                                if (d.url) { const nv = [...(editingProduct.variants || [])]; nv[idx] = { ...nv[idx], image: d.url }; setEditingProduct({ ...editingProduct, variants: nv }); }
                              } catch { } finally { setIsSaving(false); }
                            }} />
                          <label htmlFor={`vf-${idx}`} className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d6bd98] rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                            <Icon icon="lucide:camera" className="text-[#111827] text-[8px]" />
                          </label>
                          {v.image && v.image !== '/placeholder.png' && !v.image.includes('placeholder') && (
                            <button type="button" onClick={() => {
                              if (isSupabaseUrl(v.image)) {
                                setDeletedImageUrls(prev => [...prev, v.image]);
                              }
                              const nv = [...(editingProduct.variants || [])]; nv[idx] = { ...nv[idx], image: '/placeholder.png' }; setEditingProduct({ ...editingProduct, variants: nv });
                            }} className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus foto varian">
                              <Icon icon="lucide:x" className="text-white text-[8px]" />
                            </button>
                          )}
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <input type="text" value={v.variant_name || ''} placeholder="Nama Varian (ID)"
                            onChange={(e) => { const nv = [...(editingProduct.variants || [])]; nv[idx].variant_name = e.target.value; setEditingProduct({ ...editingProduct, variants: nv }); }}
                            className="bg-transparent border-b border-white/10 outline-none text-white font-bold text-sm focus:border-[#d6bd98] pb-1 w-full" />
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={(v as any).variant_name_en || ''} placeholder="EN"
                              onChange={(e) => { const nv = [...(editingProduct.variants || [])]; (nv[idx] as any).variant_name_en = e.target.value; setEditingProduct({ ...editingProduct, variants: nv }); }}
                              className="bg-transparent border-b border-white/5 outline-none text-slate-400 text-[10px] focus:border-blue-400 pb-1 w-full" />
                            <input type="text" value={(v as any).variant_name_zh || ''} placeholder="ZH"
                              onChange={(e) => { const nv = [...(editingProduct.variants || [])]; (nv[idx] as any).variant_name_zh = e.target.value; setEditingProduct({ ...editingProduct, variants: nv }); }}
                              className="bg-transparent border-b border-white/5 outline-none text-slate-400 text-[10px] focus:border-emerald-400 pb-1 w-full" />
                          </div>
                        </div>

                        {/* Price & HPP */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] text-slate-500 font-bold">Rp</span>
                              <input type="number" value={v.price}
                                onChange={(e) => { const nv = [...(editingProduct.variants || [])]; nv[idx].price = parseInt(e.target.value) || 0; setEditingProduct({ ...editingProduct, variants: nv }); }}
                                className="w-24 bg-white/5 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#d6bd98] text-white font-bold" />
                            </div>
                            <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter mt-1">Harga Jual</span>
                          </div>



                          <button type="button" onClick={() => { const nv = (editingProduct.variants || []).filter((_, i) => i !== idx); setEditingProduct({ ...editingProduct, variants: nv }); }}
                            className="text-slate-600 hover:text-rose-500 transition-colors p-1">
                            <Icon icon="lucide:trash-2" className="text-base" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ═══════════ STICKY FOOTER ═══════════ */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 py-4 px-8 z-50">
              <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="px-8 py-3.5 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors border border-white/10 rounded-2xl hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-10 py-3.5 bg-[#d6bd98] text-[#111827] rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-[#d6bd98]/20 hover:bg-white transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <Icon icon="lucide:loader-2" className="animate-spin text-lg" />
                  ) : (
                    <Icon icon="lucide:save" className="text-lg" />
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        )
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(214, 189, 152, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(214, 189, 152, 0.4);
        }
      `}</style>
    </div>
  );
}
