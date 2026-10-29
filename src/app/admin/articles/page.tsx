'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function AdminArticles() {
  const articles = [
    { id: 1, title: '7 Ide Bisnis Tren 2026 yang Wajib Kamu Coba!', category: 'Business', date: '12 Feb 2026', status: 'Published' },
    { id: 2, title: 'Kenapa Harus Pindah dari Plastik ke Kemasan Kertas?', category: 'Education', date: '10 Feb 2026', status: 'Published' },
    { id: 3, title: 'Mengenal Kertas Ivory: Material Premium untuk Packaging', category: 'Material', date: '08 Feb 2026', status: 'Published' },
    { id: 4, title: 'Offset Printing vs Digital Printing: Mana yang Lebih Untung?', category: 'Technical', date: '05 Feb 2026', status: 'Published' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Manajemen Artikel</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Kelola konten edukasi dan berita terbaru <span className="text-[#d6bd98] font-bold">Dallas Company</span>
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#d6bd98] text-[#111827] rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-white transition-all active:scale-95">
          <Icon icon="lucide:pen-tool" className="text-lg" />
          Tulis Artikel Baru
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-[#1e293b] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Judul Artikel</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Kategori</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tanggal</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {articles.map(article => (
                <tr key={article.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="max-w-md">
                      <p className="font-bold text-slate-200 text-sm leading-snug group-hover:text-[#d6bd98] transition-colors line-clamp-1">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{article.status}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-block px-3 py-1 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-slate-400 font-medium text-xs">
                      {article.date}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="p-2.5 bg-white/5 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl transition-all shadow-sm">
                        <Icon icon="lucide:edit-3" className="text-lg" />
                      </button>
                      <button className="p-2.5 bg-white/5 hover:bg-rose-500 text-slate-400 hover:text-white rounded-xl transition-all shadow-sm">
                        <Icon icon="lucide:trash-2" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
