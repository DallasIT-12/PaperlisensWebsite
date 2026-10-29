'use client';

import React from 'react';
import { Icon } from '@iconify/react';

const steps = [
  {
    num: '01',
    title: 'Konsultasi & Pilih Model',
    desc: 'Tentukan ukuran, jenis kertas (Ivory Food Grade atau Kraft Cokelat), dan kirimkan file logo brand Anda.',
    icon: 'solar:chat-round-call-bold',
  },
  {
    num: '02',
    title: 'Desain & ACC Sampel',
    desc: 'Tim kreatif Paperlisens akan membuatkan mockup 3D dan proofing cetak sebelum proses cetak massal berjalan.',
    icon: 'solar:palette-bold',
  },
  {
    num: '03',
    title: 'Produksi Presisi Tinggi',
    desc: 'Dicetak menggunakan mesin modern berkecepatan tinggi dengan tinta bersertifikat food-grade, tajam dan rapi.',
    icon: 'solar:settings-bold',
  },
  {
    num: '04',
    title: 'Pengiriman Seluruh RI',
    desc: 'Pesanan dikemas kuat dengan proteksi ekstra dan dikirim langsung ke lokasi usaha Anda tepat waktu.',
    icon: 'solar:box-bold',
  },
];

export default function LandingCustomPackaging() {
  return (
    <section id="custom" className="py-24 bg-[#000000] text-white border-b border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-700/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading - Font Putih dengan Aksen Oranye */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Icon icon="solar:pen-new-square-bold" />
            <span>Layanan Spesialis Custom Printing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ingin Cetak Kemasan Berlogo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Brand Kuliner Sendiri?
            </span>
          </h2>
          <p className="mt-4 text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
            Tingkatkan nilai jual dan profesionalisme produk kuliner Anda dengan kemasan custom. Minimal order terjangkau khusus UMKM dan kafe berkembang.
          </p>
        </div>

        {/* 4 Steps Grid - Neutral Dark Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-7 rounded-2xl bg-[#141414] border border-white/10 hover:border-orange-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-orange-500/40 group-hover:text-orange-500 transition-colors">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <Icon icon={step.icon} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-bold text-orange-400 tracking-wider uppercase">
                Step {step.num}
              </div>
            </div>
          ))}
        </div>

        {/* Action Box Banner - Neutral Dark Gradient */}
        <div className="rounded-3xl bg-gradient-to-r from-[#121212] via-[#141414] to-[#1c1c1c] border border-orange-500/30 p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Konsultasikan Kebutuhan Kemasan Bisnis Anda
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base max-w-xl">
              Dapatkan estimasi biaya, rekomendasi bahan tahan minyak, dan bantuan layout desain cuma-cuma dari tim spesialis kemasan Paperlisens.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <a
              href="https://wa.me/6281260001487?text=Halo%20Paperlisens,%20saya%20ingin%20konsultasi%20custom%20cetak%20logo%20kemasan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Icon icon="ri:whatsapp-fill" className="text-2xl text-green-300" />
              <span>Chat WhatsApp Spesialis Custom</span>
            </a>

            <a
              href="/portofolio_produk.pdf"
              download="Portofolio_Paperlisens.pdf"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-neutral-200 border border-white/20 font-bold text-sm px-6 py-4 rounded-xl transition-all"
            >
              <Icon icon="solar:document-text-bold" className="text-xl text-orange-400" />
              <span>Unduh Portofolio PDF</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
