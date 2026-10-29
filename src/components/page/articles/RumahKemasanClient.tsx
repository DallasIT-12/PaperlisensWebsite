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

export default function RumahKemasanClient() {
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
              <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '4px 16px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>UMKM KEDIRI</span>
              <span style={{ color: '#64748b', fontSize: '0.8rem', alignSelf: 'center' }}>22 Agustus 2026 • 10 Menit Baca</span>
            </div>
            <h1 style={{
              fontSize: isSmallMobile ? '1.75rem' : (isLargeMobile ? '2.25rem' : '3.5rem'),
              fontWeight: '800',
              fontFamily: FONT_HEADING,
              color: '#001D39',
              lineHeight: '1.2',
              marginBottom: '20px'
            }}>
              Rumah Kemasan UMKM Kediri: Apa Itu dan Bagaimana Pelaku Usaha Bisa Memanfaatkannya?
            </h1>
            <p style={{
              fontSize: isLargeMobile ? '1rem' : '1.15rem',
              color: '#64748b',
              lineHeight: '1.6',
              fontStyle: 'italic' as const,
              fontFamily: FONT_BODY,
            }}>
              Ditulis oleh Tim Akselerasi dan Inovasi Dallas Printing — pabrik cetak offset berpengalaman melayani kemasan food grade untuk UMKM kuliner, katering, cafe, dan restoran di Kediri, Surabaya, dan seluruh Indonesia.
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
              alt="rumah kemasan UMKM Kediri"
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
              Bagi pelaku UMKM di Kediri, kemasan sering jadi salah satu kendala terbesar dalam mengembangkan usaha. Untuk mendapatkan kemasan yang menarik dan berkualitas, banyak pelaku usaha kecil harus memesan dalam jumlah besar dengan biaya yang tidak sedikit — sesuatu yang sulit dijangkau ketika usaha masih dalam skala rumahan.
            </p>
            <p style={paragraphStyle}>
              Menjawab kendala ini, Pemerintah Kabupaten Kediri tengah menyiapkan program bernama <strong>Rumah Kemasan</strong>, yang ditujukan khusus untuk membantu pelaku UMKM mendapatkan akses kemasan produk yang lebih baik. Artikel ini akan membahas apa itu Rumah Kemasan UMKM Kediri, siapa yang menjalankannya, dan bagaimana pelaku usaha bisa memanfaatkannya.
            </p>

            {/* --- Section: Apa Itu --- */}
            <h2 style={sectionHeadingStyle}>Apa Itu Rumah Kemasan UMKM Kediri?</h2>
            <p style={paragraphStyle}>
              Rumah Kemasan adalah fasilitas yang diinisiasi oleh Bupati Kediri Hanindhito Himawan Pramana untuk memfasilitasi pelaku usaha mikro, kecil, dan menengah (UMKM) dalam menyediakan kemasan produk yang lebih berkualitas dan menarik. Program ini digagas untuk menjawab keluhan pelaku UMKM yang selama ini kesulitan mengakses kemasan berkualitas karena harus memesan dalam jumlah besar dengan biaya tinggi.
            </p>
            <p style={paragraphStyle}>
              Rencananya, di Rumah Kemasan ini pelaku UMKM bisa membuat desain dan mencetak kemasan mereka sendiri, tanpa harus memesan dalam skala besar ke pihak luar.
            </p>

            {/* --- Section: Siapa yang Menjalankan --- */}
            <h2 style={sectionHeadingStyle}>Siapa yang Menjalankan Program Ini?</h2>
            <p style={paragraphStyle}>
              Program Rumah Kemasan dijalankan oleh Dinas Koperasi dan Usaha Mikro (Diskopusmik) Kabupaten Kediri. Rencana pendirian fasilitas ini pertama kali disampaikan dalam seminar kewirausahaan bertema &quot;Membangun Sinergitas UMKM Menuju Kediri Berdaya dan Berbudaya&quot; yang digelar September 2024 di Kecamatan Banyakan, dihadiri sekitar 250 pelaku UMKM dari berbagai kecamatan.
            </p>
            <p style={paragraphStyle}>
              Selain Diskopusmik, Dewan Kerajinan Nasional Daerah (Dekranasda) Kabupaten Kediri juga turut mendukung upaya penyediaan kemasan bagi UMKM, khususnya untuk pengembangan produk industri kreatif dan kerajinan lokal.
            </p>

            {/* --- Section: Lokasi dan Rencana --- */}
            <h2 style={sectionHeadingStyle}>Lokasi dan Rencana Operasional</h2>
            <p style={paragraphStyle}>
              Rumah Kemasan direncanakan berlokasi di Garasi UMKM Pare, salah satu pusat pemasaran produk UMKM yang sudah ada di Kabupaten Kediri. Berdasarkan informasi yang beredar, fasilitas ini ditargetkan bisa mulai dimanfaatkan pelaku usaha secara bertahap seiring proses pengadaan peralatan yang terus berjalan.
            </p>
            <p style={paragraphStyle}>
              Karena program ini masih terus berkembang, pelaku usaha yang berminat sebaiknya memastikan langsung status dan jadwal terkini ke Diskopusmik Kabupaten Kediri sebelum berkunjung.
            </p>

            {/* --- Section: Siapa yang Bisa Mengakses --- */}
            <h2 style={sectionHeadingStyle}>Siapa yang Bisa Mengakses Program Ini?</h2>
            <p style={paragraphStyle}>
              Rumah Kemasan ditujukan untuk pelaku UMKM yang terdaftar dan berdomisili di wilayah Kabupaten Kediri. Berdasarkan data Diskopusmik, tercatat lebih dari 25.000 pelaku usaha mikro di Kabupaten Kediri yang tergabung dalam puluhan paguyuban dan kelompok UMKM di berbagai kecamatan — jumlah yang menunjukkan besarnya potensi pemanfaatan program ini ke depannya.
            </p>
            <p style={paragraphStyle}>
              Di luar layanan kemasan, Diskopusmik Kabupaten Kediri juga secara rutin memfasilitasi pelaku UMKM dalam pengurusan legalitas usaha seperti Nomor Induk Berusaha (NIB) dan Produk Industri Rumah Tangga (PIRT), standarisasi merek halal, sertifikasi edar BPOM, hingga pemasaran produk lewat outlet Garasi UMKM di beberapa kecamatan.
            </p>

            {/* --- Section: Kapan Memilih Mitra Cetak --- */}
            <h2 style={sectionHeadingStyle}>Kapan Sebaiknya UMKM Memilih Mitra Cetak Kemasan Swasta?</h2>
            <p style={paragraphStyle}>
              Rumah Kemasan adalah langkah yang sangat membantu, terutama bagi UMKM yang baru mulai merapikan tampilan kemasan produknya. Namun, karena sifatnya self-print (pelaku usaha mendesain dan mencetak sendiri) dan kapasitasnya masih dalam tahap pengembangan, ada beberapa kebutuhan yang biasanya lebih pas dilayani oleh mitra cetak kemasan swasta yang sudah berpengalaman, misalnya:
            </p>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginBottom: '32px',
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                {[
                  'Kebutuhan cetak dalam volume besar dengan waktu produksi cepat',
                  'Kemasan dengan bahan khusus food grade untuk produk makanan dan minuman',
                  'Desain custom kompleks dengan finishing seperti laminasi, emboss, atau hot stamping',
                  'UMKM yang berlokasi di Kota Kediri atau luar Kabupaten Kediri dan belum tentu masuk cakupan program',
                  'Kebutuhan mendesak yang tidak bisa menunggu jadwal fasilitas milik pemerintah',
                ].map((item, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Icon icon="mdi:check-circle" style={{ color: '#0A4174', fontSize: '20px', marginTop: '3px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p style={paragraphStyle}>
              Dallas Printing, sebagai pabrik cetak offset yang berbasis di Kediri, hadir sebagai salah satu opsi pelengkap untuk kebutuhan ini — sepenuhnya independen dari program Rumah Kemasan milik Pemkab, dan melayani UMKM baik di Kabupaten maupun Kota Kediri, Surabaya, hingga seluruh Indonesia.
            </p>
            <p style={paragraphStyle}>
              Kalau kamu sedang mempertimbangkan kemasan berbahan food grade seperti paper tray, kami sudah bahas lengkap kenapa ini jadi pilihan yang semakin banyak dipilih pelaku usaha di artikel{' '}
              <Link href="/articles/upgrade-kemasan-paper-tray" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
                Saatnya Upgrade Kemasan: 5 Alasan Beralih ke Paper Tray
              </Link>.
            </p>

            {/* --- Kesimpulan --- */}
            <h2 style={sectionHeadingStyle}>Kesimpulan</h2>
            <p style={paragraphStyle}>
              Rumah Kemasan UMKM Kediri adalah langkah positif dari Pemkab Kediri untuk membantu pelaku usaha kecil mengakses kemasan produk yang lebih baik tanpa harus memesan dalam skala besar. Program ini sangat cocok sebagai titik awal bagi UMKM yang baru merintis, terutama untuk kebutuhan desain dan cetak skala kecil.
            </p>
            <p style={paragraphStyle}>
              Sementara itu, untuk kebutuhan yang lebih besar, mendesak, atau memerlukan bahan food grade khusus, Paperlisens dari Dallas Printing siap membantu —{' '}
              <Link href="/paperlisens" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
                lihat pilihan produk kemasan di sini
              </Link>, atau{' '}
              <a href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20tertarik%20dengan%20kemasan%20Paperlisens" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
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
                FAQ Seputar Rumah Kemasan UMKM Kediri
              </h2>

              <FAQItem
                question="Apa itu Rumah Kemasan UMKM Kediri?"
                answer="Rumah Kemasan adalah program yang diinisiasi Pemkab Kediri melalui Diskopusmik untuk membantu pelaku UMKM mendesain dan mencetak kemasan produk mereka sendiri, tanpa harus memesan dalam jumlah besar ke pihak luar."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Apakah program ini gratis?"
                answer="Berdasarkan keterangan Diskopusmik Kabupaten Kediri, layanan ini direncanakan tidak dipungut biaya bagi UMKM yang memanfaatkannya. Untuk kepastian dan syarat terbaru, disarankan menghubungi langsung Diskopusmik Kabupaten Kediri."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Siapa yang bisa menggunakan Rumah Kemasan?"
                answer="Program ini ditujukan untuk pelaku UMKM yang terdaftar dan berdomisili di wilayah Kabupaten Kediri."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Apa bedanya Rumah Kemasan dengan jasa cetak kemasan swasta seperti Dallas Printing?"
                answer="Rumah Kemasan bersifat fasilitas self-print dari pemerintah untuk UMKM Kabupaten Kediri, sementara Dallas Printing adalah pabrik cetak offset swasta yang independen, melayani cetak kemasan custom skala lebih besar, bahan food grade, dan pengiriman ke seluruh Indonesia — cocok untuk kebutuhan yang belum tercakup oleh fasilitas pemerintah."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Apakah UMKM di Kota Kediri bisa memanfaatkan program ini?"
                answer="Program Rumah Kemasan ini secara khusus ditujukan untuk UMKM di wilayah Kabupaten Kediri. UMKM di Kota Kediri maupun daerah lain tetap bisa mengakses opsi kemasan berkualitas lewat mitra cetak swasta seperti Dallas Printing."
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
                Butuh Kemasan Berkualitas untuk UMKM Anda?
              </h2>
              <p style={{
                marginBottom: '28px',
                opacity: 0.85,
                fontSize: isLargeMobile ? '0.95rem' : '1.05rem',
                maxWidth: '600px',
                margin: '0 auto 28px',
                fontFamily: FONT_BODY,
              }}>
                Konsultasikan kebutuhan kemasan food grade dan desain custom Anda bersama tim Paperlisens. Gratis, tanpa komitmen!
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
                <a
                  href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20tertarik%20dengan%20kemasan%20Paperlisens"
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
          fontFamily: "var(--font-source-sans), 'Source Sans 3', sans-serif",
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
            paddingLeft: '4px',
            fontFamily: "var(--font-source-sans), 'Source Sans 3', sans-serif",
          }}
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
}
