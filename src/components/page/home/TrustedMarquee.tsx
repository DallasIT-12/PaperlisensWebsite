'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const TrustedMarquee = () => {
    const t = useTranslations();

    return (
        <section style={{
            padding: '60px 0',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
            overflow: 'hidden'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center', marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('TrustedBy.title')}
                </h3>
            </div>

            <div style={{ display: 'flex', overflow: 'hidden', width: '100%', position: 'relative' }}>
                {/* Marquee Group 1 */}
                <div className="animate-marquee" style={{ display: 'flex', gap: '80px', paddingRight: '80px', minWidth: '100%', flexShrink: 0, alignItems: 'center' }}>
                    {Array.from({ length: 25 }, (_, i) => `/logo brand (${i + 1}).webp`).map((src, idx) => (
                        <div key={`logo-1-${idx}`} style={{ position: 'relative', width: '220px', height: '140px', flexShrink: 0 }}>
                            <Image
                                src={src}
                                alt={`Brand Partner ${idx + 1}`}
                                fill
                                sizes="220px"
                                style={{ objectFit: 'contain' }}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {/* Marquee Group 2 (Duplicate) */}
                <div className="animate-marquee" style={{ display: 'flex', gap: '80px', paddingRight: '80px', minWidth: '100%', flexShrink: 0, alignItems: 'center' }}>
                    {Array.from({ length: 25 }, (_, i) => `/logo brand (${i + 1}).webp`).map((src, idx) => (
                        <div key={`logo-2-${idx}`} style={{ position: 'relative', width: '220px', height: '140px', flexShrink: 0 }}>
                            <Image
                                src={src}
                                alt={`Brand Partner ${idx + 1}`}
                                fill
                                sizes="220px"
                                style={{ objectFit: 'contain' }}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedMarquee;
