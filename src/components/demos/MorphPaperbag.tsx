'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const slides = [
    {
        id: 'hero',
        bgText: 'DALLAS',
        title: ['Trusted by', 'Leaders'],
        subtitle: 'PRESTIGE PARTNERSHIP',
        description: 'Menjadi mitra terpercaya bagi institusi ternama seperti Bank Indonesia dalam menyediakan kemasan premium berkualitas tinggi.',
        accentPos: { top: '20%', right: '15%', size: '600px', color: '#D4A017' }
    },
    {
        id: 'gallery',
        bgText: 'GALLERY',
        title: ['Product', 'Showcase'],
        subtitle: 'PORTFOLIO KAMI',
        description: 'Eksplorasi berbagai desain paperbag kustom yang telah kami produksi untuk berbagai kebutuhan bisnis.',
        accentPos: { top: '30%', left: '40%', size: '500px', color: '#D4A017' }
    },
    {
        id: 'features',
        bgText: 'QUALITY',
        title: ['Eco', 'Friendly'],
        subtitle: 'BUILT TO PROTECT',
        description: 'Dibuat untuk ketahanan maksimal dengan material pilihan yang dapat didaur ulang.',
        items: [
            { icon: 'solar:shield-check-bold', label: 'Anti Sobek' },
            { icon: 'solar:leaf-bold', label: 'Ramah Lingkungan' },
            { icon: 'solar:bag-5-bold', label: 'Desain Kustom' }
        ],
        accentPos: { top: '10%', left: '10%', size: '800px', color: '#001D39' }
    },
    {
        id: 'specs',
        bgText: 'SPECS',
        title: ['Technical', 'Detail'],
        subtitle: 'INDUSTRIAL STANDARDS',
        description: 'Spesifikasi teknis yang menjamin keamanan dan keindahan produk di dalamnya.',
        details: [
            { label: 'Bahan', value: 'Ivory / Art Carton' },
            { label: 'Gramasi', value: '210 - 310 GSM' },
            { label: 'Print', value: 'Full Color Offset' }
        ],
        accentPos: { bottom: '5%', right: '10%', size: '700px', color: '#D4A017' }
    },
    {
        id: 'cta',
        bgText: 'ORDER',
        title: ['Ready to', 'Start?'],
        subtitle: 'KONSULTASI GRATIS',
        description: 'Bergabunglah dengan ratusan brand yang telah mempercayakan kemasannya kepada kami.',
        accentPos: { top: '50%', left: '50%', size: '1200px', color: '#1B1B1B', x: '-50%', y: '-50%' }
    }
];

const galleryImages = [
    "/paperbag.webp",
    "/foto%20paperbag.webp",
    "/paperbag%20(1).webp",
    "/paperbag%20(2).webp",
    "/paperbag%20(4).webp",
    "/paperbag%20(5).webp",
    "/paperbag%20(6).webp",
    "/paperbag%20(7).webp",
];


