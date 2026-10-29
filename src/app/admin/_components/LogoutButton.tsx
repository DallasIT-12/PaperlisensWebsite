'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 group"
        >
            <Icon icon="lucide:log-out" className="text-sm group-hover:-translate-x-1 transition-transform" />
            Keluar
        </button>
    );
}
