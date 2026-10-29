'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ArticlesListPage() {
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



  const articles = [
    {
      title: 'Cara Memilih Ukuran Paper Tray yang Tepat untuk Bisnismu',
      slug: 'cara-memilih-ukuran-paper-tray',
      excerpt: 'Bingung pilih ukuran paper tray untuk usahamu? Kenali detail ukuran Cup A, B, C, dan D dari Paperlisens beserta rekomendasi penggunaannya.',
      date: '22 Agustus 2026',
      image: '/artikel_cup_A.webp',
      category: 'Panduan Kemasan'
    },
    {
      title: 'Rumah Kemasan UMKM Kediri: Apa Itu dan Cara Memanfaatkannya',
      slug: 'rumah-kemasan-umkm-kediri',
      excerpt: 'Pemkab Kediri siapkan Rumah Kemasan untuk UMKM. Simak apa itu program ini, siapa yang bisa mengaksesnya, dan cara memanfaatkannya.',
      date: '22 Agustus 2026',
      image: '/paperlisens papertray.webp',
      category: 'UMKM Kediri'
    },
    {
      title: 'Saatnya Upgrade Kemasan: 5 Alasan Harus Beralih ke Paper Tray',
      slug: 'upgrade-kemasan-paper-tray',
      excerpt: 'Ingin tampilan produk lebih premium dan ramah lingkungan? Simak 5 alasan kenapa bisnismu perlu beralih ke paper tray sekarang.',
      date: '21 Agustus 2026',
      image: '/paperlisens papertray.webp',
      category: 'Kemasan'
    },
    {
      title: 'Jasa Cetak Kotak Rokok, Map Perusahaan, dan Buku: Solusi Cetak Offset Presisi',
      slug: 'jasa-cetak-kotak-rokok-map-buku-instansi',
      excerpt: 'Panduan B2B untuk industri dan instansi: Vendor kemasan rokok custom, map rekam medis anti air, hingga buku tahunan sekolah dengan kapasitas produksi skala besar.',
      date: '25 Februari 2026',
      image: '/foto mesin.webp',
      category: 'Solusi B2B & Instansi'
    },
    {
      title: 'Panduan Memilih Paper Tray dan Box Nasi: Praktis, Anti Bocor & Food Grade',
      slug: 'panduan-memilih-paper-tray-box-nasi',
      excerpt: 'Apa perbedaan utama Paper Tray dan Box Nasi? Temukan panduan spesifikasi cetak kemasan fungsional tahan minyak untuk bisnis kuliner Anda.',
      date: '25 Februari 2026',
      image: '/paperlisens papertray.webp',
      category: 'Panduan Bisnis Kuliner'
    },
    {
      title: 'Cara Memilih Box Hampers dan Box Bakery yang Menarik | Panduan Tren 2026',
      slug: 'cara-memilih-box-hampers-bakery',
      excerpt: 'Ketahui biaya cetak box hampers custom, material terbaik, dan tren desain jendela mika untuk meningkatkan nilai jual produk Anda hingga 3x lipat.',
      date: '24 Februari 2026',
      image: '/cetak-box-hampers-lebaran-kediri.webp',
      category: 'SEO Tips Kemasan'
    },
    {
      title: 'Panduan Lengkap Cetak Kemasan & Atribut Bisnis: Dari Box Makanan hingga Kotak Rokok',
      slug: 'panduan-lengkap-cetak-kemasan',
      excerpt: 'Membangun brand yang kuat dengan packaging strategis. Panduan produk cetak untuk memajukan bisnis Anda dari ritel hingga kebutuhan korporat.',
      date: '24 Februari 2026',
      image: '/artikel (1).webp',
      category: 'Panduan Lengkap'
    },
    {
      title: 'Kemasan Kertas vs Plastik: Kenapa Brand Besar Mulai Beralih ke Paper-Based Packaging?',
      slug: 'kemasan-ramah-lingkungan',
      excerpt: 'Memahami urgensi penggunaan kemasan ramah lingkungan untuk meningkatkan reputasi brand dan menjaga ekosistem bumi.',
      date: '6 Februari 2026',
      image: '/artikel (1) (2).webp',
      category: 'Keberlanjutan'
    },
    {
      title: '7 Ide Bisnis Tren 2026: Strategi Melejitkan Brand dengan Sentuhan Packaging Profesional',
      slug: 'ide-bisnis-tren-2026',
      excerpt: 'Simak peluang usaha paling menjanjikan di tahun ini dan bagaimana Percetakan Dallas Kediri membantu Anda menguasai pasar melalui kemasan premium.',
      date: '6 Februari 2026',
      image: '/artikel (2).webp',
      category: 'Ide Bisnis'
    },
    {
      title: 'Kenapa Bisnis Besar Selalu Memilih Offset Printing? Ini Alasannya!',
      slug: 'offset-vs-digital',
      excerpt: 'Mengungkap keunggulan mutlak teknologi cetak offset dalam menghasilkan kualitas premium dengan efisiensi biaya produksi maksimal.',
      date: '6 Februari 2026',
      image: '/artikel (3).webp',
      category: 'Edukasi'
    },
    {
      title: 'Panduan Teknis Material: Memahami Karakteristik Kertas Ivory dalam Manufaktur Packaging',
      slug: 'kertas-ivory',
      excerpt: 'Analisis komprehensif mengenai penggunaan kertas ivory untuk cetak kemasan premium, mulai dari gramasi hingga teknik finishing.',
      date: '5 Februari 2026',
      image: '/artikel (1).webp',
      category: 'Material'
    }
  ];



  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b', overflowX: 'hidden', fontFamily: "var(--font-source-sans), 'Source Sans 3', sans-serif" }}>
      <Navbar />

      {/* Hero Header - Consistent with About, Career, and FAQ pages */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          paddingTop: isLargeMobile ? '180px' : '220px',
          paddingBottom: isLargeMobile ? '100px' : '140px',
          backgroundImage: 'linear-gradient(rgba(0, 29, 57, 0.7), rgba(0, 29, 57, 0.7)), url("/about_us.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isLargeMobile ? '350px' : '480px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontSize: isSmallMobile ? '1.85rem' : (isMediumMobile ? '2.25rem' : '4.5rem'),
            fontWeight: '800',
            fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
            lineHeight: '1.2',
            padding: '0 20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          {t('Navbar.articles')}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            color: '#BDD8E9',
            marginTop: '24px',
            fontSize: isSmallMobile ? '1rem' : '1.25rem',
            padding: '0 20px',
            maxWidth: '800px',
            textShadow: '0 1px 5px rgba(0,0,0,0.2)'
          }}
        >
          Wawasan Industri Percetakan & Pengemasan Premium
        </motion.p>
      </motion.header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: isLargeMobile ? '40px 16px 80px' : '80px 24px 120px' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isLargeMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: isLargeMobile ? '20px' : '32px'
        }}>
          {articles.map((article, idx) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
              <motion.div
                whileHover={!isLargeMobile ? { y: -10 } : {}}
                style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', cursor: 'pointer', width: '100%' }}
              >
                <div style={{ height: isSmallMobile ? '180px' : '220px', overflow: 'hidden', position: 'relative' }}>
                  <Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, 350px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: isLargeMobile ? '20px' : '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#0A4174', color: '#ffffff', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase' }}>{article.category}</span>
                  </div>
                  <h2 style={{ fontSize: isLargeMobile ? '1.15rem' : '1.5rem', fontWeight: '700', fontFamily: "var(--font-poppins), 'Poppins', sans-serif", marginBottom: '12px', lineHeight: '1.3', color: '#001D39' }}>{article.title}</h2>
                  <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '24px', fontSize: isLargeMobile ? '0.9rem' : '1rem', flex: 1 }}>{article.excerpt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{article.date}</span>
                    <span style={{ color: '#0A4174', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                      Baca Selengkapnya <Icon icon="mdi:arrow-right" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main >

      <Footer />
    </div >
  );
}