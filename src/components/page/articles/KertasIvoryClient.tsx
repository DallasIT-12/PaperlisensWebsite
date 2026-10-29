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

export default function IvoryArticlePage() {
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
              <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '4px 16px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>MATERIAL</span>
              <span style={{ color: '#64748b', fontSize: '0.8rem', alignSelf: 'center' }}>5 Februari 2026 • 8 Menit Baca</span>
            </div>
            <h1 style={{ fontSize: isSmallMobile ? '1.75rem' : (isLargeMobile ? '2.25rem' : '3.5rem'), fontWeight: '800', fontFamily: FONT_HEADING, color: '#001D39', lineHeight: '1.2', marginBottom: '24px' }}>
              Panduan Teknis Material: Memahami Karakteristik Kertas Ivory dalam Manufaktur Packaging
            </h1>
            <p style={{ fontSize: isLargeMobile ? '1rem' : '1.25rem', color: '#64748b', lineHeight: '1.6', fontStyle: 'italic' }}>
              Optimasi pemilihan material untuk cetak kemasan premium dan standar keamanan pangan.
            </p>
          </header>

          <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', borderRadius: '24px', overflow: 'hidden', marginBottom: isLargeMobile ? '32px' : '48px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <Image
              src="/artikel (1).webp"
              alt="Kertas Ivory"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <section style={{ fontSize: isLargeMobile ? '1rem' : '1.125rem', lineHeight: '1.8', color: '#334155', fontFamily: FONT_BODY }}>
            <p style={{ marginBottom: '24px' }}>
              Dalam ekosistem <strong>manufaktur packaging</strong> modern, pemilihan material bukan sekadar urusan biaya, melainkan tentang integritas struktural dan representasi brand. Kertas Ivory (Ivory Paper) telah lama menjadi standar industri untuk <strong>cetak kemasan premium</strong> berkat perpaduan unik antara estetika dan rigiditas.
            </p>

            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: isLargeMobile ? '32px' : '48px', marginBottom: '16px' }}>Analisis Teknis Sisi Kertas: Coated vs Uncoated</h2>
            <p style={{ marginBottom: '24px' }}>
              Karakteristik kertas ivory yang paling menonjol adalah perbedaan tekstur pada kedua sisinya. Hal ini terjadi karena proses manufaktur yang hanya memberikan lapisan coating pada satu permukaan saja.
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '12px' }}><strong>Sisi Depan (Coated/Glossy):</strong> Memiliki permukaan yang sangat halus dan putih bersih. Coating ini berfungsi untuk menahan tinta agar tetap berada di permukaan (ink holdout), menghasilkan warna yang tajam, vibrant, dan kontras tinggi.</li>
              <li style={{ marginBottom: '12px' }}><strong>Sisi Belakang (Uncoated/Doff):</strong> Tidak memiliki lapisan kimia tambahan, sehingga teksturnya sedikit lebih kasar and doff. Sisi ini memiliki daya serap tinta yang lebih tinggi namun saturasi warna yang dihasilkan lebih rendah dibandingkan sisi depan.</li>
            </ul>
            <p style={{ marginBottom: '24px' }}>
              <strong>Implikasi Cetak Dua Sisi:</strong> Untuk cetak dua sisi (duplex printing), operator harus melakukan penyesuaian profil warna (ICC profile) yang berbeda untuk masing-masing sisi. Sisi belakang biasanya digunakan untuk instruksi penggunaan atau informasi legal yang tidak memerlukan grafis kompleks.
            </p>

            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: isLargeMobile ? '32px' : '48px', marginBottom: '16px' }}>Rentang Gramasi & Matriks Aplikasi</h2>
            <p style={{ marginBottom: '20px' }}>
              Ketebalan kertas ivory diukur dalam gram per meter persegi (gsm). Setiap berat memiliki peruntukan spesifik dalam industri pengemasan:
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '32px', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', minWidth: '600px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left' }}>Gramasi (gsm)</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left' }}>Kekakuan (Stiffness)</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left' }}>Aplikasi Utama</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>210 - 230</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Sedang</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Paperbag premium, brosur eksklusif, box kosmetik kecil.</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>250 - 310</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Tinggi</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Kotak obat (pharmaceutical), packaging gadget, kartu undangan.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>350 - 400</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Sangat Tinggi</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Packaging makanan berat, alas kue (cake board), box souvenir besar.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: isLargeMobile ? '32px' : '48px', marginBottom: '16px' }}>Proses Finishing: Kompatibilitas Kimiawi</h2>
            <p style={{ marginBottom: '20px' }}>
              Permukaan coated pada ivory sangat responsif terhadap berbagai teknik finishing pasca-cetak:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '8px' }}><strong>Laminasi (Doff/Glossy):</strong> Memberikan perlindungan ekstra terhadap air and gesekan.</li>
              <li style={{ marginBottom: '8px' }}><strong>UV Spot:</strong> Sangat efektif pada ivory karena kontras antara area glossy spot and permukaan kertas yang halus sangat kentara.</li>
              <li style={{ marginBottom: '8px' }}><strong>Hot Stamping (Poly):</strong> Permukaan yang rata memungkinkan foil emas atau perak menempel dengan presisi sempurna.</li>
              <li style={{ marginBottom: '8px' }}><strong>Emboss/Deboss:</strong> Karena seratnya yang panjang and kuat, ivory tidak mudah retak (cracking) saat diberi tekanan for efek timbul.</li>
            </ul>

            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: isLargeMobile ? '32px' : '48px', marginBottom: '16px' }}>Standardisasi Food Grade</h2>
            <p style={{ marginBottom: '20px' }}>
              Tidak semua kertas ivory bersifat food grade. Untuk aplikasi kuliner, kertas harus memenuhi kriteria ketat:
            </p>
            <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li style={{ marginBottom: '12px' }}><strong>Bebas OBA (Optical Brightening Agents):</strong> Zat pemutih optik tidak boleh digunakan karena risiko migrasi zat kimia ke makanan.</li>
              <li style={{ marginBottom: '12px' }}><strong>Virgin Pulp:</strong> Harus terbuat dari serat kayu murni, bukan kertas daur ulang yang berisiko mengandung kontaminan tinta bekas atau perekat.</li>
              <li style={{ marginBottom: '12px' }}><strong>Sertifikasi FDA/ISEGA:</strong> Memastikan material aman bersentuhan langsung dengan makanan berminyak atau lembap.</li>
            </ol>

            <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', marginTop: isLargeMobile ? '32px' : '48px', marginBottom: '16px' }}>Analisis Komparatif: Ivory vs Duplex vs Art Carton</h2>
            <div style={{ overflowX: 'auto', marginBottom: '32px', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', minWidth: '600px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0A4174', color: '#ffffff' }}>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Fitur</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Ivory</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Duplex</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Art Carton</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}>Sisi Belakang</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Putih Doff</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Abu-abu</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Putih Coated</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}>Rigiditas</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Sangat Tinggi</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Tinggi</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Sedang</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}>Harga</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Premium</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Ekonomis</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Menengah</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ backgroundColor: '#f1f5f9', padding: isLargeMobile ? '24px' : '32px', borderRadius: '24px', marginTop: '48px', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#001D39', marginBottom: '16px' }}>FAQ Kertas Ivory</h3>
              <p style={{ marginBottom: '12px' }}><strong>Q: Apakah kertas ivory bisa dicetak offset?</strong><br />A: Ya, ini adalah metode terbaik. Ivory sangat ideal for mesin offset Heidelberg atau Komori.</p>
              <p><strong>Q: Bisakah ivory digunakan for packaging produk beku?</strong><br />A: Bisa, namun wajib menggunakan varian PE-Coated for mencegah kertas hancur akibat kondensasi.</p>
            </div>
          </section>
        </motion.article>

        <div style={{ marginTop: isLargeMobile ? '40px' : '80px', paddingTop: '40px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ fontSize: isLargeMobile ? '1.25rem' : '1.5rem', fontWeight: '700', marginBottom: '16px' }}>Butuh Konsultasi Cetak Kemasan Premium?</h3>
          <Link href="https://wa.me/6281260001487" style={{ backgroundColor: '#25D366', color: '#ffffff', padding: isLargeMobile ? '14px 24px' : '16px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s', fontSize: isLargeMobile ? '0.95rem' : '1rem' }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Icon icon="mdi:whatsapp" fontSize="24" /> Hubungi Kami Sekarang
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}