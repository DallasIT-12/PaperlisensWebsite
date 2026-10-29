'use client';

import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion, Variants } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

export default function KarirClient() {
    const t = useTranslations('Career');
    const [mounted, setMounted] = useState(false);

    //Form Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        age: '',
        education: ''
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-blue-900/10 border-t-blue-900 rounded-full animate-spin" />
            </div>
        );
    }

    const jobs = [
        { id: 'hostLive', icon: 'mdi:cast-variant' },
        { id: 'bongkarMuat', icon: 'mdi:truck-fast' }
    ];

    const handleApplyWhatsApp = (jobTitle: string) => {
        const phoneNumber = '6281260001487';
        const message = encodeURIComponent(t('whatsappMessage') + jobTitle);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const handleOpenModal = (jobTitle: string) => {
        setSelectedJob(jobTitle);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', phone: '', address: '', age: '', education: '' });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailBody = `Nama Lengkap: ${formData.name}\nUsia: ${formData.age} Tahun\nNomor WhatsApp: ${formData.phone}\nAlamat Lengkap: ${formData.address}\nPendidikan Terakhir: ${formData.education}\n\n*Mohon lampirkan file CV Anda pada email ini*.`.trim();

        const targetEmail = 'lokerdallaskediri@gmail.com';
        const subject = encodeURIComponent(`Lamaran Kerja: ${selectedJob} - ${formData.name}`);
        const body = encodeURIComponent(emailBody);

        window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

        handleCloseModal();
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
    };

    return (
        <div className="bg-white text-gray-800 font-sans min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#001D39] text-white text-center flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#001D39] via-[#0A4174] to-[#001D39] opacity-90" />
                    <div className="absolute inset-0 bg-[url('/about_us.webp')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                </div>

                <div className="relative z-10 px-6 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6"
                    >
                        {t('title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>
            </header>

            {/* Why Join Us */}
            <section className="py-20 px-6 max-w-7xl mx-auto relative z-20 -mt-10">
                <div className="mb-12 text-center">
                    <motion.h2
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold text-[#001D39] mb-4"
                    >
                        {t('whyJoin')}
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }} whileInView={{ width: '80px' }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                        className="h-1 bg-[#D4A017] mx-auto"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {['growth', 'culture', 'stability'].map((benefit, index) => (
                        <motion.div
                            key={benefit}
                            initial="hidden" whileInView="visible" viewport={{ once: true }}
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } } }}
                            className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-[#0A4174]">
                                <Icon icon={index === 0 ? "mdi:trending-up" : index === 1 ? "mdi:heart" : "mdi:shield-check"} className="text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`benefits.${benefit}.title`)}</h3>
                            <p className="text-gray-600 leading-relaxed">{t(`benefits.${benefit}.desc`)}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-20 bg-gray-50 border-t border-gray-100">
                <div className="px-6 max-w-7xl mx-auto">
                    <div className="mb-16 md:flex justify-between items-end">
                        <div>
                            <motion.h2
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                                className="text-3xl md:text-4xl font-bold text-[#001D39] mb-4"
                            >
                                {t('openPositions')}
                            </motion.h2>
                            <motion.div
                                initial={{ width: 0 }} whileInView={{ width: '80px' }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                                className="h-1 bg-[#D4A017]"
                            />
                        </div>
                        <motion.p
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                            className="mt-6 md:mt-0 max-w-md text-gray-600"
                        >
                            {t('noPositions')}
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial="hidden" whileInView="visible" viewport={{ once: true }}
                                variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: index * 0.1 } } }}
                                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#0A4174] transition-colors duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-blue-50 z-0" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center group-hover:bg-[#0A4174] group-hover:text-white transition-colors">
                                            <Icon icon={job.icon} className="text-2xl" />
                                        </div>
                                        <span className="bg-green-50 text-green-700 font-medium px-3 py-1 rounded-full text-xs border border-green-200">
                                            {t(`jobs.${job.id}.type`)}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`jobs.${job.id}.title`)}</h3>
                                    <p className="text-gray-600 mb-8 flex-grow text-sm leading-relaxed">{t(`jobs.${job.id}.desc`)}</p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApplyWhatsApp(t(`jobs.${job.id}.title`))}
                                            className="flex-1 bg-[#001D39] text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#0A4174] transition-colors"
                                        >
                                            <Icon icon="mdi:whatsapp" className="text-lg" />
                                            {t('sendWa')}
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(t(`jobs.${job.id}.title`))}
                                            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <Icon icon="mdi:email" className="text-lg" />
                                            {t('sendEmail')}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Application CTA */}
            <section className="py-24 bg-[#0A4174] text-white text-center px-6">
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                    className="max-w-3xl mx-auto"
                >
                    <Icon icon="mdi:briefcase-check" className="text-6xl text-[#D4A017] mx-auto mb-6" />
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('applyNow')}</h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                        {t('noPositions')}
                    </p>
                    <button
                        onClick={() => handleOpenModal('Umum')}
                        className="shrink-0 inline-flex items-center gap-2 bg-[#D4A017] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#b58813] transition-colors shadow-lg shadow-[#D4A017]/20"
                    >
                        <Icon icon="mdi:email-fast" className="text-2xl" />
                        {t('sendEmail')}
                    </button>
                </motion.div>
            </section>

            {/* Application Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
                    >
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
                        >
                            <Icon icon="mdi:close" className="text-xl" />
                        </button>

                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-[#001D39] mb-1">{t('formModal.title')}</h3>
                            <p className="text-gray-600 mb-6 text-sm">Posisi: <span className="font-semibold text-[#0A4174] bg-blue-50 px-2 py-1 rounded-md ml-1">{selectedJob}</span></p>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">{t('formModal.name')} *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={t('formModal.namePlaceholder')}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001D39]/20 focus:border-[#001D39] outline-none transition-all bg-gray-50 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">{t('formModal.age')} *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            placeholder={t('formModal.agePlaceholder')}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001D39]/20 focus:border-[#001D39] outline-none transition-all bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">{t('formModal.phone')} *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder={t('formModal.phonePlaceholder')}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001D39]/20 focus:border-[#001D39] outline-none transition-all bg-gray-50 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">{t('formModal.education')} *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                            placeholder={t('formModal.educationPlaceholder')}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001D39]/20 focus:border-[#001D39] outline-none transition-all bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('formModal.address')} *</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder={t('formModal.addressPlaceholder')}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#001D39]/20 focus:border-[#001D39] outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                    />
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
                                    <Icon icon="mdi:alert-circle" className="text-yellow-600 text-xl shrink-0 mt-0.5" />
                                    <p className="text-sm text-yellow-800 leading-relaxed font-medium">
                                        {t('formModal.waNotice')}
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:text-gray-900 transition-all"
                                    >
                                        {t('formModal.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 bg-[#001D39] text-white rounded-xl font-bold hover:bg-[#0A4174] hover:shadow-lg hover:shadow-[#001D39]/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Icon icon="mdi:send" className="text-lg" />
                                        {t('formModal.submit')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
}
