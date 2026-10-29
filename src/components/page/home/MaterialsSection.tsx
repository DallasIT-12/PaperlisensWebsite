'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const MaterialsSection = () => {
    const t = useTranslations();

    return (
        <section style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ marginTop: '0' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '300', textAlign: 'center', marginBottom: '48px', color: '#111827' }}>{t('Materials.title')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:gap-6">
                        {[
                            { name: t('Materials.artPaper.name'), slug: 'art-paper', description: t('Materials.artPaper.desc'), image: '/BAHAN-AP.webp' },
                            { name: t('Materials.ivoryPaper.name'), slug: 'ivory-paper', description: t('Materials.ivoryPaper.desc'), image: '/BAHAN-IVORY.webp' },
                            { name: t('Materials.tipping.name'), slug: 'bahan-tipping', description: t('Materials.tipping.desc'), image: '/BAHAN-TIPPING.webp' },
                            { name: t('Materials.duplex.name'), slug: 'duplex', description: t('Materials.duplex.desc'), image: '/BAHAN-DC.webp' },
                            { name: t('Materials.kraftPaper.name'), slug: 'kraft-paper', description: t('Materials.kraftPaper.desc'), image: '/A4_Brown_Krafting_Paper.jpg' }
                        ].map((product, index) => (
                            <Link key={product.slug} href={`/produk/${product.slug}`} style={{ textDecoration: 'none', height: '100%' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    style={{
                                        backgroundColor: '#BDD8E9',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 2, 1)',
                                        transform: 'translateY(0)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(0.98)'}
                                    onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-8px) scale(1)'}
                                >
                                    <div style={{ position: 'relative', width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 300px"
                                            style={{ objectFit: 'cover' }}
                                            loading="lazy"
                                        />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '4px', color: '#111827' }}>{product.name}</h3>
                                    <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: '1.5', flexGrow: 1 }}>{product.description}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MaterialsSection;
