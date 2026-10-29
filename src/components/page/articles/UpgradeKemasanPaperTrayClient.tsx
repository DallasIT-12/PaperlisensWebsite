'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const FONT_HEADING = "var(--font-poppins), 'Poppins', sans-serif";
const FONT_BODY = "var(--font-source-sans), 'Source Sans 3', sans-serif";

export default function UpgradeKemasanPaperTrayArticle() {
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isLargeMobile, setIsLargeMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallMobile(window.innerWidth < 480);
      setIsLargeMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const sectionHeadingStyle = {
    fontSize: isLargeMobile ? '1.5rem' : '2rem',
    fontWeight: '700' as const,
    fontFamily: FONT_HEADING,
    color: '#001D39',
    marginTop: isLargeMobile ? '32px' : '48px',
    marginBottom: '16px',
    lineHeight: '1.3' as const,
  };

  const paragraphStyle = {
    marginBottom: '24px',
    lineHeight: '1.85' as const,
    fontFamily: FONT_BODY,
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b', overflowX: 'hidden' as const }}>
      <Navbar />

      <main style={{ maxWidth: '900px', margin: '88px auto 0', padding: isLargeMobile ? '32px 16px' : '60px 24px' }}>
        <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

          {/* --- Header --- */}
          <header style={{ marginBottom: isLargeMobile ? '32px' : '48px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' as const }}>
              <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '4px 16px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>KEMASAN</span>
              <span style={{ color: '#64748b', fontSize: '0.8rem', alignSelf: 'center' }}>21 Agustus 2026 • 8 Menit Baca</span>
            </div>
            <h1 style={{
              fontSize: isSmallMobile ? '1.75rem' : (isLargeMobile ? '2.25rem' : '3.5rem'),
              fontWeight: '800',
              fontFamily: FONT_HEADING,
              color: '#001D39',
              lineHeight: '1.2',
              marginBottom: '20px'
            }}>
              Saatnya Upgrade Kemasan: 5 Alasan Harus Beralih ke Paper Tray
            </h1>
            <p style={{
              fontSize: isLargeMobile ? '1rem' : '1.15rem',
              color: '#64748b',
              lineHeight: '1.6',
              fontStyle: 'italic' as const,
              fontFamily: FONT_BODY,
            }}>
              Ditulis oleh Tim Akselerasi dan Inovasi Dallas Printing — pabrik cetak offset berpengalaman melayani kemasan food grade untuk UMKM kuliner, katering, cafe, dan restoran di seluruh Indonesia.
            </p>
          </header>

          {/* --- Hero Image --- */}
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: isLargeMobile ? '32px' : '48px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <Image
              src="/paperlisens papertray.webp"
              alt="paper tray kemasan produk ramah lingkungan"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* --- Article Body --- */}
          <section style={{ fontSize: isLargeMobile ? '1rem' : '1.125rem', lineHeight: '1.8', color: '#334155', fontFamily: FONT_BODY }}>

            {/* Intro */}
            <p style={paragraphStyle}>
              Kemasan bukan lagi sekadar pelindung produk — kemasan adalah representasi dari brand kamu. Di tengah meningkatnya kesadaran konsumen terhadap isu lingkungan dan tampilan visual yang semakin diperhitungkan, banyak pelaku usaha mulai meninggalkan kemasan konvensional seperti plastik dan styrofoam, lalu beralih ke <strong>paper tray</strong> sebagai solusi kemasan yang lebih modern.
            </p>
            <p style={paragraphStyle}>
              Tren ini juga terlihat jelas pada pelaku UMKM kuliner di Kediri dan Surabaya, yang semakin banyak beralih ke paper tray untuk produk bakery, hampers, hingga menu takeaway mereka.
            </p>
            <p style={paragraphStyle}>
              Kalau kamu masih ragu untuk melakukan perpindahan ini, berikut <strong>5 alasan kuat</strong> kenapa sekarang adalah waktu yang tepat untuk upgrade kemasan produkmu ke paper tray.
            </p>

            {/* --- Reason 1 --- */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginTop: isLargeMobile ? '32px' : '48px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ backgroundColor: '#001D39', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', flexShrink: 0 }}>1</span>
                <h2 style={{ fontSize: isLargeMobile ? '1.35rem' : '1.75rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', margin: 0, lineHeight: '1.3' }}>
                  Tampilan Produk Jadi Lebih Premium
                </h2>
              </div>
              <p style={{ margin: 0, lineHeight: '1.85' }}>
                Paper tray memiliki desain yang bersih, rapi, dan minimalis — karakteristik yang secara visual langsung memberi kesan kualitas lebih tinggi. Berbeda dengan styrofoam atau plastik yang cenderung terlihat murah, tekstur dan bentuk paper tray memberi nuansa modern yang membuat produk kamu tampak lebih &quot;niat&quot; dan profesional di mata pelanggan.
              </p>
            </div>

            {/* --- Reason 2 --- */}
            <div style={{
              backgroundColor: '#ecfeff',
              border: '1px solid #a5f3fc',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ backgroundColor: '#001D39', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', flexShrink: 0 }}>2</span>
                <h2 style={{ fontSize: isLargeMobile ? '1.35rem' : '1.75rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', margin: 0, lineHeight: '1.3' }}>
                  Lebih Ramah Lingkungan Dibanding Styrofoam dan Plastik
                </h2>
              </div>
              <p style={{ margin: 0, lineHeight: '1.85' }}>
                Salah satu alasan terbesar bisnis beralih ke <strong>kemasan ramah lingkungan</strong> adalah tuntutan pasar. Konsumen, terutama generasi muda, semakin selektif memilih brand yang peduli terhadap isu keberlanjutan (<em>sustainability</em>). Paper tray, karena berbahan dasar kertas, jauh lebih mudah terurai dibanding styrofoam atau plastik sekali pakai — menjadikannya pilihan yang lebih bertanggung jawab tanpa mengorbankan fungsi kemasan.
              </p>
            </div>

            {/* --- Reason 3 --- */}
            <div style={{
              backgroundColor: '#fefce8',
              border: '1px solid #fde68a',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ backgroundColor: '#001D39', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', flexShrink: 0 }}>3</span>
                <h2 style={{ fontSize: isLargeMobile ? '1.35rem' : '1.75rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', margin: 0, lineHeight: '1.3' }}>
                  Lebih Kokoh dan Fungsional untuk Berbagai Jenis Produk
                </h2>
              </div>
              <p style={{ margin: 0, lineHeight: '1.85' }}>
                Meski terbuat dari kertas, paper tray didesain agar tetap kuat menahan bentuk dan menjaga produk tetap stabil, baik untuk kebutuhan display di etalase, pengiriman, maupun kemasan takeaway. Struktur yang kokoh ini mengurangi risiko produk bergeser, rusak, atau tumpah selama proses distribusi. Pemilihan bahan kertas turut menentukan kekokohan ini — kalau kamu penasaran soal perbedaan jenis kertas kemasan, kami sudah bahas lengkap di artikel{' '}
                <Link href="/articles/kertas-ivory" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
                  Perbedaan Kertas Ivory dan Art Paper
                </Link>.
              </p>
            </div>

            {/* --- Reason 4 --- */}
            <div style={{
              backgroundColor: '#faf5ff',
              border: '1px solid #d8b4fe',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ backgroundColor: '#001D39', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', flexShrink: 0 }}>4</span>
                <h2 style={{ fontSize: isLargeMobile ? '1.35rem' : '1.75rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', margin: 0, lineHeight: '1.3' }}>
                  Media Branding yang Lebih Efektif
                </h2>
              </div>
              <p style={{ margin: 0, lineHeight: '1.85' }}>
                Permukaan paper tray yang cukup luas menjadikannya media branding yang ideal. Logo, warna khas brand, hingga desain custom bisa dicetak dengan jelas dan konsisten di setiap kemasan. Branding yang kuat dan seragam ini membantu membangun <em>brand recall</em> — sehingga pelanggan lebih mudah mengingat dan mengenali produkmu, termasuk saat dibagikan di media sosial lewat konten unboxing.
              </p>
            </div>

            {/* --- Reason 5 --- */}
            <div style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ backgroundColor: '#001D39', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', flexShrink: 0 }}>5</span>
                <h2 style={{ fontSize: isLargeMobile ? '1.35rem' : '1.75rem', fontWeight: '700', fontFamily: FONT_HEADING, color: '#001D39', margin: 0, lineHeight: '1.3' }}>
                  Nilai Investasi Jangka Panjang untuk Brand Image
                </h2>
              </div>
              <p style={{ margin: 0, lineHeight: '1.85' }}>
                Beralih ke paper tray bukan sekadar mengganti kemasan, tapi investasi terhadap citra brand secara keseluruhan. Kombinasi antara tampilan premium, kesan ramah lingkungan, dan fungsi yang tetap optimal menjadikan paper tray sebagai kemasan yang mendukung positioning brand kamu di pasar yang semakin kompetitif — baik untuk bisnis F&amp;B, retail, hampers, maupun produk custom lainnya.
              </p>
            </div>

            {/* --- Kesimpulan --- */}
            <h2 style={sectionHeadingStyle}>Kesimpulan</h2>
            <p style={paragraphStyle}>
              Upgrade kemasan ke paper tray adalah langkah strategis yang memberi dampak langsung terhadap persepsi pelanggan — dari tampilan yang lebih premium, kesan ramah lingkungan, hingga branding yang lebih kuat. Di tengah persaingan bisnis yang semakin ketat, detail sekecil kemasan bisa menjadi pembeda yang membuat brand kamu lebih diingat.
            </p>
            <p style={paragraphStyle}>
              Kalau kamu sedang mencari supplier paper tray yang bisa menyesuaikan ukuran, desain, dan kebutuhan brand kamu, <strong>Paperlisens</strong> siap membantu — lihat pilihan{' '}
              <Link href="/paperlisens/category/paper-tray" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
                produk paper tray di sini
              </Link>, atau langsung{' '}
              <a href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20tertarik%20dengan%20paper%20tray%20Paperlisens" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
                konsultasi gratis lewat WhatsApp
              </a>.
            </p>

            {/* --- FAQ Section --- */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: isLargeMobile ? '28px 20px' : '40px',
              borderRadius: '24px',
              marginTop: isLargeMobile ? '40px' : '60px',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: isLargeMobile ? '1.5rem' : '2rem',
                fontWeight: '700',
                fontFamily: FONT_HEADING,
                color: '#001D39',
                marginBottom: '28px',
                textAlign: 'center'
              }}>
                <Icon icon="mdi:frequently-asked-questions" style={{ marginRight: '10px', verticalAlign: 'middle', fontSize: '1.2em' }} />
                FAQ Seputar Paper Tray
              </h2>

              <FAQItem
                question="Apa itu paper tray?"
                answer="Paper tray adalah jenis kemasan berbahan dasar kertas yang biasa digunakan sebagai wadah makanan, produk retail, atau hampers, sebagai alternatif dari styrofoam dan plastik."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Apakah paper tray aman untuk makanan?"
                answer="Ya, paper tray umumnya dilapisi material food grade sehingga aman digunakan untuk kontak langsung dengan makanan."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Apakah paper tray lebih mahal dari styrofoam?"
                answer="Harga bisa bervariasi tergantung ukuran, ketebalan, dan finishing. Namun banyak brand menilai nilai tambah dari sisi tampilan dan citra ramah lingkungan sebanding dengan selisih biayanya."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Apakah Paperlisens bisa kirim paper tray ke luar Kediri dan Surabaya?"
                answer="Bisa. Paperlisens melayani pengiriman paper tray dan kemasan food grade lainnya ke seluruh Indonesia, dengan basis produksi di Kediri & Surabaya."
                isLargeMobile={isLargeMobile}
                isLast
              />
            </div>

            {/* --- CTA Section --- */}
            <div style={{
              backgroundColor: '#001D39',
              color: '#ffffff',
              padding: isLargeMobile ? '32px 20px' : '48px',
              borderRadius: '32px',
              marginTop: '48px',
              textAlign: 'center' as const
            }}>
              <h2 style={{
                fontSize: isLargeMobile ? '1.5rem' : '2.25rem',
                fontWeight: '700',
                fontFamily: FONT_HEADING,
                marginBottom: '16px',
                lineHeight: '1.2'
              }}>
                Siap Upgrade Kemasan Bisnis Anda?
              </h2>
              <p style={{
                marginBottom: '28px',
                opacity: 0.85,
                fontSize: isLargeMobile ? '0.95rem' : '1.05rem',
                maxWidth: '600px',
                margin: '0 auto 28px'
              }}>
                Konsultasikan kebutuhan paper tray dan kemasan custom Anda bersama tim Paperlisens. Gratis, tanpa komitmen!
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
                <a
                  href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20tertarik%20dengan%20paper%20tray%20Paperlisens"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    padding: isLargeMobile ? '14px 24px' : '16px 40px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: isLargeMobile ? '0.95rem' : '1.1rem'
                  }}
                >
                  <Icon icon="mdi:whatsapp" fontSize="24" /> Hubungi Kami Sekarang
                </a>
                <Link
                  href="/paperlisens"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    padding: isLargeMobile ? '14px 24px' : '16px 40px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: isLargeMobile ? '0.95rem' : '1.05rem',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <Icon icon="mdi:store" fontSize="20" /> Lihat Katalog Paperlisens
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

// --- FAQ Item Component ---
function FAQItem({ question, answer, isLargeMobile, isLast = false }: {
  question: string;
  answer: string;
  isLargeMobile: boolean;
  isLast?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      borderBottom: isLast ? 'none' : '1px solid #e2e8f0',
      paddingBottom: isLast ? 0 : '16px',
      marginBottom: isLast ? 0 : '16px'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '8px 0',
          textAlign: 'left' as const,
        }}
      >
        <span style={{
          fontWeight: '600',
          color: '#001D39',
          fontSize: isLargeMobile ? '0.95rem' : '1.05rem',
          lineHeight: '1.4',
          paddingRight: '12px'
        }}>
          {question}
        </span>
        <Icon
          icon={isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
          style={{
            fontSize: '24px',
            color: '#64748b',
            flexShrink: 0,
            transition: 'transform 0.2s ease'
          }}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          style={{
            color: '#475569',
            fontSize: isLargeMobile ? '0.9rem' : '0.95rem',
            lineHeight: '1.7',
            paddingTop: '8px',
            paddingLeft: '4px'
          }}
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
}
