'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useCart } from '@/context/CartContext';

export default function LandingFeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/paperlisens/products')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Take 8 items with valid images
          const valid = data.filter((p) => p && (p.image || p.images?.[0]));
          setProducts(valid.slice(0, 8));
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="py-20 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Icon icon="solar:fire-bold" />
            <span>Paling Banyak Dipesan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Produk Terlaris Minggu Ini
          </h2>
          <p className="mt-3 text-neutral-600 text-base">
            Dapatkan kemasan makanan food grade kualitas terbaik dengan harga grosir langsung dari lini produksi kami.
          </p>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-neutral-100 p-4 border border-neutral-200">
                <div className="aspect-square bg-neutral-200 rounded-xl mb-4" />
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((item) => {
              const displayImage = item.image || item.images?.[0] || '/placeholder.png';
              const price = Number(item.price) || 0;
              const originalPrice = Math.round(price * 1.15);

              return (
                <div
                  key={item.id || item.productSlug}
                  className="group rounded-2xl bg-white border border-neutral-200 hover:border-orange-500/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden">
                    <img
                      src={displayImage}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.png';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                      HEMAT 15%
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
                        {item.category || 'Food Grade'}
                      </span>
                      <Link
                        href={`/product/${encodeURIComponent(item.productSlug)}`}
                        className="block font-bold text-neutral-900 text-xs sm:text-sm hover:text-orange-600 transition-colors line-clamp-2 min-h-[36px] sm:min-h-[40px] leading-snug"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-100 flex items-center justify-between gap-1.5 sm:gap-2">
                      <div>
                        <span className="text-[11px] sm:text-xs text-neutral-400 line-through block leading-tight">
                          {formatRupiah(originalPrice)}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-neutral-900 leading-tight">
                          {formatRupiah(price)}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(item, 1)}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-200 transition-all duration-200 shadow-sm"
                        title="Tambah ke Keranjang"
                        aria-label="Tambah ke Keranjang"
                      >
                        <Icon icon="solar:cart-plus-bold" className="text-lg sm:text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            Katalog sedang disinkronkan. Silakan kunjungi halaman katalog produk.
          </div>
        )}

        {/* Bottom CTA to Full Catalog */}
        <div className="text-center mt-14">
          <Link
            href="/produk"
            className="inline-flex items-center gap-3 bg-[#000000] hover:bg-orange-600 text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Icon icon="solar:bag-5-bold" className="text-xl text-orange-500 group-hover:text-white" />
            <span>Lihat Semua 500+ Produk di Toko Paperlisens</span>
            <Icon icon="solar:arrow-right-linear" className="text-lg" />
          </Link>
        </div>

      </div>
    </section>
  );
}
