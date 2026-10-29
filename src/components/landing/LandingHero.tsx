'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-[#000000] text-white pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-white/10">
      {/* Background Glows & Accent Gradients (Only Orange and Amber, Zero Blue) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-orange-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Trust Tag, Value Proposition, Dual CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide uppercase shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <span>Pabrik & Produsen Kemasan Food Grade Terpercaya</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Kemasan Makanan Berkualitas,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300">
                Bikin Brand Kuliner Anda Naik Kelas
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Pusat paper tray, box cupcake, lunch box takeaway, dan kemasan kustom ramah lingkungan. Dibuat dari bahan food grade bersertifikat, anti bocor minyak, dengan harga langsung dari produsen untuk UMKM hingga restoran nasional.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/produk"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-xl shadow-orange-950/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Icon icon="solar:shop-2-bold" className="text-2xl" />
                <span>Jelajahi Katalog Produk</span>
              </Link>

              <a
                href="https://wa.me/6281260001487?text=Halo%20Paperlisens,%20saya%20tertarik%20tanya%20kemasan%20food%20grade%20dan%20custom%20sablon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-orange-500/50 font-bold text-base px-7 py-4 rounded-xl transition-all duration-300 hover:text-orange-400 backdrop-blur-sm"
              >
                <Icon icon="ri:whatsapp-fill" className="text-2xl text-green-400" />
                <span>Konsultasi via WhatsApp</span>
              </a>
            </div>

            {/* Quick Badges below CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-neutral-400 font-medium">
              <div className="flex items-center gap-2">
                <Icon icon="solar:shield-check-bold" className="text-orange-400 text-lg" />
                <span>100% Food Grade Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:box-minimalistic-bold" className="text-orange-400 text-lg" />
                <span>Ready Stock 500+ Model</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:delivery-bold" className="text-orange-400 text-lg" />
                <span>Kirim Cepat Seluruh RI</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Center Image Card */}
              <div className="relative z-10 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#121212] backdrop-blur-md group">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#1a1a1a]">
                  <img
                    src="/paperlisens produk unggulan (1).webp"
                    alt="Koleksi Paperlisens"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/paperlisens.jpg';
                    }}
                  />
                </div>
                <div className="p-5 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">Koleksi Terlaris</span>
                      <h3 className="text-lg font-bold text-white">Paper Tray & Box Food Grade</h3>
                    </div>
                    <Link 
                      href="/produk" 
                      className="text-xs font-bold text-neutral-200 bg-white/10 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Lihat</span>
                      <Icon icon="solar:arrow-right-linear" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Mini Product 1 - Top Right */}
              <div className="hidden sm:block absolute -top-8 -right-6 z-20 w-44 bg-[#141414] border border-white/20 p-2.5 rounded-xl shadow-xl backdrop-blur-md animate-bounce [animation-duration:6s]">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/paperlisens cupcake.webp" 
                    alt="Box Cupcake" 
                    className="w-12 h-12 rounded-lg object-cover bg-[#1a1a1a]"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                  />
                  <div>
                    <span className="text-[10px] text-orange-400 font-bold block">Box Cupcake</span>
                    <span className="text-xs font-extrabold text-white">Isi 4, 6, 9 & 12</span>
                  </div>
                </div>
              </div>

              {/* Floating Trust Badge - Bottom Left */}
              <div className="absolute bottom-2 left-2 sm:-bottom-6 sm:-left-6 z-20 bg-[#121212]/95 border border-orange-500/40 p-3 sm:p-3.5 rounded-xl shadow-2xl backdrop-blur-md max-w-[200px] sm:max-w-[220px]">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Icon icon="solar:medal-star-bold" className="text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 sm:gap-1 text-amber-400 text-xs">
                      <Icon icon="solar:star-bold" />
                      <Icon icon="solar:star-bold" />
                      <Icon icon="solar:star-bold" />
                      <Icon icon="solar:star-bold" />
                      <Icon icon="solar:star-bold" />
                    </div>
                    <p className="text-xs font-bold text-white mt-0.5">10.000+ UMKM & Resto</p>
                    <p className="text-[10px] text-neutral-400">Puas Bermitra</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
