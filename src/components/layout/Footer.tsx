'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer id="contact" className="relative bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-neutral-300 pt-14 pb-28 sm:pb-14 border-t border-orange-500/20 mt-20 overflow-hidden">
      {/* Ambient Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            {/* Logo with Light Gradient Badge for High Contrast & Visibility */}
            <div className="inline-flex items-center gap-3 mb-4 p-2.5 px-4 rounded-xl bg-gradient-to-r from-white via-neutral-50 to-neutral-100 shadow-md border border-neutral-200/80 transition-transform hover:scale-[1.02]">
              <img src="/logo-paperlisens.png" alt="Paperlisens" className="h-9 w-auto object-contain" />
              <span className="text-xl font-black text-neutral-950 tracking-wider">PAPERLISENS</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Pusat solusi kemasan berkualitas untuk kuliner, bakery, dan UMKM Indonesia. Box cupcake, paper tray, dan packaging custom langsung dari pabrik.
            </p>
          </div>
          <div>
            <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Navigasi & Produk
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/produk" className="text-orange-400 font-bold hover:text-orange-300 transition-colors flex items-center gap-1.5">
                <span>🛒 Katalog Toko (500+ Item)</span>
              </Link>
              <Link href="/category/box-cupcake" className="text-neutral-400 hover:text-orange-400 transition-colors">
                Box Cupcake & Muffin
              </Link>
              <Link href="/category/paper-tray" className="text-neutral-400 hover:text-orange-400 transition-colors">
                Paper Tray Food Grade
              </Link>
              <Link href="/category/box-take-away" className="text-neutral-400 hover:text-orange-400 transition-colors">
                Box Take Away & Lunch Box
              </Link>
              <Link href="/category/tempat-pensil" className="text-neutral-400 hover:text-orange-400 transition-colors">
                Tempat Pensil & Kotak Serbaguna
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-base font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Kontak & Bantuan
            </h4>
            <div className="text-neutral-400 text-sm flex flex-col gap-2.5">
              <p>Email: <a href="mailto:paperlisens@gmail.com" className="hover:text-white underline">paperlisens@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/6281260001487" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 underline font-semibold">(+62) 812-6000-1487</a></p>
              <div className="mt-2 text-xs text-neutral-500 leading-relaxed">
                Kediri, Jawa Timur, Indonesia
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 mt-10 pt-8 text-center text-xs text-neutral-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Paperlisens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;