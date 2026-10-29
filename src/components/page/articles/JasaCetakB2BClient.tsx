'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

const FONT_HEADING = "var(--font-poppins), 'Poppins', sans-serif";
const FONT_BODY = "var(--font-source-sans), 'Source Sans 3', sans-serif";

export default function JasaCetakB2BClient() {
    const t = useTranslations();

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
            <Navbar />

            <main style={{ maxWidth: '900px', margin: '140px auto 60px', padding: '0 24px' }}>
                <article>
                    {/* Header Section */}
                    <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Solusi B2B & Instansi</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: FONT_HEADING, color: '#001D39', lineHeight: '1.2', marginBottom: '24px' }}>
                            Jasa Cetak Kotak Rokok, Map Perusahaan, dan Buku: Solusi Cetak Offset Presisi untuk Industri dan Instansi
                        </h1>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '0.95rem' }}>
                            <span>Ditulis oleh: Tim Akselerasi dan Inovasi</span>
                            <span>•</span>
                            <span>25 Februari 2026</span>
                        </div>
                    </header>

                    {/* Hero Image */}
                    <div style={{ width: '100%', height: '400px', position: 'relative', borderRadius: '24px', overflow: 'hidden', marginBottom: '48px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <Image
                            src="/foto mesin.webp"
                            alt="Mesin Cetak Offset Presisi Tinggi Percetakan Dallas"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    {/* Content Body */}
                    <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#334155', fontFamily: FONT_BODY }}>

                        <p style={{ marginBottom: '24px', fontSize: '1.25rem', color: '#0f172a', fontWeight: '500', lineHeight: '1.6' }}>
                            Dunia industri dan profesional menuntut kualitas cetakan yang tidak hanya tajam, tetapi juga konsisten dalam jumlah besar. Apakah Anda mencari vendor cetak kotak rokok custom dengan standar presisi tinggi, atau cetak map folder untuk kebutuhan administrasi kantor? Percetakan Dallas hadir dengan teknologi cetak offset modern untuk memenuhi standar kebutuhan bisnis Anda.
                        </p>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#001D39', marginTop: '48px', marginBottom: '20px' }}>
                            1. Cetak Kotak Rokok Custom: Presisi dan Kualitas adalah Kunci
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Industri rokok memerlukan kemasan yang sangat detail. Karena ukuran kotak yang kecil, sedikit saja pergeseran warna atau potongan akan terlihat jelas. Oleh karena itu, memilih <strong>vendor kemasan rokok custom</strong> yang tepat sangatlah krusial.
                        </p>

                        <div style={{ width: '100%', height: '300px', position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <Image
                                src="/custom rokok 1.webp"
                                alt="Detail Presisi Cetak Kotak Rokok Custom"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>

                        <ul style={{ marginBottom: '32px', paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0A4174', margin: '0 0 8px 0', display: 'inline' }}>Bahan Berkualitas: </h3>
                                Kami menggunakan bahan Duplex atau Ivory dengan gramasi yang tepat agar kotak tetap kokoh dan melindungi produk di dalamnya. Ini adalah standar kami untuk layanan <strong>cetak box rokok bahan duplex</strong> maupun premium.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0A4174', margin: '0 0 8px 0', display: 'inline' }}>Akurasi Warna: </h3>
                                Dengan mesin offset skala besar, kami menjamin konsistensi warna logo dan desain Anda dari cetakan pertama hingga ribuan lembar berikutnya.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0A4174', margin: '0 0 8px 0', display: 'inline' }}>Finishing Eksklusif: </h3>
                                Tersedia opsi laminasi glossy, doff, hingga emboss (teks timbul) dan poli emas/perak untuk memberikan kesan mewah pada brand rokok Anda. Percetakan kami juga dikenal sebagai pusat <strong>cetak kotak rokok murah</strong> dengan hasil premium.
                            </li>
                        </ul>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#001D39', marginTop: '48px', marginBottom: '20px' }}>
                            2. Cetak Map Folder & Map Rekam Medis (B2B & Instansi)
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Map adalah representasi profesionalisme sebuah lembaga. Baik untuk kebutuhan Map Folder Perusahaan maupun Map Rekam Medis Rumah Sakit, kami menyediakan solusi <Link href="/produk/map" style={{ color: '#0A4174', textDecoration: 'underline' }}>cetak map custom</Link> yang fungsional dan representatif.
                        </p>

                        <div style={{ width: '100%', height: '300px', position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <Image
                                src="/map (4).webp"
                                alt="Map Folder Perusahaan dan Instansi"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>

                        <ul style={{ marginBottom: '32px', paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0ea5e9', margin: '0 0 8px 0', display: 'inline' }}>Custom Kantong Dalam: </h3>
                                Anda bisa memesan map dengan satu atau dua kantong di bagian dalam untuk menyimpan dokumen agar tidak tercecer, lengkap dengan tempat untuk menyelipkan kartu nama pengurus.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0ea5e9', margin: '0 0 8px 0', display: 'inline' }}>Laminasi Anti Air: </h3>
                                Melindungi dokumen penting dari percikan air dan debu, menjaga Map tetap terlihat baru dan awet dalam waktu yang lama.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0ea5e9', margin: '0 0 8px 0', display: 'inline' }}>Cetak Massal Harga Grosir: </h3>
                                Didukung oleh efisiensi mesin offset, semakin banyak jumlah pesanan Anda (volume tinggi), harga produksi per pcs akan jauh lebih murah.
                            </li>
                        </ul>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#001D39', marginTop: '48px', marginBottom: '24px' }}>
                            3. Jasa Cetak Buku, Majalah, dan Buku Tahunan Sekolah
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Dari Buku Tabungan, Buku Agenda Custom, hingga Buku Tahunan Sekolah, kami memahami bahwa setiap <Link href="/produk/buku" style={{ color: '#0A4174', textDecoration: 'underline' }}>buku cetak</Link> memiliki cerita dan arsip yang harus dijaga kualitas cetakannya hingga bertahun-tahun.
                        </p>

                        <div style={{ width: '100%', height: '300px', position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <Image
                                src="/buku (5).webp"
                                alt="Cetak Buku Jilid Spiral dan Binding Kuat"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>

                        <ul style={{ marginBottom: '48px', paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b', margin: '0 0 8px 0', display: 'inline' }}>Pilihan Binding (Jilid): </h3>
                                Tersedia fleksibilitas finishing berupa jilid kawat (staples), jilid lem panas (perfect binding) untuk kesan profesional, hingga jilid spiral khusus untuk agenda dan buku catatan.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b', margin: '0 0 8px 0', display: 'inline' }}>Kualitas Kertas Bervariasi: </h3>
                                Tersedia pilihan kertas HVS standar, Art Paper (licin/glossy) untuk foto majalah/buku tahunan, hingga kertas Book Paper (kekuningan) yang nyaman untuk dibaca dalam waktu lama.
                            </li>
                        </ul>

                        <div style={{ backgroundColor: '#fdf8f6', padding: '32px', borderRadius: '16px', borderLeft: '6px solid #e11d48', marginBottom: '48px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#e11d48', margin: '0 0 20px 0' }}>
                                Mengapa Memilih Layanan Offset di Percetakan Dallas?
                            </h2>
                            <p style={{ marginBottom: '20px', color: '#334155' }}>
                                Untuk kategori produk industri skala besar ini, kami memprioritaskan keunggulan kompetitif yang tidak selalu dimiliki sembarang percetakan:
                            </p>
                            <ul style={{ marginBottom: '0', paddingLeft: '20px', listStyleType: 'decimal', color: '#334155' }}>
                                <li style={{ marginBottom: '12px' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'inline', color: '#be123c' }}>Skala Produksi Besar: </h4>
                                    Kami siap melayani pesanan hingga puluhan ribu pcs dengan penjadwalan deadline yang terjaga. Tim produksi kami bekerja dengan kapasitas mesin tinggi.
                                </li>
                                <li style={{ marginBottom: '12px' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'inline', color: '#be123c' }}>QC (Quality Control) Ketat: </h4>
                                    Setiap batch lembar hasil cetakan melewati proses pengecekan berlapis untuk memastikan tidak ada warna yang meleset atau potongan pisau pond (die-cut) yang miring.
                                </li>
                                <li style={{ marginBottom: '12px' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'inline', color: '#be123c' }}>Pengiriman Aman: </h4>
                                    Kami memastikan packing pengiriman sangat kuat dan aman, terutama untuk produk buku dan map agar sudut-sudut kertas tidak tertekuk dan rusak saat sampai di tangan Anda.
                                </li>
                            </ul>
                        </div>

                        {/* FAQ / Orang Juga Mencari */}
                        <div style={{ marginTop: '48px', padding: '32px', backgroundColor: '#f1f5f9', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', color: '#001D39' }}>Orang Juga Mencari (FAQ)</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <Link href="/articles/cetak-kotak-rokok-duplex" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Jasa Cetak Kotak Rokok Murah Duplex</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Syarat Minimum Order untuk UMKM</p>
                                    </div>
                                </Link>
                                <Link href="/articles/cetak-offset-vs-digital" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #0ea5e9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Perbedaan Cetak Offset vs Digital</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Pilih Metode yang Tepat untuk Proyek Anda</p>
                                    </div>
                                </Link>
                                <Link href="/articles/mengenal-kertas-ivory-vs-art-carton" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #0A4174', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Mengenal Kertas Ivory vs Art Carton</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Pilihan Material Populer untuk Cetak Kemasan</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div style={{ marginTop: '60px', padding: '40px', backgroundColor: '#001D39', borderRadius: '24px', color: '#ffffff', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '16px' }}>Hubungi Kami untuk Penawaran Harga Spesial (B2B)</h3>
                            <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                                Jika Anda mewakili perusahaan, pabrik rokok, sekolah, atau instansi yang membutuhkan pengadaan cetak rutin, Percetakan Dallas siap menjadi mitra terpercaya Anda.
                            </p>
                            <a href="https://wa.me/6281357888855" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#ffffff', color: '#001D39', padding: '16px 32px', borderRadius: '9999px', fontWeight: '700', textDecoration: 'none', transition: 'transform 0.3s' }}>
                                Konsultasi & Penawaran Harga
                            </a>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
