'use client';

import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function AdminNavbar() {
    const pathname = usePathname();

    // Don't show navbar on login page
    if (pathname === '/admin/login') {
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 bg-[#1e293b]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#d6bd98] rounded-xl flex items-center justify-center shadow-lg shadow-[#d6bd98]/20 group-hover:rotate-12 transition-transform">
                        <Icon icon="lucide:printer" className="text-[#1e293b] text-xl" />
                    </div>
                    <div>
                        <span className="block font-black text-white text-lg leading-none tracking-tight">DALLAS</span>
                        <span className="block text-[10px] font-bold text-[#d6bd98] uppercase tracking-[0.2em] mt-0.5">Admin Panel</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2 md:gap-6">
                    <Link
                        href="/admin"
                        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-slate-400 hover:text-white"
                    >
                        <Icon icon="lucide:layout-dashboard" className="text-lg" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-slate-400 hover:text-white"
                    >
                        <Icon icon="lucide:shopping-bag" className="text-lg" />
                        <span className="hidden sm:inline">Pesanan</span>
                    </Link>
                    <Link
                        href="/admin/paperlisens/products"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-slate-400 hover:text-white"
                    >
                        <Icon icon="lucide:package" className="text-lg" />
                        <span className="hidden sm:inline">Produk</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-xs font-black uppercase tracking-widest text-slate-300"
                    >
                        <Icon icon="lucide:external-link" className="text-sm" />
                        Lihat Web
                    </Link>
                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
