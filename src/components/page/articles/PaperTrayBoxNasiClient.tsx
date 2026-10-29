'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

const FONT_HEADING = "var(--font-poppins), 'Poppins', sans-serif";
const FONT_BODY = "var(--font-source-sans), 'Source Sans 3', sans-serif";

export default function PaperTrayBoxNasiClient() {
    const t = useTranslations();

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
            <Navbar />

            <main style={{ maxWidth: '900px', margin: '140px auto 60px', padding: '0 24px' }}>
                <article>
                    {/* Header Section */}
                    <header style={{ marginBottom: '48px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Panduan Bisnis Kuliner</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: FONT_HEADING, color: '#001D39', lineHeight: '1.2', marginBottom: '24px' }}>
                            Panduan Memilih Paper Tray dan Box Nasi: Solusi Kemasan Praktis, Anti Bocor, dan Food Grade
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
                            src="/paperlisens%20papertray.webp"
                            alt="Panduan Memilih Paper Tray dan Box Nasi"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    {/* Content Body */}
                    <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#334155', fontFamily: FONT_BODY }}>

                        {/* Featured Snippet Paragraph */}
                        <div style={{ padding: '24px', backgroundColor: '#e0f2fe', borderRadius: '16px', borderLeft: '6px solid #0284c7', marginBottom: '48px' }}>
                            <p style={{ margin: 0, fontWeight: '500', color: '#0369a1' }}>
                                <strong>Apa perbedaan utama antara Paper Tray dan Box Nasi?</strong> Secara fungsional, Paper Tray digunakan untuk makanan cepat saji yang siap disantap di tempat (dine-in) atau snack ringan, sedangkan Box Nasi dirancang untuk perlindungan maksimal saat pengiriman (delivery) agar suhu tetap terjaga dan nasi tidak tumpah. Di Percetakan Dallas, kami memproduksi keduanya dengan teknologi laminasi terbaru yang menjamin keamanan pangan Anda.
                            </p>
                        </div>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#001D39', marginTop: '48px', marginBottom: '20px' }}>
                            1. Keunggulan Paper Tray untuk Bisnis Kuliner Kekinian
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Banyak pengusaha street food atau tenant mall kini beralih ke <Link href="/produk/paper-tray" style={{ color: '#0A4174', textDecoration: 'underline' }}>Paper Tray custom</Link>. Selain lebih murah, produk ini sangat efektif untuk branding.
                        </p>
                        <ul style={{ marginBottom: '32px', paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li style={{ marginBottom: '12px' }}>
                                <strong>Efisiensi Ruang:</strong> Desain yang bisa ditumpuk (stackable) sangat menghemat ruang penyimpanan di outlet Anda.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <strong>Fitur Greaseproof (Tahan Minyak):</strong> Kami menggunakan bahan khusus yang mencegah minyak tembus ke tangan pelanggan, sehingga kemasan tetap bersih dan rapi saat disajikan.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <strong>Ramah Lingkungan:</strong> Sebagai alternatif plastik, paper tray berbahan Kraft Cokelat memberikan citra bisnis yang peduli lingkungan.
                            </li>
                        </ul>

                        <div style={{ width: '100%', height: '300px', position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <Image
                                src="/box%20nasi%2018x18%20(1).webp"
                                alt="Box Nasi Premium Tahan Bocor"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#001D39', marginTop: '48px', marginBottom: '20px' }}>
                            2. Box Nasi: Rahasia Katering Terlihat Lebih Profesional
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Jika Anda menjalankan bisnis katering atau nasi kotak, kualitas <Link href="/produk/kotak-nasi" style={{ color: '#0A4174', textDecoration: 'underline' }}>Box Nasi</Link> adalah segalanya. Jangan sampai pelanggan kecewa karena box yang lembek akibat uap panas.
                        </p>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0A4174', marginBottom: '16px', marginTop: '24px' }}>
                            Kriteria Box Nasi Berkualitas:
                        </h3>
                        <ul style={{ marginBottom: '32px', paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li style={{ marginBottom: '12px' }}>
                                <strong>Laminasi Dalam (PE Coating):</strong> Pastikan Anda mencari "<em>cetak box nasi laminasi</em>". Lapisan ini berfungsi agar nasi tidak lengket dan saus (seperti sambal atau bumbu rendang) tidak merembes keluar.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <strong>Lubang Udara (Ventilasi):</strong> Box nasi yang baik memiliki lubang udara yang presisi untuk mencegah makanan cepat basi akibat uap air yang terjebak.
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <strong>Ketebalan Bahan:</strong> Kami merekomendasikan bahan Ivory 250gsm - 310gsm untuk memastikan box tetap kokoh saat ditumpuk dalam pengiriman.
                            </li>
                        </ul>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#001D39', marginTop: '48px', marginBottom: '24px' }}>
                            3. Spesifikasi Ukuran yang Paling Banyak Dicari (Standar Industri)
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Gunakan tabel ini sebagai acuan saat Anda ingin memesan di Percetakan Dallas:
                        </p>

                        <div style={{ overflowX: 'auto', marginBottom: '48px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                <thead style={{ backgroundColor: '#001D39', color: '#ffffff' }}>
                                    <tr>
                                        <th style={{ padding: '16px', fontWeight: '600' }}>Jenis Produk</th>
                                        <th style={{ padding: '16px', fontWeight: '600' }}>Ukuran (P × L × T)</th>
                                        <th style={{ padding: '16px', fontWeight: '600' }}>Cocok Untuk</th>
                                    </tr>
                                </thead>
                                <tbody style={{ backgroundColor: '#ffffff' }}>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px' }}><strong>Paper Tray S</strong></td>
                                        <td style={{ padding: '16px' }}>10 × 10 × 5 cm</td>
                                        <td style={{ padding: '16px' }}>Takoyaki, Dimsum, Kentang Goreng</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                        <td style={{ padding: '16px' }}><strong>Paper Tray M</strong></td>
                                        <td style={{ padding: '16px' }}>16 × 9 × 5 cm</td>
                                        <td style={{ padding: '16px' }}>Hotdog, Kebab, Siomay</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '16px' }}><strong>Paper Tray L</strong></td>
                                        <td style={{ padding: '16px' }}>18 × 11 × 5 cm</td>
                                        <td style={{ padding: '16px' }}>Rice Box, Mie Goreng, Pasta</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                        <td style={{ padding: '16px' }}><strong>Box Nasi 18</strong></td>
                                        <td style={{ padding: '16px' }}>18 × 18 × 7 cm</td>
                                        <td style={{ padding: '16px' }}>Nasi Kotak Standar Ayam Bakar</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '16px' }}><strong>Box Nasi 20</strong></td>
                                        <td style={{ padding: '16px' }}>20 × 20 × 7 cm</td>
                                        <td style={{ padding: '16px' }}>Nasi Kotak Lengkap dengan Buah/Krupuk</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={{ width: '100%', height: '300px', position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <Image
                                src="/kotak%20nasi%20(1).webp"
                                alt="Pesan Kemasan Custom di Percetakan Dallas"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#001D39', marginTop: '48px', marginBottom: '20px' }}>
                            Mengapa Harus Cetak di Percetakan Dallas?
                        </h2>
                        <p style={{ marginBottom: '24px' }}>
                            Kami memahami bahwa kecepatan dan kebersihan adalah prioritas bisnis kuliner. Oleh karena itu, kami menawarkan:
                        </p>
                        <ul style={{ marginBottom: '32px', paddingLeft: '24px', listStyleType: 'disc' }}>
                            <li style={{ marginBottom: '12px' }}><strong>Tinta Food Safe:</strong> Aman jika bersentuhan dengan makanan panas.</li>
                            <li style={{ marginBottom: '12px' }}><strong>Tanpa Minimal Order Gila-gilaan:</strong> Kami mendukung UMKM yang baru mulai untuk mendapatkan kemasan custom.</li>
                            <li style={{ marginBottom: '12px' }}><strong>Pengiriman Cepat ke Seluruh Indonesia:</strong> Dengan basis di Kediri, kami memiliki akses logistik yang mudah untuk pengiriman ke berbagai kota.</li>
                        </ul>

                        {/* FAQ / Orang Juga Mencari */}
                        <div style={{ marginTop: '48px', padding: '32px', backgroundColor: '#f1f5f9', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px', color: '#001D39' }}>Orang Juga Mencari (FAQ)</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <Link href="/articles/ukuran-box-nasi-katering" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #0ea5e9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Ukuran Box Nasi Standar Katering</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Pentingnya Laminasi Tahan Panas</p>
                                    </div>
                                </Link>
                                <Link href="/articles/ide-bisnis-kuliner-modal-kecil" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Ide Bisnis Kuliner Modal Kecil</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Maksimalkan Keuntungan dengan Kemasan Tepat</p>
                                    </div>
                                </Link>
                                <Link href="/articles/tren-kemasan-ramah-lingkungan" style={{ display: 'block', textDecoration: 'none' }}>
                                    <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px', borderLeft: '4px solid #10b981', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0A4174', margin: 0 }}>Tren Kemasan Ramah Lingkungan</h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#64748b' }}>Inovasi Eco-Friendly untuk Bisnis Anda</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div style={{ marginTop: '60px', padding: '40px', backgroundColor: '#001D39', borderRadius: '24px', color: '#ffffff', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '16px' }}>Cara Pemesanan:</h3>
                            <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                                Hubungi admin kami via WhatsApp untuk konsultasi spesifikasi dan mendapatkan <strong>harga khusus cetak paper tray makanan custom</strong> bulan ini!
                            </p>
                            <a href="https://wa.me/6281357888855" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#ffffff', color: '#001D39', padding: '16px 32px', borderRadius: '9999px', fontWeight: '700', textDecoration: 'none', transition: 'transform 0.3s' }}>
                                Hubungi Kami Sekarang
                            </a>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
