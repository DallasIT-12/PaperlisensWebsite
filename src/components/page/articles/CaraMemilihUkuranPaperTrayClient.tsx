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

export default function CaraMemilihUkuranPaperTrayClient() {
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

  const cupCards = [
    {
      name: 'Cup Kentang A',
      subtitle: 'Ukuran Kecil',
      image: '/artikel_cup_A.webp',
      altText: 'paper tray cup A ukuran kecil Paperlisens',
      corak: 'Animals Orange',
      ukuranAtas: '13,5 x 6 cm',
      ukuranBawah: '8 x 6 cm',
      tinggi: '3,5 cm',
      bgColor: '#fff7ed',
      borderColor: '#fed7aa',
      numberBg: '#ea580c',
      description: 'Cup Kentang A adalah varian paling kecil dalam jajaran paper tray Cup Paperlisens. Sesuai namanya, ukuran ini awalnya didesain untuk kebutuhan kemasan kentang goreng porsi kecil, tapi juga cocok untuk berbagai camilan take-away porsi tunggal seperti cireng, tahu bulat, atau gorengan lainnya. Bentuknya yang ramping dan tidak makan tempat membuatnya jadi pilihan hemat untuk usaha dengan volume penjualan tinggi.',
      corakDesc: 'Tersedia dalam beberapa pilihan corak, salah satunya Animals Orange yang playful dan cocok untuk brand dengan target pasar anak-anak atau keluarga.',
    },
    {
      name: 'Cup B',
      subtitle: 'Ukuran Sedang',
      image: '/artikel_cup_B.webp',
      altText: 'paper tray cup B ukuran sedang Paperlisens',
      corak: 'Foodie Magenta',
      ukuranAtas: '15 x 7 cm',
      ukuranBawah: '12,5 x 7 cm',
      tinggi: '3 cm',
      bgColor: '#fdf2f8',
      borderColor: '#fbcfe8',
      numberBg: '#db2777',
      description: 'Naik satu tingkat dari Cup A, Cup B punya area permukaan lebih luas namun tetap dengan tinggi yang rendah (3 cm) — cocok untuk produk yang perlu ditata melebar, seperti kentang goreng porsi sedang, sosis bakar, atau camilan untuk dibagi 1-2 orang. Desainnya yang landai juga memudahkan produk terlihat penuh dan menarik meski isinya tidak terlalu banyak.',
      corakDesc: 'Tersedia dalam corak Foodie Magenta yang playful dengan ilustrasi makanan, cocok untuk brand kuliner kasual dan kekinian.',
    },
    {
      name: 'Cup C',
      subtitle: 'Ukuran Besar',
      image: '/artikel_cup_C.webp',
      altText: 'paper tray cup C ukuran besar Paperlisens',
      corak: 'Foodie Biru',
      ukuranAtas: '19 x 9 cm',
      ukuranBawah: '15,5 x 9 cm',
      tinggi: '4 cm',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      numberBg: '#2563eb',
      description: 'Cup C masuk kategori ukuran besar, dengan tinggi yang bertambah jadi 4 cm — cukup untuk menampung produk dengan volume lebih banyak atau bertumpuk, seperti cup taco, fried chicken, salad, hingga dessert box. Ukuran ini juga sering jadi pilihan untuk porsi berbagi (sharing) dalam acara kecil atau gathering.',
      corakDesc: 'Hadir dalam corak Foodie Biru dengan tema ilustrasi makanan yang senada dengan Cup B, cocok kalau kamu ingin tampilan kemasan yang konsisten di berbagai ukuran.',
    },
    {
      name: 'Cup D',
      subtitle: 'Ukuran Ekstra Besar',
      image: '/artikel_cup_D.webp',
      altText: 'paper tray cup D ukuran ekstra besar Paperlisens',
      corak: 'Doodle Biru',
      ukuranAtas: '26 x 11 cm',
      ukuranBawah: '24 x 8 cm',
      tinggi: '4 cm',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
      numberBg: '#16a34a',
      description: 'Cup D adalah varian terbesar dan terpanjang di jajaran Cup Paperlisens, dengan panjang mencapai 26 cm. Ukuran ini paling pas untuk hidangan utama porsi besar, nasi lengkap dengan lauk, atau menu sharing yang butuh ruang lebih lega. Bentuknya yang memanjang juga membuat tampilan produk terlihat lebih premium saat disusun rapi di dalamnya.',
      corakDesc: 'Tersedia dalam corak Doodle Biru dengan ilustrasi playful, cocok dipadukan dengan produk-produk bertema kasual dan ramah keluarga.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b', overflowX: 'hidden' as const }}>
      <Navbar />

      <main style={{ maxWidth: '900px', margin: '88px auto 0', padding: isLargeMobile ? '32px 16px' : '60px 24px' }}>
        <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

          {/* --- Header --- */}
          <header style={{ marginBottom: isLargeMobile ? '32px' : '48px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' as const }}>
              <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '4px 16px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>PANDUAN KEMASAN</span>
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
              Cara Memilih Ukuran Paper Tray yang Tepat untuk Bisnismu
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
              src="/artikel_cup_A.webp"
              alt="cara memilih ukuran paper tray yang tepat"
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
              Salah satu kesalahan yang paling sering terjadi saat pelaku usaha kuliner pertama kali pesan paper tray adalah <strong>salah pilih ukuran</strong>. Kalau kekecilan, makanan jadi terlihat sempit atau bahkan tumpah saat dibawa. Kalau kegedean, kamu jadi boros material dan ongkos kirim, sementara tampilan produk malah terlihat kosong dan kurang menarik.
            </p>
            <p style={paragraphStyle}>
              Supaya tidak salah pilih, artikel ini membahas satu per satu <strong>4 varian ukuran paper tray Cup</strong> yang tersedia di Paperlisens — lengkap dengan detail dimensi asli, rekomendasi penggunaan, dan pilihan corak desain untuk masing-masing ukuran.
            </p>

            {/* --- Section: Mengenal 4 Varian --- */}
            <h2 style={sectionHeadingStyle}>Mengenal 4 Varian Ukuran Paper Tray Cup</h2>

            {/* Cup Cards */}
            {cupCards.map((cup, index) => (
              <div key={index} style={{
                backgroundColor: cup.bgColor,
                border: `1px solid ${cup.borderColor}`,
                borderRadius: '24px',
                padding: isLargeMobile ? '24px 20px' : '32px',
                marginTop: index === 0 ? '24px' : '32px',
                marginBottom: '32px',
              }}>
                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{
                    backgroundColor: cup.numberBg,
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <div>
                    <h3 style={{
                      fontSize: isLargeMobile ? '1.35rem' : '1.75rem',
                      fontWeight: '700',
                      fontFamily: FONT_HEADING,
                      color: '#001D39',
                      margin: 0,
                      lineHeight: '1.3'
                    }}>
                      {cup.name} — {cup.subtitle}
                    </h3>
                  </div>
                </div>

                {/* Product Image */}
                <div style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)',
                }}>
                  <Image
                    src={cup.image}
                    alt={cup.altText}
                    fill
                    sizes="(max-width: 900px) 100vw, 836px"
                    style={{ objectFit: 'contain', padding: '8px' }}
                  />
                </div>

                {/* Specs */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isSmallMobile ? '1fr' : '1fr 1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px',
                }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '14px 16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Ukuran Atas</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#001D39' }}>{cup.ukuranAtas}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '14px 16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Ukuran Bawah</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#001D39' }}>{cup.ukuranBawah}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '14px 16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Tinggi</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#001D39' }}>{cup.tinggi}</div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ margin: 0, lineHeight: '1.85', marginBottom: '12px' }}>
                  {cup.description}
                </p>
                <p style={{ margin: 0, lineHeight: '1.85', color: '#475569', fontStyle: 'italic' as const }}>
                  {cup.corakDesc}
                </p>
              </div>
            ))}

            {/* --- Comparison Table --- */}
            <h2 style={sectionHeadingStyle}>Perbandingan Cepat: Cup A vs B vs C vs D</h2>
            <div style={{ overflowX: 'auto', marginBottom: '32px', WebkitOverflowScrolling: 'touch' as const }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', minWidth: '500px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0A4174', color: '#ffffff' }}>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left', fontFamily: FONT_HEADING }}>Varian</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left', fontFamily: FONT_HEADING }}>Ukuran Atas</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left', fontFamily: FONT_HEADING }}>Tinggi</th>
                    <th style={{ padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left', fontFamily: FONT_HEADING }}>Cocok Untuk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}>Cup A</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>13,5 x 6 cm</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>3,5 cm</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Kentang goreng, camilan kecil</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}>Cup B</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>15 x 7 cm</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>3 cm</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Sosis bakar, camilan 1-2 orang</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}>Cup C</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>19 x 9 cm</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>4 cm</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Fried chicken, salad, dessert box</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }}>Cup D</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>26 x 11 cm</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>4 cm</td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Nasi + lauk, menu sharing besar</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* --- Section: Cara Mengukur --- */}
            <h2 style={sectionHeadingStyle}>Cara Mengukur Produk Sebelum Menentukan Ukuran</h2>
            <p style={paragraphStyle}>
              Supaya tidak salah pilih, ikuti langkah sederhana berikut sebelum memesan paper tray dalam jumlah besar:
            </p>

            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginBottom: '32px',
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                {[
                  'Ukur produk dalam kondisi siap saji (sudah termasuk topping, saus, atau garnish), bukan cuma bahan mentahnya.',
                  'Sisakan ruang sekitar 1-2 cm di sisi tray, supaya makanan tidak terlihat penuh sesak atau berisiko tumpah saat dibawa.',
                  'Kalau produkmu dijual dalam beberapa varian porsi (misalnya reguler dan jumbo), pertimbangkan pakai 2 ukuran tray berbeda daripada memaksakan satu ukuran untuk semua.',
                  'Kalau masih ragu, minta sample tray dari supplier sebelum order dalam jumlah besar — ini langkah kecil yang bisa menghindarkanmu dari kerugian pesan ulang.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Icon icon="mdi:check-circle" style={{ color: '#16a34a', fontSize: '20px', marginTop: '3px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- Section: Kesalahan Umum --- */}
            <h2 style={sectionHeadingStyle}>Kesalahan Umum Saat Memilih Ukuran Paper Tray</h2>

            <div style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginBottom: '32px',
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                {[
                  'Hanya melihat harga per pcs tanpa mempertimbangkan volume produk — tray yang lebih murah tapi kekecilan justru bisa bikin makanan tumpah dan komplain pelanggan naik.',
                  'Memesan satu ukuran untuk semua jenis produk, padahal beda produk butuh beda ukuran tray agar tampilannya tetap rapi dan proporsional.',
                  'Tidak memperhitungkan kemasan tambahan (misalnya sealer plastik atau tutup) yang bisa mengubah kebutuhan ruang di dalam tray.',
                  'Baru sadar ukuran salah setelah pesan dalam jumlah besar — padahal ini bisa dihindari dengan minta sample terlebih dahulu.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Icon icon="mdi:alert-circle" style={{ color: '#e11d48', fontSize: '20px', marginTop: '3px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- Kesimpulan --- */}
            <h2 style={sectionHeadingStyle}>Kesimpulan</h2>
            <p style={paragraphStyle}>
              Memilih ukuran paper tray yang tepat bukan cuma soal estetika, tapi juga berpengaruh langsung ke efisiensi biaya dan kenyamanan pelanggan. Dengan mengenali karakteristik 4 varian Cup A-D di atas dan mengikuti tips pengukuran sederhana, kamu bisa menghindari kesalahan yang sering dialami pelaku usaha lain saat pertama kali pesan kemasan custom.
            </p>
            <p style={paragraphStyle}>
              Masih bingung menentukan ukuran atau corak yang paling pas untuk produkmu? Tim Paperlisens siap bantu konsultasi gratis —{' '}
              <Link href="/paperlisens" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
                lihat pilihan paper tray Cup A-D di sini
              </Link>, atau{' '}
              <a href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20mau%20tanya%20soal%20ukuran%20paper%20tray%20Paperlisens" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
                tanya langsung lewat WhatsApp
              </a>.
            </p>

            {/* --- Internal Link Box --- */}
            <div style={{
              backgroundColor: '#e0f2fe',
              borderLeft: '6px solid #0284c7',
              borderRadius: '16px',
              padding: isLargeMobile ? '24px 20px' : '32px',
              marginBottom: '32px',
            }}>
              <p style={{ margin: 0, color: '#0369a1', lineHeight: '1.7' }}>
                <strong>💡 Artikel terkait:</strong> Kalau kamu sedang mempertimbangkan beralih ke paper tray dari kemasan konvensional, baca juga{' '}
                <Link href="/articles/upgrade-kemasan-paper-tray" style={{ color: '#0A4174', fontWeight: '600', textDecoration: 'underline' }}>
                  Saatnya Upgrade Kemasan: 5 Alasan Beralih ke Paper Tray
                </Link>{' '}
                untuk memahami kenapa semakin banyak pelaku usaha memilih kemasan ini.
              </p>
            </div>

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
                FAQ Seputar Ukuran Paper Tray
              </h2>

              <FAQItem
                question="Ukuran paper tray apa yang paling laris digunakan UMKM kuliner?"
                answer="Cup B dan Cup C umumnya paling banyak dipilih karena cocok untuk porsi camilan hingga menu utama ringan, sesuai dengan mayoritas produk UMKM kuliner rumahan."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Apakah bisa pesan sample sebelum order dalam jumlah besar?"
                answer="Bisa. Sebelum memutuskan ukuran akhir, kamu bisa konsultasi dan meminta sample ke tim Paperlisens agar sesuai dengan produkmu."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Apakah paper tray Cup A-D bisa dicetak custom logo?"
                answer="Bisa. Semua varian ukuran bisa dicetak dengan desain dan logo custom sesuai kebutuhan branding bisnismu, di luar pilihan corak siap pakai yang sudah tersedia."
                isLargeMobile={isLargeMobile}
              />
              <FAQItem
                question="Bagaimana kalau produk saya tidak pas dengan salah satu dari 4 ukuran ini?"
                answer="Kamu bisa konsultasikan langsung ke tim Paperlisens untuk opsi ukuran custom di luar varian standar Cup A-D."
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
                Sudah Tahu Ukuran yang Tepat?
              </h2>
              <p style={{
                marginBottom: '28px',
                opacity: 0.85,
                fontSize: isLargeMobile ? '0.95rem' : '1.05rem',
                maxWidth: '600px',
                margin: '0 auto 28px',
                fontFamily: FONT_BODY,
              }}>
                Pesan paper tray Cup A-D langsung dari Paperlisens, atau konsultasikan kebutuhan kemasan custom bisnismu — gratis, tanpa komitmen!
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
                <a
                  href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20mau%20pesan%20paper%20tray%20Paperlisens"
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