const MorphPaperbag = () => {
    const [index, setIndex] = useState(0);
    const s = slides[index];

    const next = () => setIndex((i) => (i + 1) % slides.length);
    const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

    // cinematic ease
    const morphEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

    return (
        <div className="relative w-full h-screen bg-[#FBFBFB] overflow-hidden font-sans select-none">
            
            {/* Background Immersion Text */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={s.bgText}
                    initial={{ opacity: 0, scale: 0.8, x: -100 }}
                    animate={{ opacity: 0.03, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 1.2, x: 100 }}
                    transition={{ duration: 1.5, ease: morphEase }}
                    className="absolute inset-0 flex items-center justify-center font-serif font-black text-[25vw] leading-none pointer-events-none"
                    style={{ color: '#1A1A1A' }}
                >
                    {s.bgText}
                </motion.div>
            </AnimatePresence>

            <LayoutGroup>
                <div className="relative w-full h-full max-w-[1600px] mx-auto flex items-center px-10 md:px-20 py-20">
                    
                    {/* Morphing Accent Shape */}
                    <motion.div
                        layoutId="morph-accent"
                        transition={{ duration: 1.5, ease: morphEase }}
                        className="absolute rounded-full opacity-10 pointer-events-none blur-[100px]"
                        style={{
                            ...s.accentPos,
                            backgroundColor: s.accentPos.color,
                            width: s.accentPos.size,
                            height: s.accentPos.size,
                        }}
                    />

                    <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-20">
                        
                        {/* Text Content Plane */}
                        <div className="flex flex-col space-y-8">
                            <div className="space-y-4">
                                <motion.div
                                    layoutId="subtitle-wrapper"
                                    transition={{ duration: 1.5, ease: morphEase }}
                                    className="overflow-hidden"
                                >
                                    <motion.span 
                                        key={index}
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        className="text-[#CC0000] font-bold tracking-[0.6em] uppercase text-xs block"
                                    >
                                        {s.subtitle}
                                    </motion.span>
                                </motion.div>

                                <div className="flex flex-col">
                                    {s.title.map((line, i) => (
                                        <div key={i} className="overflow-hidden">
                                            <motion.h1
                                                key={`${index}-${i}`}
                                                initial={{ y: '100%' }}
                                                animate={{ y: 0 }}
                                                transition={{ duration: 0.8, ease: morphEase, delay: 0.1 * i }}
                                                className="text-7xl md:text-9xl font-serif font-bold leading-[0.9] -tracking-widest"
                                            >
                                                {line}
                                            </motion.h1>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <motion.p
                                key={`desc-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-400 max-w-md leading-relaxed"
                            >
                                {s.description}
                            </motion.p>

                            {/* State Specific UI */}
                            <div className="min-h-[140px] flex items-center">
                                <AnimatePresence mode="wait">
                                    {index === 2 && (
                                        <motion.div 
                                            key="features-ui"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex gap-10"
                                        >
                                            {s.items?.map((item, i) => (
                                                <div key={i} className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-[#001D39]">
                                                        <Icon icon={item.icon} className="w-8 h-8" />
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#001D39] opacity-40">{item.label}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {index === 3 && (
                                        <motion.div 
                                            key="specs-ui"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="grid grid-cols-1 gap-4 w-full max-w-sm"
                                        >
                                            {s.details?.map((detail, i) => (
                                                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{detail.label}</span>
                                                    <span className="font-serif font-bold text-lg text-[#D4A017]">{detail.value}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {index === 4 && (
                                        <motion.div 
                                            key="cta-ui"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col gap-4"
                                        >
                                            <a 
                                                href="https://wa.me/6281260001487"
                                                className="group relative px-12 py-6 bg-white rounded-full overflow-hidden shadow-2xl flex items-center gap-4"
                                            >
                                                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                                <Icon icon="ri:whatsapp-fill" className="w-6 h-6 relative z-10 group-hover:text-white transition-colors" />
                                                <span className="relative z-10 font-bold text-lg group-hover:text-white transition-colors">Order via WhatsApp</span>
                                            </a>
                                        </motion.div>
                                    )}

                                    {index === 0 && (
                                        <motion.div
                                            key="hero-ui"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col gap-6"
                                        >
                                            <div className="flex items-center gap-4 py-3 px-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 w-fit">
                                                <div className="w-10 h-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center">
                                                    <Icon icon="solar:cup-star-bold" className="w-5 h-5 text-[#D4A017]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Elite Client</p>
                                                    <p className="font-serif font-bold text-[#001D39]">BANK INDONESIA</p>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ x: 10 }}
                                                onClick={next}
                                                className="flex items-center gap-6 group"
                                            >
                                                <span className="font-bold tracking-[0.3em] uppercase text-sm">Lihat Portfolio</span>
                                                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#D4A017] group-hover:border-[#D4A017] group-hover:text-white transition-all duration-300">
                                                    <Icon icon="solar:arrow-right-linear" className="w-5 h-5" />
                                                </div>
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {index === 1 && (
                                        <motion.div
                                            key="gallery-ui"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex flex-col gap-6"
                                        >
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em]">8+ Pilihan Desain Eksklusif</p>
                                            <div className="flex -space-x-4">
                                                {[0, 1, 2, 3].map((i) => (
                                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#FBFBFB] bg-gray-100 overflow-hidden">
                                                        <Image src={galleryImages[i]} alt="paperbag" width={48} height={48} className="object-cover" />
                                                    </div>
                                                ))}
                                                <div className="w-12 h-12 rounded-full border-2 border-[#FBFBFB] bg-[#001D39] flex items-center justify-center text-white text-xs font-bold">
                                                    +4
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Product Image Plane */}
                        <div className="relative h-[80vh] flex items-center justify-center">
                            
                            {/* Morphing Visual Anchor */}
                            <motion.div
                                layoutId="image-visual-base"
                                transition={{ duration: 1.5, ease: morphEase }}
                                className="absolute bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-gray-100"
                                style={{
                                    ...(index === 0 && { width: '450px', height: '550px', borderRadius: '40px', rotate: 5, y: -20 }),
                                    ...(index === 1 && { width: '90%', height: '80%', borderRadius: '40px', rotate: 0, x: 0, y: 0 }),
                                    ...(index === 2 && { width: '600px', height: '400px', borderRadius: '100px', rotate: -5, x: 20 }),
                                    ...(index === 3 && { width: '400px', height: '600px', borderRadius: '0px', rotate: 0, x: 80, y: 40 }),
                                    ...(index === 4 && { width: '80%', height: '80%', borderRadius: '300px', rotate: 12, scale: 0.8 }),
                                }}
                            />

                            {/* The Hero Product / Gallery Grid */}
                            <motion.div
                                layoutId="product-main-container"
                                transition={{ duration: 1.5, ease: morphEase }}
                                className="relative z-30 w-full h-full flex items-center justify-center"
                                style={{
                                    ...(index === 0 && { scale: 1.2, rotate: -2, y: 0 }),
                                    ...(index === 1 && { scale: 1, rotate: 0, x: 0 }),
                                    ...(index === 2 && { scale: 1.0, rotate: 3, x: -30 }),
                                    ...(index === 3 && { scale: 0.8, rotate: -1, x: 0, y: 20 }),
                                    ...(index === 4 && { scale: 1.4, rotate: -10, y: -40 }),
                                }}
                            >
                                {index === 1 ? (
                                    <motion.div
                                        key="gallery-grid"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8 }}
                                        className="relative w-full h-full p-10 overflow-hidden flex flex-col justify-center gap-6"
                                    >
                                        {/* Row 1: Drifting Right */}
                                        <motion.div 
                                            animate={{ x: [0, -200, 0] }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="flex gap-4 min-w-max"
                                        >
                                            {galleryImages.slice(0, 4).map((src, i) => (
                                                <motion.div
                                                    key={`row1-${src}`}
                                                    layoutId={i === 0 ? "inner-image-wrap" : `gallery-item-1-${i}`}
                                                    className="relative w-[300px] h-[400px] bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 shrink-0"
                                                    transition={{ duration: 1.5, ease: morphEase }}
                                                >
                                                    <Image src={src} alt="paperbag" fill className="object-cover" />
                                                </motion.div>
                                            ))}
                                            {galleryImages.slice(0, 4).map((src, i) => (
                                                <div key={`row1-clone-${i}`} className="relative w-[300px] h-[400px] bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 shrink-0">
                                                    <Image src={src} alt="paperbag" fill className="object-cover" />
                                                </div>
                                            ))}
                                        </motion.div>

                                        {/* Row 2: Drifting Left */}
                                        <motion.div 
                                            animate={{ x: [-200, 0, -200] }}
                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                            className="flex gap-4 min-w-max"
                                        >
                                            {galleryImages.slice(4, 8).map((src, i) => (
                                                <motion.div
                                                    key={`row2-${src}`}
                                                    layoutId={`gallery-item-2-${i}`}
                                                    className="relative w-[300px] h-[400px] bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 shrink-0"
                                                    transition={{ duration: 1.5, ease: morphEase }}
                                                >
                                                    <Image src={src} alt="paperbag" fill className="object-cover" />
                                                </motion.div>
                                            ))}
                                            {galleryImages.slice(4, 8).map((src, i) => (
                                                <div key={`row2-clone-${i}`} className="relative w-[300px] h-[400px] bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 shrink-0">
                                                    <Image src={src} alt="paperbag" fill className="object-cover" />
                                                </div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="single-product"
                                        layoutId="inner-image-wrap"
                                        className="relative w-full h-full"
                                        transition={{ duration: 1.5, ease: morphEase }}
                                    >
                                        <Image
                                            src="/paperbag.webp"
                                            alt="Paperbag"
                                            fill
                                            priority
                                            className="object-contain drop-shadow-[0_45px_100px_rgba(0,0,0,0.2)]"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Floating Detail Badges */}
                            <AnimatePresence>
                                {index === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        className="absolute -right-10 top-1/4 p-6 bg-white shadow-2xl rounded-[40px] z-40 border border-gray-50"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-gray-300 uppercase mb-2">Build Tech</span>
                                            <Icon icon="solar:shield-check-bold" className="w-10 h-10 text-[#D4A017]" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </LayoutGroup>

            {/* Navigation Overlay */}
            <div className="absolute bottom-20 left-10 md:left-20 flex gap-4 z-50">
                <button
                    onClick={prev}
                    className="w-16 h-16 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                    <Icon icon="solar:alt-arrow-left-linear" className="w-8 h-8" />
                </button>
                <button
                    onClick={next}
                    className="w-16 h-16 rounded-full bg-black text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                >
                    <Icon icon="solar:alt-arrow-right-linear" className="w-8 h-8" />
                </button>
            </div>

            {/* Global Slide Progress Bar (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 z-50">
                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (index + 1) / slides.length }}
                    className="h-full bg-[#CC0000] origin-left"
                />
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:wght@100..900&display=swap');
                
                .font-serif { font-family: 'Playfair Display', serif; }
                .font-sans { font-family: 'Montserrat', sans-serif; }
            `}</style>
        </div>
    );
};

export default MorphPaperbag;
