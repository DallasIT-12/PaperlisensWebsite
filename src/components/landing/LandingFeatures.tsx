'use client';

import React from 'react';
import { Icon } from '@iconify/react';

const features = [
  {
    icon: 'solar:shield-check-bold',
    title: '100% Food Grade Certified',
    desc: 'Semua kemasan Paperlisens tersertifikasi higienis & aman bersentuhan langsung dengan makanan panas, hangat, maupun dingin.',
  },
  {
    icon: 'solar:waterdrops-bold',
    title: 'Greaseproof & Anti Bocor',
    desc: 'Dilengkapi lapisan food grade tahan minyak dan air. Tidak rembes meski untuk makanan berminyak, saus kental, atau berkuah.',
  },
  {
    icon: 'solar:tag-price-bold',
    title: 'Harga Langsung dari Pabrik',
    desc: 'Beli ecer maupun grosir dengan harga produsen tangan pertama. Sangat menguntungkan untuk margin usaha kuliner Anda.',
  },
  {
    icon: 'solar:delivery-bold',
    title: 'Pengiriman Seluruh Nusantara',
    desc: 'Bekerja sama dengan puluhan kurir reguler dan kargo (Biteship). Kirim cepat & aman ke seluruh kota di Indonesia.',
  },
  {
    icon: 'solar:pen-new-square-bold',
    title: 'Custom Cetak Logo Brand',
    desc: 'Dukung branding usaha kuliner Anda dengan cetak logo custom pada box & paper tray dengan kualitas sablon & cetak tajam.',
  },
  {
    icon: 'solar:box-minimalistic-bold',
    title: '500+ Model & Varian Ukuran',
    desc: 'Mulai dari box cupcake, paper tray sosis, lunch box takeaway, hingga tempat pensil, kami sediakan lengkap sesuai kebutuhan.',
  },
];

export default function LandingFeatures() {
  return (
    <section id="keunggulan" className="py-20 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading - Font Hitam Pekat dengan Aksen Oranye */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Icon icon="solar:stars-bold" />
            <span>Standar Kualitas Paperlisens</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Mengapa Ribuan Bisnis Kuliner Memilih <span className="text-orange-600">Paperlisens</span>?
          </h2>
          <p className="mt-4 text-neutral-600 text-base sm:text-lg leading-relaxed">
            Kami mengutamakan keamanan makanan, estetika kemasan, dan kepastian pasokan bagi pengusaha F&B di Indonesia.
          </p>
        </div>

        {/* Feature Cards Grid - Background Putih / Netral, Border Halus Netral, Icon Oranye */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-orange-500/50 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <Icon icon={item.icon} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                <span>Food Grade Standard</span>
                <Icon icon="solar:arrow-right-linear" className="ml-1 text-sm" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
