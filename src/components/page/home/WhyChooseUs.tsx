'use client';

import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

export const WhyChooseUs = () => {
    const t = useTranslations();

    return (
        <section className="py-16 md:py-[100px] px-6 text-center bg-[#0A4174] text-white border-t border-white/10">
            <div className="max-w-[1200px] mx-auto">
                <div className="mb-16">
                    <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold mb-4 text-white">
                        {t('WhyChoose.title')}
                    </h2>
                    <p className="text-[1rem] md:text-[1.125rem] text-gray-200 font-normal">
                        {t('WhyChoose.subtitle')}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {/* POIN 1: PENGALAMAN */}
                    <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[320px]" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(73, 118, 159, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '8px'
                        }}>
                            <Icon icon="mdi:shield-check" width="40" height="40" color="#f97316" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('WhyChoose.points.experience.title')}</h3>
                        <p style={{ color: '#e5e7eb', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {t('WhyChoose.points.experience.desc')}
                        </p>
                    </div>

                    {/* POIN 2: KUALITAS */}
                    <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[320px]" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(73, 118, 159, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '8px'
                        }}>
                            <Icon icon="mdi:crosshairs-gps" width="40" height="40" color="#f97316" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('WhyChoose.points.quality.title')}</h3>
                        <p style={{ color: '#e5e7eb', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {t('WhyChoose.points.quality.desc')}
                        </p>
                    </div>

                    {/* POIN 3: KONSULTASI */}
                    <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[320px]" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(73, 118, 159, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '8px'
                        }}>
                            <Icon icon="mdi:lightbulb-on-outline" width="40" height="40" color="#f97316" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('WhyChoose.points.consultation.title')}</h3>
                        <p style={{ color: '#e5e7eb', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {t('WhyChoose.points.consultation.desc')}
                        </p>
                    </div>

                    {/* POIN 4: WAKTU */}
                    <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[320px]" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(73, 118, 159, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '8px'
                        }}>
                            <Icon icon="mdi:clock-check-outline" width="40" height="40" color="#f97316" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('WhyChoose.points.punctuality.title')}</h3>
                        <p style={{ color: '#e5e7eb', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {t('WhyChoose.points.punctuality.desc')}
                        </p>
                    </div>

                    {/* POIN 5: DISKUSI */}
                    <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[320px]" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(73, 118, 159, 0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '8px'
                        }}>
                            <Icon icon="mdi:account-group-outline" width="40" height="40" color="#f97316" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t('WhyChoose.points.discussion.title')}</h3>
                        <p style={{ color: '#e5e7eb', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {t('WhyChoose.points.discussion.desc')}
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '40px',
                    marginTop: '20px'
                }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '24px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
                        {t('WhyChoose.cta')}
                    </h3>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
