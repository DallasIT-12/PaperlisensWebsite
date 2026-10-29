'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function LandingCta() {
  return (
    <section className="py-20 bg-[#000000] text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent to-amber-600/10 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 p-8 sm:p-14 lg:p-16 shadow-2xl shadow-orange-950/60 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-sm">
              <Icon icon="solar:star-fall-bold" />
              <span>Mulai Bersama Paperlisens Hari Ini</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Siap Bikin Kemasan Makanan Anda Tampil Lebih Menjual?
            </h2>
            
            <p className="text-orange-100 text-base sm:text-lg leading-relaxed font-medium">
              Ribuan UMKM, restoran, dan katering telah meningkatkan kepuasan pelanggan dengan kemasan food grade anti bocor dari Paperlisens.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-shrink-0">
            <Link
              href="/produk"
              className="flex items-center justify-center gap-2.5 bg-black hover:bg-neutral-900 text-white font-black text-base px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Icon icon="solar:shop-bold" className="text-xl text-orange-400" />
              <span>Buka Katalog Toko</span>
            </Link>

            <a
              href="https://wa.me/6281260001487?text=Halo%20Paperlisens,%20saya%20ingin%20tanya%20pemesanan%20kemasan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-white hover:bg-orange-50 text-neutral-900 font-extrabold text-base px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Icon icon="mdi:whatsapp" className="text-2xl text-green-600" />
              <span>Chat WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
