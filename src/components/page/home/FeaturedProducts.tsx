'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const ClassicProductCardGrid = () => {
    const t = useTranslations('Categories');
    const tFeatured = useTranslations('FeaturedProducts');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const categories = [
        {
            title: t('hampers.title'),
            slug: "kotak-hampers",
            img: "/kotak%20hampers.webp",
            desc: t('hampers.desc'),
            tags: [t('hampers.tags.tag1'), t('hampers.tags.tag2')],
            images: [
                "/box hampers kraft (1).webp", "/box hampers kraft (2).webp", "/box hampers kraft (3).webp",
                "/box hampers natal (1).webp", "/box hampers natal (2).webp", "/box hampers natal (3).webp",
                "/gable box (1).webp", "/gable box (10).webp", "/gable box (11).webp", "/gable box (12).webp",
                "/gable box (13).webp", "/gable box (14).webp", "/gable box (15).webp", "/gable box (16).webp",
                "/gable box (17).webp", "/gable box (18).webp", "/gable box (19).webp", "/gable box (2).webp",
                "/gable box (20).webp", "/gable box (3).webp", "/gable box (4).webp", "/gable box (5).webp",
                "/gable box (6).webp", "/gable box (7).webp", "/gable box (8).webp", "/gable box (9).webp",
                "/gable box idul fitri (1).webp", "/gable box idul fitri (2).webp", "/gable box idul fitri (3).webp",
                "/gable box idul fitri (4).webp", "/gable box idul fitri (5).webp", "/gable box idul fitri (6).webp",
                "/gable box idul fitri (7).webp", "/gable box idul fitri (8).webp", "/hardbox (1).webp",
                "/hardbox (2).webp", "/hardbox (3).webp", "/kotak hampers.webp"
            ]
        },
        {
            title: t('bakery.title'),
            slug: "kotak-bakery",
            img: "/kotak%20cake.webp",
            desc: t('bakery.desc'),
            tags: [t('bakery.tags.tag1'), t('bakery.tags.tag2')],
            images: [
                "/box donat motif (1).webp", "/box donat motif (1).webp", "/box donat motif (2).webp",
                "/box donat motif (2).webp", "/box donat motif (3).webp", "/box donat motif (3).webp",
                "/box donat motif (4).webp", "/box donat motif (4).webp", "/box donat motif (5).webp",
                "/box donat motif (6).webp", "/box donat motif.webp", "/box roti bakar (1).webp",
                "/box roti bakar (2).webp", "/box roti bakar (3).webp", "/box slice cake-1.webp",
                "/box slice cake-2.webp", "/box slice cake.webp", "/box tart handle (1).webp",
                "/box tart handle (2).webp", "/box tart handle (3).webp", "/box tart handle (4).webp",
                "/box tart handle (5).webp", "/box tart handle (6).webp", "/cheese cake (1).webp",
                "/cheese cake (2).webp", "/cheese cake (3).webp", "/cheese cake (4).webp",
                "/cupcake isi 12 (1).webp", "/cupcake isi 12 (2).webp", "/cupcake isi 12 (3).webp",
                "/cupcake isi 12 (4).webp", "/cupcake isi 12 (5).webp", "/cupcake isi 12 (6).webp",
                "/cupcake isi 16 (1).webp", "/cupcake isi 16 (2).webp", "/cupcake isi 16 (3).webp",
                "/cupcake isi 16 (4).webp", "/cupcake isi 16 (5).webp", "/cupcake isi 4 (1).webp",
                "/cupcake isi 4 (2).webp", "/cupcake isi 4 (3).webp", "/cupcake isi 4 (4).webp",
                "/cupcake isi 4 motif (1).webp", "/cupcake isi 4 motif (2).webp", "/cupcake isi 4 motif (3).webp",
                "/cupcake isi 4 motif (4).webp", "/cupcake isi 4 motif (5).webp", "/cupcake isi 6 (1).webp",
                "/cupcake isi 6 (2).webp", "/cupcake isi 6 (3).webp", "/cupcake isi 9 (1).webp",
                "/cupcake isi 9 (2).webp", "/cupcake isi 9 (3).webp", "/cupcake isi 9 (4).webp",
                "/cupcake isi 9 (5).webp", "/cupcake isi 9 (6).webp", "/cupcake isi 9 (7).webp",
                "/cupcake isi 9 (8).webp", "/cupcake isi 9 (9).webp", "/dallas donat isi 3.webp",
                "/dallas donat isi 6.webp", "/donat isi 1(1).webp", "/donat isi 1(2).webp", "/donat isi 1.webp",
                "/kotak cake.webp", "/kotak cupcake isi 4 (1).webp", "/kotak cupcake isi 4 (2).webp",
                "/kotak cupcake isi 4 (3).webp", "/kotak cupcake isi 4 (4).webp", "/kotak cupcake isi 4 (5).webp",
                "/kotak cupcake isi 4 (6).webp", "/kotak cupcake isi 4 (7).webp", "/kotak cupcake isi 6 (1).webp",
                "/kotak cupcake isi 6 (2).webp", "/kotak cupcake isi 6 (3).webp", "/kotak cupcake isi 6 (4).webp",
                "/kotak cupcake motif isi 1 (1).webp", "/kotak cupcake motif isi 1 (2).webp",
                "/kotak rollcake (1).webp", "/kotak rollcake (2).webp", "/kotak rollcake (3).webp",
                "/kotak rollcake (4).webp", "/kotak rollcake (5).webp", "/kotak rollcake (6).webp",
                "/kotak rollcake (7).webp", "/kotak rollcake (8).webp", "/kotak rollcake (9).webp",
                "/kotak rollcake mika (1).webp", "/kotak rollcake mika (2).webp", "/kotak rollcake mika (3).webp",
                "/kotak rollcake mika (4).webp", "/paperlisens cupcake.webp", "/tenteng cupcake isi 6 (1).webp",
                "/tenteng cupcake isi 6 (2).webp", "/tenteng cupcake isi 6 (3).webp", "/tenteng cupcake isi 6 (4).webp",
                "/tusuk roti (1).webp", "/tusuk roti (2).webp"
            ]
        },
        {
            title: t('rokok.title'),
            slug: "rokok",
            img: "/custom%20rokok%203.webp",
            desc: t('rokok.desc'),
            tags: [t('rokok.tags.tag1'), t('rokok.tags.tag2')],
            images: [
                "/custom rokok (1).webp", "/custom rokok (10).webp", "/custom rokok (11).webp",
                "/custom rokok (12).webp", "/custom rokok (13).webp", "/custom rokok (14).webp",
                "/custom rokok (15).webp", "/custom rokok (16).webp", "/custom rokok (17).webp",
                "/custom rokok (18).webp", "/custom rokok (19).webp", "/custom rokok (2).webp",
                "/custom rokok (20).webp", "/custom rokok (21).webp", "/custom rokok (22).webp",
                "/custom rokok (23).webp", "/custom rokok (24).webp", "/custom rokok (3).webp",
                "/custom rokok (4).webp", "/custom rokok (5).webp", "/custom rokok (6).webp",
                "/custom rokok (7).webp", "/custom rokok (8).webp", "/custom rokok (9).webp",
                "/custom rokok 1.webp", "/custom rokok 2.webp", "/custom rokok 3.webp",
                "/custom rokok 4.webp", "/custom rokok.webp", "/foto rokok 1.webp",
                "/foto rokok.webp", "/kotak rokok 1.webp"
            ]
        },
        {
            title: t('nasi.title'),
            slug: "kotak-nasi",
            img: "/kotak%20nasi%20(1).webp",
            desc: t('nasi.desc'),
            tags: [t('nasi.tags.tag1'), t('nasi.tags.tag2')],
            images: [
                "/kotak nasi (1).webp", "/kotak nasi (2).webp", "/kotak nasi (3).webp",
                "/kotak nasi (4).webp", "/kotak nasi (5).webp", "/kotak nasi (6).webp",
                "/kotak nasi (7).webp", "/kotak nasi (8).webp", "/kotak nasi (9).webp"
            ]
        },
        {
            title: t('buku.title'),
            slug: "buku",
            img: "/buku%20(6).webp",
            desc: t('buku.desc'),
            tags: [t('buku.tags.tag1')],
            images: [
                "/buku (1).webp", "/buku (2).webp", "/buku (3).webp",
                "/buku (4).webp", "/buku (5).webp", "/buku (6).webp",
                "/buku (7).webp", "/buku (8).webp", "/buku (9).webp", "/foto buku.webp"
            ]
        },
        {
            title: t('kalender.title'),
            slug: "kalender",
            img: "/foto%20kalender.webp",
            desc: t('kalender.desc'),
            tags: [t('kalender.tags.tag1')],
            images: [
                "/foto kalender.webp", "/kalender (1).webp", "/kalender (2).webp",
                "/kalender (3).webp", "/kalender (4).webp", "/kalender.webp"
            ]
        },
        {
            title: t('paperbag.title'),
            slug: "paperbag",
            img: "/paperbag.webp",
            desc: t('paperbag.desc'),
            tags: [t('paperbag.tags.tag1'), t('paperbag.tags.tag2')],
            images: [
                "/foto paperbag.webp", "/paperbag (1).webp", "/paperbag (2).webp",
                "/paperbag (3).webp", "/paperbag (4).webp", "/paperbag (5).webp",
                "/paperbag (6).webp", "/paperbag (7).webp", "/paperbag (8).webp", "/paperbag.webp"
            ]
        },
        {
            title: t('map.title'),
            slug: "map",
            img: "/map.webp",
            desc: t('map.desc'),
            tags: [t('map.tags.tag1'), t('map.tags.tag2')],
            images: [
                "/map (1).webp", "/map (10).webp", "/map (11).webp", "/map (2).webp",
                "/map (3).webp", "/map (4).webp", "/map (5).webp", "/map (6).webp",
                "/map (7).webp", "/map (8).webp", "/map (9).webp", "/map.webp"
            ]
        },
        {
            title: t('brosur.title'),
            slug: "brosur",
            img: "/foto%20brosur.webp",
            desc: t('brosur.desc'),
            tags: [t('brosur.tags.tag1')],
            images: ["/foto brosur.webp"]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto relative px-4 pb-10">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '40px',
                justifyContent: 'center',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {categories.map((category, i) => (
                    <motion.div
                        key={category.slug}
                        onClick={() => setSelectedId(category.slug)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        style={{
                            background: 'linear-gradient(145deg, #0A4174 0%, #001D39 100%)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            border: '1px solid rgba(10, 65, 116, 0.2)',
                            boxShadow: '0 4px 20px rgba(0, 29, 57, 0.15)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        whileHover={{ scale: 1.02, y: -8, boxShadow: '0 20px 50px -10px rgba(0, 29, 57, 0.35), 0 0 30px rgba(212, 160, 23, 0.1)' }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(212, 160, 23, 0.4)';
                            const img = e.currentTarget.querySelector('.portfolio-card-img') as HTMLElement;
                            if (img) img.style.transform = 'scale(1.08)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.border = '1px solid rgba(10, 65, 116, 0.2)';
                            const img = e.currentTarget.querySelector('.portfolio-card-img') as HTMLElement;
                            if (img) img.style.transform = 'scale(1)';
                        }}
                    >
                        <div style={{ position: 'relative', width: '100%', height: '250px', overflow: 'hidden' }}>
                            <Image
                                src={category.img}
                                alt={category.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 400px"
                                className="portfolio-card-img"
                                style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                loading="lazy"
                            />
                            {/* Gradient overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '80px',
                                background: 'linear-gradient(to top, rgba(0,15,30,0.7), transparent)',
                                pointerEvents: 'none'
                            }} />
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '10px', color: '#ffffff', margin: 0 }}>{category.title}</h3>
                            <motion.p style={{ color: '#e5e7eb', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '16px', flexGrow: 1 }}>{category.desc}</motion.p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                {category.tags.map(tag => (
                                    <span key={tag} style={{
                                        backgroundColor: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: '#d1d5db',
                                        fontSize: '0.75rem',
                                        padding: '4px 12px',
                                        borderRadius: '8px',
                                        fontWeight: '500'
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D4A017', fontSize: '13px', fontWeight: '600' }}>
                                <span>{tFeatured('viewDetails')}</span>
                                <span>→</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            zIndex: 100,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '24px'
                        }}
                    >
                        {categories.map(category => {
                            if (category.slug !== selectedId) return null;
                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    key={selectedId}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        background: 'linear-gradient(145deg, #1a1d23 0%, #13161b 50%, #0d0f13 100%)',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        width: '100%',
                                        maxWidth: '800px',
                                        maxHeight: '90vh',
                                        overflowY: 'auto',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: '1px solid rgba(212, 160, 23, 0.2)',
                                        boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 30px rgba(212, 160, 23, 0.05)'
                                    }}
                                >
                                    <motion.div style={{ position: 'relative', height: '350px' }}>
                                        <Image
                                            src={category.img}
                                            alt={category.title}
                                            fill
                                            sizes="800px"
                                            style={{ objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                        {/* Gradient overlay on image */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '150px',
                                            background: 'linear-gradient(to top, #13161b, transparent)',
                                            pointerEvents: 'none'
                                        }} />
                                        {/* Close button */}
                                        <button
                                            onClick={() => setSelectedId(null)}
                                            aria-label="Tutup"
                                            style={{
                                                position: 'absolute',
                                                top: '16px',
                                                right: '16px',
                                                background: 'rgba(0,0,0,0.6)',
                                                backdropFilter: 'blur(8px)',
                                                color: '#D4A017',
                                                border: '1px solid rgba(212, 160, 23, 0.3)',
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <Icon icon="mdi:close" style={{ fontSize: '20px' }} />
                                        </button>
                                    </motion.div>

                                    <div style={{ padding: '32px 32px 36px' }}>
                                        {/* Decorator */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                            <span style={{ width: '24px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
                                            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#D4A017', textTransform: 'uppercase' }}>PORTFOLIO</span>
                                            <span style={{ width: '24px', height: '1px', background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
                                        </div>

                                        <motion.h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>{category.title}</motion.h2>
                                        <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #D4A017, #B8860B)', borderRadius: '2px', marginBottom: '20px' }} />

                                        <motion.div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                            {category.tags.map((tag: string) => (
                                                <span key={tag} style={{
                                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    color: '#d1d5db',
                                                    fontSize: '0.875rem',
                                                    padding: '6px 14px',
                                                    borderRadius: '10px',
                                                    fontWeight: '500'
                                                }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </motion.div>

                                        <motion.p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#e5e7eb', marginBottom: '32px' }}>
                                            {category.desc}
                                        </motion.p>

                                        {/* Image Gallery */}
                                        {/* @ts-ignore */}
                                        {category.images && category.images.length > 0 && (
                                            <div style={{ marginBottom: '32px' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#D4A017', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    Product Gallery
                                                </h3>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                                    gap: '12px'
                                                }}>
                                                    {/* @ts-ignore */}
                                                    {category.images.slice(0, 12).map((img, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                            viewport={{ once: true }}
                                                            style={{
                                                                position: 'relative',
                                                                aspectRatio: '1',
                                                                borderRadius: '12px',
                                                                overflow: 'hidden',
                                                                border: '1px solid rgba(255,255,255,0.08)',
                                                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                                            }}
                                                            whileHover={{ scale: 1.05, zIndex: 10, borderColor: 'rgba(212, 160, 23, 0.5)' }}
                                                        >
                                                            <Image
                                                                src={img}
                                                                alt={`${category.title} ${idx + 1}`}
                                                                fill
                                                                sizes="(max-width: 768px) 33vw, 150px"
                                                                style={{ objectFit: 'cover' }}
                                                                loading="lazy"
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                {/* @ts-ignore */}
                                                {category.images.length > 12 && (
                                                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                                        <span style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>+ {category.images.length - 12} more images available locally</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                            <Link href={`/produk/${category.slug}`}
                                                style={{
                                                    padding: '14px 32px',
                                                    background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                                                    color: 'white',
                                                    borderRadius: '14px',
                                                    textDecoration: 'none',
                                                    fontWeight: '600',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: '0.95rem',
                                                    boxShadow: '0 4px 15px rgba(212, 160, 23, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {tFeatured('viewDetails')} →
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FeaturedProducts = () => {
    const t = useTranslations('FeaturedProducts');

    return (
        <section id="classic-products" style={{ backgroundColor: '#ffffff', padding: '100px 0' }} className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
                    <span style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
                    <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', color: '#85630E' }}>EXCLUSIVE</span>
                    <span style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-light leading-tight" style={{ color: '#001D39' }}>
                    {t('title')}
                </h2>
                <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #D4A017, #B8860B)', margin: '20px auto 0', borderRadius: '2px' }} />
                <p className="max-w-2xl mx-auto text-base md:text-xl lg:text-2xl font-light mb-20" style={{ marginTop: '20px', color: '#4b5563' }}>
                    {t('subtitle')}<br /><br />
                </p>
            </div>
            <ClassicProductCardGrid />
        </section>
    );
};

export default FeaturedProducts;
