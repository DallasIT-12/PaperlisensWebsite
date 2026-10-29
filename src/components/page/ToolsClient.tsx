'use client';

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TOOLS = [
    {
        id: 'pdf-export',
        name: 'PDF Export & Merge',
        description: 'Ekspor halaman tertentu dari beberapa file PDF dan gabungkan menjadi satu file baru.',
        icon: 'lucide:file-pie-chart',
        color: 'from-orange-500 to-red-600',
        lightColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        href: '/tools/pdf-export'
    },
    {
        id: 'cek-ongkir',
        name: 'Cek Ongkir',
        description: 'Cek tarif pengiriman semua ekspedisi Indonesia dalam satu aplikasi cepat.',
        icon: 'lucide:truck',
        color: 'from-emerald-500 to-emerald-600',
        lightColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        href: '/tools/cek-ongkir'
    },
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        description: 'Kompres ukuran gambar tanpa mengurangi kualitas secara signifikan.',
        icon: 'lucide:image',
        color: 'from-blue-500 to-indigo-600',
        lightColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        href: '/tools/image-compressor'
    },
    {
        id: 'jpg-to-pdf',
        name: 'JPG to PDF',
        description: 'Ubah gambar (JPG, PNG) menjadi file PDF berkualitas tinggi dengan cepat.',
        icon: 'lucide:file-image',
        color: 'from-pink-500 to-rose-600',
        lightColor: 'bg-rose-50',
        textColor: 'text-rose-600',
        href: '/tools/jpg-to-pdf'
    }
];

export default function ToolsClient() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16">
                    {/* Back Link */}
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#D4A017] transition-colors mb-8">
                        <Icon icon="lucide:arrow-left" className="text-lg" />
                        Kembali ke Beranda
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a3636] to-[#40534c] flex items-center justify-center shadow-xl"
                            >
                                <Icon icon="lucide:wrench" className="text-4xl text-white" />
                            </motion.div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
                            Pusat <span className="text-emerald-600">Alat Bantu</span>
                        </h1>
                        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
                            Kumpulan alat digital gratis dari Percetakan Dallas untuk memudahkan pekerjaan desain dan pengiriman Anda.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TOOLS.map((tool, idx) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link href={tool.href} className="group block h-full">
                                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon icon={tool.icon} className="text-2xl text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                        {tool.name}
                                    </h3>

                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                                        {tool.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-3 transition-all">
                                        Buka Alat
                                        <Icon icon="lucide:arrow-right" className="text-emerald-600" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Section in Tools */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 text-center border-t border-slate-200 pt-16"
                >
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Butuh Bantuan Lainnya?</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="https://wa.me/6281260001487"
                            target="_blank"
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-200"
                        >
                            <Icon icon="logos:whatsapp-icon" className="text-xl brightness-0 invert" />
                            Hubungi Admin Dallas
                        </Link>
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl font-bold transition-all"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
