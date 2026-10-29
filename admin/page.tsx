'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Produk', value: '48', icon: 'lucide:package', color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+12% bln ini' },
    { name: 'Kategori', value: '5', icon: 'lucide:grid', color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: 'Stabil' },
    { name: 'WhatsApp Click', value: '1.2k', icon: 'lucide:phone-outgoing', color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+24% bln ini' },
    { name: 'Artikel Aktif', value: '4', icon: 'lucide:file-text', color: 'text-rose-400', bg: 'bg-rose-500/10', trend: '+1 baru' },
  ];

  const recentActivity = [
    { user: 'Admin', action: 'Update Harga', target: 'Cup A Motif', time: '2 jam yang lalu' },
    { user: 'Admin', action: 'Tambah Artikel', target: 'Ide Bisnis 2026', time: '5 jam yang lalu' },
    { user: 'System', action: 'Sync Database', target: '48 Item Success', time: '12 jam yang lalu' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1e293b] via-[#1e293b] to-[#0f172a] p-10 border border-white/5 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d6bd98]/10 border border-[#d6bd98]/20 text-[#d6bd98] text-[10px] font-black uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 bg-[#d6bd98] rounded-full animate-pulse" />
              Sistem Aktif
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
              Halo, <span className="text-[#d6bd98]">Administrator</span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg font-medium">
              Kelola seluruh operasional digital Dallas Company dan Paperlisens dari satu panel kendali.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Server Status</p>
              <p className="text-emerald-400 font-bold flex items-center gap-2">
                <Icon icon="lucide:check-circle" /> Online
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Region</p>
              <p className="text-slate-200 font-bold flex items-center gap-2">
                <Icon icon="lucide:globe" /> ID-JKT
              </p>
            </div>
          </div>
        </div>
        {/* Abstract Background patterns */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#d6bd98]/5 to-transparent pointer-events-none" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Stats & Quick Actions */}
        <div className="lg:col-span-3 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div 
                key={stat.name} 
                className="group relative overflow-hidden rounded-3xl bg-[#1e293b] p-6 border border-white/5 hover:border-[#d6bd98]/30 transition-all duration-500 shadow-lg"
              >
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4 shadow-inner group-hover:scale-110 transition-transform`}>
                  <Icon icon={stat.icon} className="text-2xl" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.name}</p>
                <div className="flex items-end gap-3 mt-1">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] font-bold text-emerald-500 mb-1.5">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1e293b] rounded-[2.5rem] p-10 border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-[#d6bd98] rounded-full" />
                <h3 className="text-xl font-black text-white uppercase tracking-wider">Aksi Cepat Manajemen</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Link 
                href="/admin/paperlisens/products" 
                className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-[#d6bd98] transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#d6bd98]/10 group-hover:bg-[#1e293b]/20 flex items-center justify-center mb-6 transition-colors">
                  <Icon icon="lucide:package-plus" className="text-3xl text-[#d6bd98] group-hover:text-[#1e293b]" />
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-[#1e293b] mb-1">Katalog Produk</h4>
                <p className="text-sm text-slate-400 group-hover:text-[#1e293b]/70 font-medium">Update harga & stok Paperlisens.</p>
              </Link>

              <Link 
                href="/admin/orders" 
                className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-amber-500 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 group-hover:bg-[#1e293b]/20 flex items-center justify-center mb-6 transition-colors">
                  <Icon icon="lucide:shopping-bag" className="text-3xl text-amber-400 group-hover:text-white" />
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-white mb-1">Pesanan Masuk</h4>
                <p className="text-sm text-slate-400 group-hover:text-white/70 font-medium">Pantau & kelola order pelanggan.</p>
              </Link>

              <Link 
                href="/admin/articles" 
                className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-blue-500 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 group-hover:bg-[#1e293b]/20 flex items-center justify-center mb-6 transition-colors">
                  <Icon icon="lucide:file-edit" className="text-3xl text-blue-400 group-hover:text-white" />
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-white mb-1">Editor Artikel</h4>
                <p className="text-sm text-slate-400 group-hover:text-white/70 font-medium">Tulis konten edukatif & promosi.</p>
              </Link>

              <Link 
                href="/admin/paperlisens/categories" 
                className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-emerald-500 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 group-hover:bg-[#1e293b]/20 flex items-center justify-center mb-6 transition-colors">
                  <Icon icon="lucide:layout-grid" className="text-3xl text-emerald-400 group-hover:text-white" />
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-white mb-1">Kategori</h4>
                <p className="text-sm text-slate-400 group-hover:text-white/70 font-medium">Atur klasifikasi produk jualan.</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log & Status */}
        <div className="space-y-8">
          <div className="bg-[#1e293b] rounded-[2.5rem] p-8 border border-white/5 shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Aktivitas Terbaru</h3>
            </div>
            
            <div className="space-y-6 flex-1">
              {recentActivity.map((act, i) => (
                <div key={i} className="relative pl-6 pb-6 border-l border-white/10 last:pb-0">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]" />
                  <p className="text-xs font-black text-[#d6bd98] uppercase tracking-tighter mb-1">{act.user}</p>
                  <p className="text-sm font-bold text-slate-200">{act.action}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">{act.target} &bull; {act.time}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Database Sync</p>
                  <span className="text-[10px] font-bold text-emerald-500">100%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
              <button className="mt-6 w-full py-4 bg-[#d6bd98] text-[#111827] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-lg active:scale-95">
                Semua Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
