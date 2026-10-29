'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

const categories = [
  {
    title: 'Box Cupcake & Muffin',
    slug: 'box-cupcake',
    desc: 'Tersedia isi 4, 6, 9, 12, hingga 16 dengan sekat kokoh dan mika transparan jernih.',
    image: '/paperlisens cupcake.webp',
    tag: 'Best Seller',
  },
  {
    title: 'Paper Tray Food Grade',
    slug: 'paper-tray',
    desc: 'Wadah saji makanan cepat saji, sosis, corndog, dan gorengan. Tahan minyak & anti bocor.',
    image: '/paperlisens papertray.webp',
    tag: 'Favorit UMKM',
  },
  {
    title: 'Box Take Away & Lunch Box',
    slug: 'box-take-away',
    desc: 'Kemasan makanan bekal praktis, sistem kancing tanpa lem, kuat dan higienis.',
    image: '/paperlisens box takeaway.webp',
    tag: 'Resto & Cafe',
  },
  {
    title: 'Tempat Pensil & Kotak Unik',
    slug: 'tempat-pensil',
    desc: 'Packaging kreatif serbaguna untuk souvenir, stationery, maupun hampers acara.',
    image: '/tempat_pensil.webp',
    tag: 'Eksklusif',
  },
  {
    title: 'Box Bakery & Roti',
    slug: 'box-bakery',
    desc: 'Dus roti manis, donat motif, bolu, dan roll cake dengan desain menarik & premium.',
    image: '/box bakery.webp',
    tag: 'Bakery Specialist',
  },
  {
    title: 'Box Nasi & Catering',
    slug: 'box-nasi',
    desc: 'Kotak nasi tebal, higienis, dan elegan untuk hajatan, syukuran, dan usaha katering.',
    image: '/box nasi (1).webp',
    tag: 'Catering Ready',
  },
];

export default function LandingCategories() {
  return (
    <section id="kategori" className="py-20 bg-neutral-50 text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold uppercase tracking-wider mb-3">
              <Icon icon="solar:folder-with-files-bold" />
              <span>Jelajahi Berdasarkan Kategori</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Pilihan Kategori Kemasan Unggulan
            </h2>
            <p className="mt-2 text-neutral-600 text-base max-w-xl">
              Temukan bentuk, ukuran, dan spesifikasi kemasan yang paling pas untuk produk kuliner Anda.
            </p>
          </div>

          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold text-sm bg-orange-50 hover:bg-orange-100 border border-orange-200 px-5 py-2.5 rounded-xl transition-all self-start md:self-auto"
          >
            <span>Buka Semua Produk di Toko</span>
            <Icon icon="solar:arrow-right-linear" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-2xl hover:border-orange-500/60 transition-all duration-300 flex flex-col"
            >
              {/* Image Container with Zoom */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#000000]/90 backdrop-blur-sm text-orange-400 text-xs font-black px-3 py-1 rounded-full border border-orange-500/30">
                  {cat.tag}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow justify-between bg-white">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-orange-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 group-hover:text-orange-600 transition-colors">
                    Lihat Koleksi
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <Icon icon="solar:arrow-right-linear" className="text-sm" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
