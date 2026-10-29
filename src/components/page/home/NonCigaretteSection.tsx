'use client';

import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const NonCigaretteSection = () => {
    const t = useTranslations();
    const router = useRouter();

    return (
        <section id="non-cigarettes" style={{
            padding: '80px 0',
            backgroundColor: '#001D39'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '300', marginBottom: '24px', color: '#ffffff' }}>{t('NonCigarette.title')}</h2>
                    <p style={{ fontSize: '1.25rem', color: '#9ca3af', maxWidth: '800px', margin: '0 auto' }}>
                        {t('NonCigarette.description')}
                    </p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    marginTop: '64px'
                }}>
                    {[
                        { src: "/mesin potong.webp", alt: "Mesin Potong Canggih" },
                        { src: "/foto%20(9).webp", alt: "Proses Produksi Berkualitas" }
                    ].map((img, idx) => (
                        <div key={idx} style={{
                            position: 'relative',
                            height: '350px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease',
                                    cursor: 'pointer'
                                }}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
                <br /><br />
                {/* Portfolio Title */}
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                        <span style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#D4A017' }}>EXCLUSIVE</span>
                        <span style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
                    </div>
                    <h3 className="text-[1.75rem] md:text-[2.25rem] font-light tracking-[2px] text-white">{t('NonCigarette.productsTitle')}</h3>
                    <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #D4A017, #B8860B)', margin: '16px auto 0', borderRadius: '2px' }} />
                </div>

                {/* Portfolio Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {[
                        { image: '/paperlisens%20produk%20unggulan%20(1).webp', alt: 'Solusi Cup Serbaguna & Trendi', titleKey: 'card1.title', descKey: 'card1.desc' },
                        { image: '/paperlisens%20produk%20unggulan%20(2).webp', alt: 'Kotak Donat Berbagai Ukuran', titleKey: 'card2.title', descKey: 'card2.desc' }
                    ].map((card, idx) => (
                        <div key={idx} style={{
                            borderRadius: '24px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.border = '1px solid rgba(212, 160, 23, 0.4)';
                                e.currentTarget.style.boxShadow = '0 20px 60px -15px rgba(0,0,0,0.5), 0 0 30px rgba(212, 160, 23, 0.08)';
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                const img = e.currentTarget.querySelector('.portfolio-img') as HTMLElement;
                                if (img) img.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                                const img = e.currentTarget.querySelector('.portfolio-img') as HTMLElement;
                                if (img) img.style.transform = 'scale(1)';
                            }}
                        >
                            <div className="relative w-full overflow-hidden h-[280px] md:h-[360px]">
                                <Image
                                    src={card.image}
                                    alt={card.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="portfolio-img"
                                    style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                    loading="lazy"
                                />
                                {/* Dark gradient overlay at bottom */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '100px',
                                    background: 'linear-gradient(to top, rgba(0,29,57,0.8), transparent)',
                                    pointerEvents: 'none'
                                }} />
                                {/* Featured badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '16px',
                                    background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                                    color: '#fff',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 4px 12px rgba(212, 160, 23, 0.3)'
                                }}>
                                    ★ FEATURED
                                </div>
                            </div>
                            <div style={{ padding: '28px 28px 32px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ fontSize: '1.35rem', fontWeight: '600', marginBottom: '14px', color: '#ffffff', lineHeight: '1.3' }}>
                                    {t(`NonCigarette.${card.titleKey}`)}
                                </h4>
                                <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.7', flexGrow: 1 }}>
                                    {t(`NonCigarette.${card.descKey}`)}
                                </p>
                                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#D4A017', fontSize: '14px', fontWeight: '600' }}>
                                    <span>{t('NonCigarette.btnBuy')}</span>
                                    <span style={{ transition: 'transform 0.3s ease' }}>→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Photo Gallery - Premium Masonry */}
                <div style={{ marginTop: '80px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', color: '#D4A017', display: 'block', marginBottom: '12px' }}>GALLERY</span>
                        <h3 style={{ fontSize: '2.25rem', fontWeight: '300', color: '#ffffff', lineHeight: '1.3' }}>{t('NonCigarette.galleryTitle')}</h3>
                        <div style={{ width: '60px', height: '2px', backgroundColor: '#D4A017', margin: '16px auto 0' }} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[140px] md:auto-rows-[180px]">
                        {[
                            '/foto (412).webp', '/foto (264).webp', '/foto (120).webp', '/foto (176).webp',
                            '/foto (310).webp', '/foto (154).webp', '/foto (431).webp', '/foto (436).webp',
                            '/foto (96).webp', '/foto (435).webp', '/foto (69).webp', '/foto (612).webp',
                            '/foto (517).webp', '/foto (510).webp', '/foto (127).webp', '/foto (365).webp',
                            '/foto (185).webp', '/foto (84).webp', '/foto (187).webp', '/foto (151).webp',
                            '/foto (432).webp', '/foto (165).webp', '/foto (159).webp', '/foto (172).webp'
                        ].map((img, index) => (
                            <div key={index} style={{
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                gridRow: index % 5 === 0 ? 'span 2' : 'span 1',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                            }}>
                                <Image
                                    src={img}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                    loading="lazy"
                                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,29,57,0.6) 0%, transparent 50%)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                    pointerEvents: 'none'
                                }}
                                    className="gallery-hover-overlay"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All Products Button */}
                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                    <button
                        onClick={() => router.push('/paperlisens')}
                        style={{
                            background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                            color: '#ffffff',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            letterSpacing: '0.5px',
                            boxShadow: '0 8px 24px rgba(212, 160, 23, 0.3)'
                        }}
                        onMouseOver={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.05)'; (e.target as HTMLElement).style.boxShadow = '0 12px 32px rgba(212, 160, 23, 0.4)' }}
                        onMouseOut={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; (e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(212, 160, 23, 0.3)' }}>
                        {t('NonCigarette.btnViewAll')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NonCigaretteSection;
