'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/admin/paperlisens/products'); // Redirect to dashboard
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d6bd98]/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#d6bd98]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#d6bd98]/20">
                        <Icon icon="lucide:shield-check" className="text-[#d6bd98] text-3xl" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-2">Admin Portal</h1>
                    <p className="text-slate-400 text-sm font-medium">Masuk untuk mengelola produk & konten.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-600 focus:border-[#d6bd98] focus:ring-1 focus:ring-[#d6bd98] transition-all outline-none text-sm font-medium"
                                placeholder="Masukkan username admin"
                                disabled={loading}
                            />
                            <Icon icon="lucide:user" className="absolute left-3.5 top-3.5 text-slate-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-600 focus:border-[#d6bd98] focus:ring-1 focus:ring-[#d6bd98] transition-all outline-none text-sm font-medium"
                                placeholder="Masukkan password admin"
                                disabled={loading}
                            />
                            <Icon icon="lucide:lock" className="absolute left-3.5 top-3.5 text-slate-500" />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                            <Icon icon="lucide:alert-circle" className="text-rose-500 flex-shrink-0" />
                            <p className="text-xs font-bold text-rose-500">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#d6bd98] hover:bg-white text-[#0f172a] font-black uppercase text-xs tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-[#d6bd98]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Icon icon="lucide:loader-2" className="animate-spin text-lg" /> : 'Masuk Dashboard'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-slate-600 font-medium">
                        &copy; {new Date().getFullYear()} Dallas Company. Restricted Access.
                    </p>
                </div>
            </div>
        </div>
    );
}
