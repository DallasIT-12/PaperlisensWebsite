'use client';

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const PricingSection = () => {
    const tPricing = useTranslations('Pricing');

    return (
        <section id="pricing-section" className="py-20 md:py-[120px] px-6 bg-slate-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(10, 65, 116, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
                zIndex: 0
            }}></div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-[2.25rem] md:text-[3rem] font-extrabold text-[#001D39] mb-5 tracking-tight">
                        {tPricing('title')} <span className="text-[#0A4174]">{tPricing('titleSpan')}</span>
                    </h2>
                    <div className="w-20 h-1 bg-[#0A4174] mx-auto mb-6 rounded-sm"></div>
                    <p className="text-gray-600 text-[1.1rem] md:text-[1.25rem] max-w-[700px] mx-auto">
                        {tPricing('subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: tPricing('cards.packaging.title'),
                            price: tPricing('cards.packaging.price'),
                            desc: tPricing('cards.packaging.desc'),
                            icon: 'mdi:package-variant-closed',
                            color: '#0A4174',
                            delay: 0.1
                        },
                        {
                            title: tPricing('cards.culinary.title'),
                            price: tPricing('cards.culinary.price'),
                            desc: tPricing('cards.culinary.desc'),
                            icon: 'mdi:food-takeout-box',
                            color: '#059669',
                            delay: 0.2
                        },
                        {
                            title: tPricing('cards.publications.title'),
                            price: tPricing('cards.publications.price'),
                            desc: tPricing('cards.publications.desc'),
                            icon: 'mdi:book-open-page-variant',
                            color: '#f97316',
                            delay: 0.3
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: item.delay }}
                            whileHover={{
                                y: -12,
                                boxShadow: '0 25px 50px -12px rgba(10, 65, 116, 0.15)',
                                borderColor: item.color
                            }}
                            style={{
                                padding: '48px 32px',
                                borderRadius: '24px',
                                backgroundColor: '#ffffff',
                                border: '2px solid transparent',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'default'
                            }}
                        >
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '20px',
                                    backgroundColor: `${item.color}10`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '28px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <Icon icon={item.icon} style={{ fontSize: '40px', color: item.color }} />
                            </motion.div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>{item.title}</h3>
                            <div style={{
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: item.color,
                                marginBottom: '8px',
                                display: 'inline-block',
                                padding: '4px 16px',
                                backgroundColor: `${item.color}08`,
                                borderRadius: '12px'
                            }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.8, verticalAlign: 'middle', marginRight: '4px' }}>{tPricing('startFrom')}</span>
                                {item.price}{(item.price.includes('Rp') || item.price.includes('印尼盾')) ? <span style={{ fontSize: '1rem', fontWeight: '500', opacity: 0.7 }}> {tPricing('perPcs')}</span> : ''}
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px', flexGrow: 1 }}>
                                {item.desc}
                            </p>
                            <a
                                href={`https://wa.me/6281260001487?text=${encodeURIComponent(tPricing('whatsappMessage', { productName: item.title }))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    backgroundColor: item.color,
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                            >
                                <Icon icon="mdi:whatsapp" style={{ fontSize: '20px' }} />
                                {tPricing('consultation')}
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
