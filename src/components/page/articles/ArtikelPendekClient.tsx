'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

const FONT_HEADING = "var(--font-poppins), 'Poppins', sans-serif";
const FONT_BODY = "var(--font-source-sans), 'Source Sans 3', sans-serif";

interface ArtikelPendekProps {
    title: string;
    date: string;
    category: string;
    image: string;
    content: React.ReactNode;
    productLink: string;
    productName: string;
}

export default function ArtikelPendekClient({
    title,
    date,
    category,
    image,
    content,
    productLink,
    productName
}: ArtikelPendekProps) {
    const t = useTranslations();

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
            <Navbar />

            <main style={{ maxWidth: '800px', margin: '140px auto 60px', padding: '0 24px' }}>
                <article>
                    {/* Header Section */}
                    <header style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>{category}</span>
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: FONT_HEADING, color: '#001D39', lineHeight: '1.3', marginBottom: '16px' }}>
                            {title}
                        </h1>
                        <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                            {date}
                        </div>
                    </header>

                    {/* Hero Image */}
                    <div style={{ width: '100%', height: '350px', position: 'relative', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                        <Image
                            src={image}
                            alt={title}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>

                    {/* Content Body */}
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155', fontFamily: FONT_BODY }}>
                        {content}

                        {/* The "SEO Juice" Interlinking Box */}
                        <div style={{ marginTop: '48px', padding: '32px', backgroundColor: '#e0f2fe', borderRadius: '16px', borderLeft: '6px solid #0284c7' }}>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0369a1', marginBottom: '12px' }}>Sedang Mencari {productName}?</h4>
                            <p style={{ marginBottom: '20px', color: '#075985' }}>
                                Konsultasikan desain, bahan, dan harga cetak {productName} untuk bisnis Anda bersama Percetakan Dallas Kediri.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link href={productLink} style={{ display: 'inline-block', backgroundColor: '#0284c7', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', textDecoration: 'none', textAlign: 'center', width: 'fit-content' }}>
                                    Lihat Katalog {productName}
                                </Link>

                                <p style={{ fontSize: '0.95rem', color: '#0c4a6e', marginTop: '16px', borderTop: '1px solid #bae6fd', paddingTop: '16px' }}>
                                    Pelajari panduan cetak semua atribut bisnis secara keseluruhan: <Link href="/articles/panduan-lengkap-cetak-kemasan" style={{ fontWeight: '700', textDecoration: 'underline' }}>Panduan Lengkap Cetak Kemasan & Atribut Bisnis</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
