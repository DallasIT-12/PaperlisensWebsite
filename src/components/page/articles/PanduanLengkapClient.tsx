'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

const FONT_HEADING = "var(--font-poppins), 'Poppins', sans-serif";
const FONT_BODY = "var(--font-source-sans), 'Source Sans 3', sans-serif";

export default function PanduanLengkapClient() {
    const t = useTranslations();

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
            <Navbar />

            <main style={{ maxWidth: '900px', margin: '140px auto 60px', padding: '0 24px' }}>
                <article>
                    {/* Header Section */}
                    <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Panduan Lengkap</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: FONT_HEADING, color: '#001D39', lineHeight: '1.2', marginBottom: '24px' }}>
                            Panduan Lengkap Cetak Kemasan & Atribut Bisnis: Dari Box Makanan hingga Kotak Rokok
                        </h1>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '0.95rem' }}>
                            <span>Ditulis oleh: Tim Akselerasi dan Inovasi</span>
                            <span>•</span>
                            <span>24 Februari 2026</span>
                        </div>
                    </header>

                    {/* Hero Image */}
                    <div style={{ width: '100%', height: '400px', position: 'relative', borderRadius: '24px', overflow: 'hidden', marginBottom: '48px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <Image
                            src="/artikel (1).webp"
                            alt="Panduan Lengkap Cetak Kemasan"
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>

                    {/* Content Body */}
                    <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#334155', fontFamily: FONT_BODY }}>
                        <p style={{ marginBottom: '24px', fontSize: '1.25rem', color: '#0f172a', fontWeight: '500', lineHeight: '1.6' }}>
                            Membangun brand yang kuat tidak hanya soal kualitas produk, tetapi juga bagaimana produk tersebut dikemas dan dipresentasikan. Dari kemasan ritel hingga kebutuhan korporat, memilih spesifikasi cetak yang tepat adalah kunci. Berikut adalah panduan lengkap produk cetak dari Percetakan Dallas Kediri untuk memajukan bisnis Anda.
                        </p>

                        {/* Kategori Packaging */}
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0A4174', marginTop: '48px', marginBottom: '24px' }}>1. Kategori Packaging (Kemasan Produk)</h2>
                        <p style={{ marginBottom: '24px' }}>
                            Kemasan adalah "wajah" dari produk Anda. Packaging yang memberikan kesan premium dapat secara drastis meningkatkan nilai jual produk.
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '32px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0A4174' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#001D39' }}>Box Hampers & Packaging Premium</h3>
                                <p style={{ marginBottom: '12px', fontSize: '1rem' }}>Sering mencari <strong>ide box hampers estetik untuk lebaran/natal</strong>? Atau mencari <Link href="/produk/kotak-hampers" style={{ color: '#0A4174', textDecoration: 'underline' }}><strong>cetak box hampers custom satuan terdekat</strong></Link>? Box hampers adalah solusi terbaik untuk mengemas paket hadiah eksklusif dengan material rigid atau corrugated premium.</p>
                            </li>

                            <li style={{ marginBottom: '32px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0A4174' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#001D39' }}>Box Nasi & Katering</h3>
                                <p style={{ marginBottom: '12px', fontSize: '1rem' }}>Penting untuk mengetahui <strong>ukuran box nasi standar katering (18x18 / 20x20)</strong>. Kami menyediakan layanan <Link href="/produk/kotak-nasi" style={{ color: '#0A4174', textDecoration: 'underline' }}><strong>cetak box nasi laminasi tahan uap panas</strong></Link> yang memastikan makanan Anda tetap hangat dan kemasan tidak bocor.</p>
                            </li>

                            <li style={{ marginBottom: '32px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0A4174' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#001D39' }}>Box Bakery & Pastry</h3>
                                <p style={{ marginBottom: '12px', fontSize: '1rem' }}>Tingkatkan daya tarik kue Anda! Kami melayani pembuatan <strong>dus donat isi 6 desain custom</strong> atau solusi spesifik seperti <Link href="/produk/kotak-bakery" style={{ color: '#0A4174', textDecoration: 'underline' }}><strong>cetak box kue kering bahan ivory premium</strong></Link> yang aman bersentuhan langsung dengan makanan (food grade).</p>
                            </li>

                            <li style={{ marginBottom: '32px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0A4174' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#001D39' }}>Kotak Rokok Custom</h3>
                                <p style={{ marginBottom: '12px', fontSize: '1rem' }}>Bagi UMKM rokok herbal atau kretek, mencari <strong>jasa cetak kotak rokok murah bahan duplex</strong> adalah langkah esensial. Konsultasikan <Link href="/produk/rokok" style={{ color: '#0A4174', textDecoration: 'underline' }}><strong>minimum order cetak box rokok custom logo sendiri</strong></Link> bersama tim kami untuk hasil cetak offset beresolusi tinggi yang tajam.</p>
                            </li>
                        </ul>

                        {/* Kategori Office & Promotion */}
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0A4174', marginTop: '48px', marginBottom: '24px' }}>2. Kategori Office & Promotion (B2B)</h2>
                        <p style={{ marginBottom: '24px' }}>
                            Atribut perkantoran mencerminkan profesionalitas sebuah instansi, sekolah, maupun perusahaan. Kualitas cetakan sangat mempengaruhi persepsi audiens terhadap kredibilitas lembaga.
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '32px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0ea5e9' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#001D39' }}>Map Folder Perusahaan</h3>
                                <p style={{ marginBottom: '12px', fontSize: '1rem' }}>Layanan <Link href="/produk/map" style={{ color: '#0A4174', textDecoration: 'underline' }}><strong>cetak map folder perusahaan bahan art carton</strong></Link> sangat ideal untuk dokumen kontrak. Kami juga sering menangani kebutuhan spesifik seperti <strong>jasa cetak map rekam medis rumah sakit</strong> dengan die-cut khusus.</p>
                            </li>

                            <li style={{ marginBottom: '32px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0ea5e9' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#001D39' }}>Kalender Promosi</h3>
                                <p style={{ marginBottom: '12px', fontSize: '1rem' }}>Temukan <strong>vendor cetak kalender meja 2027 murah</strong> lebih awal! Kalender adalah alat strategi marketing jangka panjang. Anda juga bisa mendapatkan konsultasi <Link href="/produk/kalender" style={{ color: '#0A4174', textDecoration: 'underline' }}><strong>template kalender dinding untuk promosi toko</strong></Link> dari desainer kami.</p>
                            </li>

                            <li style={{ marginBottom: '32px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0ea5e9' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#001D39' }}>Buku & Notebook Custom</h3>
                                <p style={{ marginBottom: '12px', fontSize: '1rem' }}>Mulai dari <Link href="/produk/buku" style={{ color: '#0A4174', textDecoration: 'underline' }}><strong>cetak buku tahunan sekolah kualitas offset</strong></Link> hingga <strong>jasa cetak buku catatan/notebook custom cover</strong> untuk seminar perusahaan, semua dikerjakan dengan finishing jilid spiral atau lem panas (perfect binding) yang rapi dan kuat.</p>
                            </li>
                        </ul>

                        {/* Kategori Shopping & Lifestyle */}
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0A4174', marginTop: '48px', marginBottom: '24px' }}>3. Kategori Shopping & Lifestyle</h2>
                        <p style={{ marginBottom: '24px' }}>
                            Pengganti kantong plastik yang estetis sekaligus media promosi berjalan yang sangat efektif di pusat perbelanjaan atau acara besar.
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '32px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: '#001D39' }}>Paperbag Eksklusif</h3>
                                <p style={{ marginBottom: '12px', fontSize: '1rem' }}>Banyak butik fesyen yang beralih ke <Link href="/produk/paperbag" style={{ color: '#0A4174', textDecoration: 'underline' }}><strong>cetak paperbag butik mewah laminasi doff</strong></Link> lengkap dengan hot-stamping foil emas. Bingung memilih spesifikasi? Bandingkan <strong>harga paperbag sablon vs offset untuk hajatan</strong> bersama spesialis cetak kami agar sesuai dengan budget Anda.</p>
                            </li>
                        </ul>

                        {/* FAQ / Orang Juga Mencari */}
                        <div style={{ marginTop: '48px', padding: '32px', backgroundColor: '#f1f5f9', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', color: '#001D39' }}>Orang Juga Mencari (FAQ)</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <Link href="/articles/cetak-offset-vs-digital" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #0ea5e9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Perbedaan Cetak Offset vs Digital</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Pilih Metode yang Tepat untuk Proyek Anda</p>
                                    </div>
                                </Link>
                                <Link href="/articles/ide-box-hampers-lebaran-natal" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #0A4174', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Ide Box Hampers Estetik Lebaran & Natal</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Cetak Custom Satuan Terdekat</p>
                                    </div>
                                </Link>
                                <Link href="/articles/cetak-kotak-rokok-duplex" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Jasa Cetak Kotak Rokok Murah Duplex</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Syarat Minimum Order untuk UMKM</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div style={{ marginTop: '60px', padding: '40px', backgroundColor: '#001D39', borderRadius: '24px', color: '#ffffff', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '16px' }}>Siap Mengoptimalkan Atribut Bisnis Anda?</h3>
                            <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                                Dari kemasan skala ritel hingga perlengkapan kantor korporat, Percetakan Offset Dallas Kediri selalu memprioritaskan kualitas presisi dan layanan tepat waktu.
                            </p>
                            <Link href="/products" style={{ display: 'inline-block', backgroundColor: '#ffffff', color: '#001D39', padding: '16px 32px', borderRadius: '9999px', fontWeight: '700', textDecoration: 'none', transition: 'transform 0.3s' }}>
                                Lihat Semua Katalog Kami
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
