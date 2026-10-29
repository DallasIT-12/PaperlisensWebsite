'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const PromoBanner = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const t = useTranslations('Promo');
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 120, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        left: '24px',
                        maxWidth: '480px',
                        marginLeft: 'auto',
                        zIndex: 9999,
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 160, 23, 0.1)'
                    }}
                >
                    {/* Compact Banner (always visible) */}
                    <div
                        onClick={(e) => {
                            // Ignore clicks on the close button to prevent expanding when trying to close
                            if ((e.target as HTMLElement).closest('button')) {
                                return;
                            }
                            setIsExpanded(!isExpanded);
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #0A4174 0%, #001D39 100%)',
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative glow */}
                        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(212, 160, 23, 0.3)'
                        }}>
                            <Icon icon="mdi:gift-outline" style={{ fontSize: '24px', color: '#fff' }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', margin: 0, lineHeight: 1.3 }}>
                                {t('title')}
                            </h2>
                            <p style={{ color: '#BDD8E9', fontSize: '0.8rem', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t('subtitle')}
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <Icon
                                icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-up'}
                                style={{ fontSize: '20px', color: '#BDD8E9', transition: 'transform 0.3s' }}
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                aria-label="Tutup"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    position: 'relative',
                                    zIndex: 10
                                }}
                            >
                                <Icon icon="mdi:close" style={{ fontSize: '16px', color: '#BDD8E9' }} />
                            </button>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ backgroundColor: '#ffffff', padding: '24px' }}>
                                    <p
                                        style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}
                                        dangerouslySetInnerHTML={{ __html: t.raw('description') }}
                                    />

                                    <ul style={{ color: '#374151', fontSize: '0.85rem', listStyle: 'none', padding: 0, marginBottom: '20px' }}>
                                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                            <Icon icon="mdi:check-circle" style={{ color: '#059669', marginRight: '8px', fontSize: '16px', flexShrink: 0 }} />
                                            {t('point1')}
                                        </li>
                                        <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                            <Icon icon="mdi:check-circle" style={{ color: '#059669', marginRight: '8px', fontSize: '16px', flexShrink: 0 }} />
                                            {t('point2')}
                                        </li>
                                        <li style={{ display: 'flex', alignItems: 'center' }}>
                                            <Icon icon="mdi:check-circle" style={{ color: '#059669', marginRight: '8px', fontSize: '16px', flexShrink: 0 }} />
                                            {t('point3')}
                                        </li>
                                    </ul>

                                    {/* CTA Button */}
                                    <a
                                        href={`https://wa.me/6281260001487?text=${encodeURIComponent(t('whatsappMessage'))}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '10px',
                                            backgroundColor: '#25D366',
                                            color: '#ffffff',
                                            textDecoration: 'none',
                                            padding: '14px',
                                            borderRadius: '14px',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                                        }}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#20bd5a')}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
                                    >
                                        <Icon icon="mdi:whatsapp" style={{ fontSize: '22px' }} />
                                        {t('cta')}
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PromoBanner;
