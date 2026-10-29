'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const FONT_HEADING = "var(--font-poppins), 'Poppins', sans-serif";
const FONT_BODY = "var(--font-source-sans), 'Source Sans 3', sans-serif";

export default function EcoFriendlyPackagingArticle() {
  const t = useTranslations();
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isMediumMobile, setIsMediumMobile] = useState(false);
  const [isLargeMobile, setIsLargeMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallMobile(window.innerWidth < 480);
      setIsMediumMobile(window.innerWidth < 640);
      setIsLargeMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);




  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b', overflowX: 'hidden' }}>
      <Navbar />

      <main style={{ maxWidth: '900px', margin: '88px auto 0', padding: isLargeMobile ? '32px 16px' : '60px 24px' }}>
        <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <header style={{ marginBottom: isLargeMobile ? '32px' : '48px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '4px 16px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>KEBERLANJUTAN</span>
              <span style={{ color: '#64748b', fontSize: '0.8rem', alignSelf: 'center' }}>6 Februari 2026 • 10 Menit Baca</span>
            </div>
            <h1 style={{ fontSize: isSmallMobile ? '1.75rem' : (isLargeMobile ? '2.25rem' : '3.5rem'), fontWeight: '800', fontFamily: FONT_HEADING, color: '#001D39', lineHeight: '1.2', marginBottom: '20px' }}>
              Kemasan Kertas vs Plastik: Kenapa Brand Besar Mulai Beralih ke Paper-Based Packaging?
            </h1>
            <p style={{ fontSize: isLargeMobile ? '1rem' : '1.25rem', color: '#64748b', lineHeight: '1.6' }}>
              Memahami urgensi penggunaan kemasan ramah lingkungan untuk meningkatkan reputasi brand dan menjaga ekosistem bumi.
            </p>
          </header>

          <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', borderRadius: '24px', overflow: 'hidden', marginBottom: isLargeMobile ? '32px' : '48px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <Image
              src="/artikel (1) (2).webp"
              alt="Kemasan Kertas Ramah Lingkungan"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <section style={{ fontSize: isLargeMobile ? '1rem' : '1.125rem', lineHeight: '1.8', color: '#334155', fontFamily: FONT_BODY }}>
            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: '32px', marginBottom: '16px' }}>Penjelasan: Apa Itu Kemasan Ramah Lingkungan?</h2>
            <p style={{ marginBottom: '24px' }}>
              Kemasan ramah lingkungan atau <em>eco-friendly packaging</em> adalah kemasan yang didesain agar memiliki dampak minimal terhadap kerusakan lingkungan. Ciri utamanya adalah mudah terurai secara alami (biodegradable), dapat didaur ulang (recyclable), dan diproduksi dengan konsumsi energi yang rendah. Dalam hal ini, kemasan berbasis kertas menjadi primadona karena sifatnya yang organik dibandingkan plastik yang membutuhkan ratusan tahun untuk hancur.
            </p>

            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: isLargeMobile ? '32px' : '48px', marginBottom: '16px' }}>Masalah yang Disebabkan oleh Kemasan Plastik</h2>
            <p style={{ marginBottom: '20px' }}>
              Meskipun murah dan ringan, penggunaan plastik sekali pakai dalam jangka panjang telah menciptakan krisis global yang serius bagi kesehatan dan ekosistem kita:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '12px' }}><strong>Sulit Terurai:</strong> Plastik membutuhkan waktu 100 hingga 500 tahun untuk hancur sepenuhnya. Sampah plastik yang kita gunakan hari ini akan tetap ada hingga generasi cucu kita nanti.</li>
              <li style={{ marginBottom: '12px' }}><strong>Ancaman Mikroplastik:</strong> Plastik tidak benar-benar hancur, melainkan pecah menjadi partikel kecil yang disebut mikroplastik. Partikel ini kini telah masuk ke dalam rantai makanan melalui air dan hewan laut, yang akhirnya masuk ke tubuh manusia.</li>
              <li style={{ marginBottom: '12px' }}><strong>Migrasi Zat Kimia Berbahaya:</strong> Plastik mengandung zat seperti BPA dan Phthalates yang dapat bermigrasi ke dalam makanan atau minuman, terutama jika terkena suhu panas. Hal ini berpotensi memicu masalah kesehatan serius seperti gangguan hormon dan risiko kanker.</li>
              <li style={{ marginBottom: '12px' }}><strong>Pencemaran Ekosistem Laut:</strong> Jutaan ton sampah plastik berakhir di lautan setiap tahun, merusak terumbu karang dan membunuh jutaan hewan laut yang tidak sengaja memakannya.</li>
            </ul>

            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: isLargeMobile ? '32px' : '48px', marginBottom: '16px' }}>Keunggulan Kemasan Kertas Dibandingkan Plastik</h2>
            <p style={{ marginBottom: '20px' }}>
              Mengapa kemasan kertas dianggap jauh lebih unggul dalam kacamata bisnis dan lingkungan?
            </p>

            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '12px' }}><strong>Sifat Biodegradable:</strong> Kertas terbuat dari serat kayu yang bisa hancur dan menyatu kembali dengan tanah dalam waktu singkat (biasanya 2-6 bulan), sedangkan plastik pecah menjadi mikroplastik yang berbahaya.</li>
              <li style={{ marginBottom: '12px' }}><strong>Citra Brand Premium:</strong> Secara psikologis, konsumen menganggap produk dalam kemasan kertas atau box memiliki nilai lebih tinggi dan eksklusif. Kemasan kertas memberikan tekstur yang lebih mewah dan profesional.</li>
              <li style={{ marginBottom: '12px' }}><strong>Keamanan Pangan (Food Grade):</strong> Kertas khusus seperti Ivory atau Greaseproof sangat aman untuk makanan karena tidak mengandung zat kimia berbahaya yang bisa bermigrasi saat terkena panas, berbeda dengan stereofoam atau plastik kualitas rendah.</li>
              <li style={{ marginBottom: '12px' }}><strong>Dukungan Terhadap Regulasi:</strong> Banyak pemerintah daerah di Indonesia mulai melarang penggunaan kantong plastik sekali pakai. Menggunakan kemasan kertas berarti brand Anda sudah siap menghadapi perubahan hukum di masa depan.</li>
            </ul>

            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: isLargeMobile ? '32px' : '48px', marginBottom: '16px' }}>Kenapa Harus Kertas?</h2>
            <p style={{ marginBottom: '24px' }}>
              Selain alasan lingkungan, penggunaan kertas memungkinkan teknik branding yang lebih luas. Melalui percetakan offset, kemasan kertas bisa dicetak dengan warna-warna tajam, diberi laminasi mewah, hingga efek timbul (emboss). Hal ini sulit dilakukan secara maksimal pada permukaan plastik yang tipis dan licin. Dengan kertas, brand Anda memiliki "kanvas" yang lebih luas untuk bercerita kepada pelanggan.
            </p>

            <div style={{ backgroundColor: '#f8fafc', padding: isLargeMobile ? '24px' : '40px', borderRadius: '32px', marginTop: '60px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2.25rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#0A4174', marginBottom: '20px', textAlign: 'center', lineHeight: '1.2' }}>
                Wujudkan Kemasan Ramah Lingkungan Anda Bersama Percetakan Dallas
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '32px', opacity: 0.9, fontSize: isLargeMobile ? '0.95rem' : '1rem' }}>
                Percetakan Dallas Kediri berkomitmen mendukung gerakan hijau dengan menyediakan berbagai pilihan material kertas berkualitas tinggi:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontWeight: '700', marginBottom: '8px', color: '#0A4174' }}>🌱 Paper Tray & Lunch Box</h3>
                  <p style={{ fontSize: '0.9rem' }}>Solusi pengganti plastik dan stereofoam untuk bisnis kuliner Anda. Higienis dan ramah lingkungan.</p>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontWeight: '700', marginBottom: '8px', color: '#0A4174' }}>🛍️ Paper Bag Berbagai Ukuran</h3>
                  <p style={{ fontSize: '0.9rem' }}>Pengganti kantong plastik yang kuat dan meningkatkan estetika brand fashion atau gift shop Anda.</p>
                </div>
              </div>

              <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '32px' }}>
                <h3 style={{ fontSize: isLargeMobile ? '1.25rem' : '1.5rem', fontWeight: '700', marginBottom: '16px' }}>Konsultasi Gratis Sekarang</h3>
                <p style={{ marginBottom: '24px', opacity: 0.9, fontSize: isLargeMobile ? '0.9rem' : '1rem' }}>
                  Ingin beralih ke kemasan kertas tapi bingung soal biaya? Tim Dallas siap membantu menghitungkan spesifikasi paling efisien untuk bisnis Anda.
                </p>
                <Link href="https://wa.me/6281260001487" style={{ backgroundColor: '#25D366', color: '#ffffff', padding: isLargeMobile ? '14px 24px' : '16px 40px', borderRadius: '50px', textDecoration: 'none', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: isLargeMobile ? '0.95rem' : '1.1rem' }}>
                  <Icon icon="mdi:whatsapp" fontSize="24" /> Hubungi Kami Sekarang
                </Link>
              </div>
            </div>
          </section>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
}
