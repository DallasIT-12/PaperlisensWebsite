'use client';

import React from 'react';
import { Icon } from '@iconify/react';

const reviews = [
  {
    name: 'Dewi Kartika',
    role: 'Owner Dapoer Bunda, Kediri',
    text: 'Paper tray dari Paperlisens beneran tahan minyak dan panas! Jualan corndog sama sosis bakar jadi jauh lebih higienis dan kelihatan berkelas. Pelanggan banyak yang puji packaging-nya rapi.',
    rating: 5,
    tag: 'Paper Tray Food Grade',
  },
  {
    name: 'Budi Santoso',
    role: 'Founder Kuki & Co Bakery, Surabaya',
    text: 'Box cupcake isi 6 dan 12-nya presisi banget, kuenya gak geser sama sekali waktu diantar ojol. Mika transparan bagian atasnya jernih banget, bikin visual kue kelihatan premium.',
    rating: 5,
    tag: 'Box Cupcake',
  },
  {
    name: 'Rian Pratama',
    role: 'Owner Toast Kopi Corner, Malang',
    text: 'Puas banget order custom cetak logo di Paperlisens. Tinta sablonnya tajam dan gak bau, aman buat makanan panas. CS-nya juga ramah dan pengerjaannya cepat tepat waktu.',
    rating: 5,
    tag: 'Custom Cetak Logo',
  },
  {
    name: 'Hj. Siti Aminah',
    role: 'Berkah Catering, Sidoarjo',
    text: 'Dus nasi tebal, waktu ditumpuk 10 tingkat gak meleyot. Sangat membantu operasional katering hajatan ribuan porsi. Harganya juga langsung pabrik jadi margin kami terjaga.',
    rating: 5,
    tag: 'Box Nasi & Catering',
  },
];

export default function LandingTestimonials() {
  return (
    <section className="py-20 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Icon icon="solar:chat-round-like-bold" />
            <span>Kisah Sukses Mitra Kuliner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Dipercaya Lebih dari 10.000+ Bisnis F&B
          </h2>
          <p className="mt-3 text-neutral-600 text-base">
            Inilah alasan mengapa pelaku usaha bakery, kafe, katering, dan UMKM setia menggunakan kemasan Paperlisens.
          </p>
        </div>

        {/* Testimonials Grid - Neutral Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-orange-500/50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-500 text-base mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Icon key={i} icon="solar:star-bold" />
                  ))}
                </div>

                <p className="text-neutral-700 text-sm leading-relaxed mb-6 italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider block mb-1">
                  {rev.tag}
                </span>
                <h3 className="font-extrabold text-neutral-900 text-sm">{rev.name}</h3>
                <p className="text-xs text-neutral-500">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Logos Strip */}
        <div className="mt-16 pt-12 border-t border-neutral-200 text-center">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8">
            DIPILIH OLEH BERBAGAI BRAND KULINER & UMKM TERKEMUKA
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {[1, 2, 3, 5, 7, 8, 10, 12].map((num) => (
              <img
                key={num}
                src={`/logo brand (${num}).webp`}
                alt={`Partner ${num}`}
                className="h-9 w-auto object-contain hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
