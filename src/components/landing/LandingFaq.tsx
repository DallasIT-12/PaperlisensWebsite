'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const faqs = [
  {
    q: 'Apakah semua kemasan Paperlisens sudah bersertifikat Food Grade?',
    a: 'Ya, 100%! Semua produk kertas dan laminasi yang kami gunakan bersertifikasi food grade, bebas dari zat kimia berbahaya (BPA-free & non-toxic), serta tahan panas dan aman bersentuhan langsung dengan makanan berminyak atau berkuah.',
  },
  {
    q: 'Berapa minimal order (MOQ) untuk produk ready stock di toko?',
    a: 'Untuk produk ready stock yang ada di katalog belanja, Anda bisa memesan mulai dari 1 pack (isi 25 atau 50 pcs tergantung jenis produk). Tidak ada batasan minimal yang memberatkan bagi UMKM pemula.',
  },
  {
    q: 'Bagaimana cara dan syarat pemesanan custom cetak logo brand sendiri?',
    a: 'Sangat mudah! Cukup hubungi admin WhatsApp kami, kirimkan file logo brand Anda (format PNG, AI, atau PDF), dan tentukan jenis box yang diinginkan. Tim kami akan menyiapkan estimasi harga dan mockup desain pra-cetak.',
  },
  {
    q: 'Berapa lama estimasi pengiriman dan kurir apa saja yang digunakan?',
    a: 'Pengiriman diproses langsung dari fasilitas kami di Jawa Timur (Kediri & Surabaya). Sistem checkout kami terhubung otomatis dengan Biteship (JNE, J&T, SiCepat, Anteraja, Paxel, hingga Kargo skala besar). Pengiriman biasanya memakan waktu 1–3 hari kerja untuk Pulau Jawa dan 3–6 hari untuk luar pulau.',
  },
  {
    q: 'Apakah ada potongan harga khusus untuk pembelian grosir / partai besar?',
    a: 'Tentu saja ada! Untuk pemesanan rutin atau dalam jumlah kartonan/ribuan pcs, kami menyediakan potongan harga grosir langsung dari pabrik. Silakan chat tim sales WhatsApp kami untuk penawaran harga terbaik.',
  },
  {
    q: 'Apakah saya bisa meminta sampel produk sebelum membeli dalam jumlah banyak?',
    a: 'Bisa! Kami menyediakan paket sampel untuk pengusaha F&B yang ingin memeriksa ketebalan bahan, ukuran presisi, dan uji ketahanan minyak sebelum melakukan pesanan partai besar.',
  },
];

export default function LandingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-neutral-50 text-neutral-900 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Icon icon="solar:question-circle-bold" />
            <span>Paling Sering Ditanyakan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Pertanyaan Umum (FAQ)
          </h2>
          <p className="mt-3 text-neutral-600 text-base">
            Informasi lengkap seputar kualitas kemasan, alur pemesanan, dan pengiriman Paperlisens.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-white border-orange-500 shadow-lg'
                    : 'bg-white/80 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-extrabold text-base sm:text-lg text-neutral-900">
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-orange-600 text-white rotate-180'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <Icon icon="solar:alt-arrow-down-linear" className="text-lg" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-neutral-600 text-sm sm:text-base leading-relaxed border-t border-neutral-100 mt-1">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="text-center mt-12 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-neutral-900 text-base">Punya pertanyaan lain yang belum terjawab?</h4>
            <p className="text-neutral-500 text-xs sm:text-sm">Tim customer care Paperlisens siap membantu Anda setiap hari kerja.</p>
          </div>
          <a
            href="https://wa.me/6281260001487?text=Halo%20Paperlisens,%20saya%20punya%20pertanyaan%20seputar%20produk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#000000] hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-md"
          >
            <Icon icon="ri:whatsapp-fill" className="text-xl text-green-400" />
            <span>Tanya Admin via WA</span>
          </a>
        </div>

      </div>
    </section>
  );
}
