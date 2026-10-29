'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { getDallasCategories } from '@/data/categories';
import RelatedProducts from '@/components/ui/RelatedProducts';

// Framer Motion variants
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const galleryItem = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.5, ease: smoothEase }
  }
};

const heroSlide = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: smoothEase } }
};

const heroSlideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: smoothEase, delay: 0.15 } }
};

export default function ProductCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const t = useTranslations();
  const tCat = useTranslations('Categories');
  const tMaterials = useTranslations('Materials');
  const tCommon = useTranslations('Common');

  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isMediumMobile, setIsMediumMobile] = useState(false);
  const [isLargeMobile, setIsLargeMobile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);


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

  // Reset zoom when image changes or closes
  useEffect(() => {
    setZoomLevel(1);
  }, [selectedImage]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  //Construct categories dynamically from translations
  const dallasCategories = useMemo(() => getDallasCategories(tCat, tMaterials), [tCat, tMaterials]);

  const category = dallasCategories.find(cat => cat.slug === slug);

  if (!category) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
        <main style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <div style={{ textAlign: 'center', color: '#1f2937' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>{tCommon('categoryNotFound')}</h1>
            <p style={{ marginTop: '0.5rem', color: '#64748b' }}>{tCommon('categoryNotFoundDesc')}</p>
            <Link href="/" style={{ marginTop: '2rem', display: 'inline-block', color: '#0A4174', fontWeight: '600' }}>Kembali ke Home</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b', overflowX: 'hidden' }}>
      <Navbar />

      {/* Main Content */}
      <main style={{ padding: isLargeMobile ? '2rem 1.5rem' : '4rem 2rem', maxWidth: '1200px', margin: '120px auto 0' }}>

        {/* Breadcrumb / Back button style */}
        <div style={{ marginBottom: '32px' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0A4174', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '1rem' }}>
            <Icon icon="mdi:arrow-left" />
            {tCommon('back')}
          </button>
        </div>

        {category.isMaterial ? (
          <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr' : '1fr 1fr', gap: isLargeMobile ? '2rem' : '4rem', alignItems: 'start', marginBottom: '4rem' }}>
            <motion.div variants={heroSlide} initial="hidden" animate="visible" style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'
              }}>
                <Image
                  src={category.img}
                  alt={`${category.title} - Produk Percetakan Dallas Kediri`}
                  width={600}
                  height={600}
                  style={{ borderRadius: '24px', width: '100%', height: 'auto', display: 'block' }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '120px',
                  background: 'linear-gradient(to top, rgba(0,29,57,0.7), transparent)',
                  borderRadius: '0 0 24px 24px',
                  pointerEvents: 'none'
                }} />
                {/* Material badge */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'linear-gradient(135deg, #D4A017, #B8860B)',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: '24px',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 15px rgba(212, 160, 23, 0.4)'
                }}>
                  Informasi Bahan
                </div>
              </div>
            </motion.div>

            <motion.div variants={heroSlideRight} initial="hidden" animate="visible">
              <h2 style={{ fontSize: isLargeMobile ? '2rem' : '2.75rem', fontWeight: '800', color: '#001D39', marginBottom: '8px', lineHeight: '1.1' }}>
                {category.title}
              </h2>
              <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #D4A017, #B8860B)', borderRadius: '2px', marginBottom: '24px' }} />
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#4b5563', marginBottom: '32px' }}>
                {category.explanation}
              </p>

              {/* Applications */}
              <div style={{
                background: 'linear-gradient(145deg, #001D39 0%, #0a2744 100%)',
                padding: '28px',
                borderRadius: '20px',
                border: '1px solid rgba(212, 160, 23, 0.2)',
                marginBottom: '20px'
              }}>
                <h3 style={{ fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#D4A017', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  <Icon icon="mdi:tools" /> Bisa Dibuat Apa Saja?
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {category.applications?.map((app, i) => (
                    <span key={i} style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#e5e7eb',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>{app}</span>
                  ))}
                </div>
              </div>

              {/* Varieties */}
              <div style={{
                background: 'linear-gradient(145deg, #001D39 0%, #0a2744 100%)',
                padding: '28px',
                borderRadius: '20px',
                border: '1px solid rgba(212, 160, 23, 0.2)'
              }}>
                <h3 style={{ fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#D4A017', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  <Icon icon="mdi:layers-outline" /> Macam / Ketebalan
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {category.varieties?.map((v, i) => (
                    <span key={i} style={{
                      background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.15), rgba(184, 134, 11, 0.1))',
                      border: '1px solid rgba(212, 160, 23, 0.3)',
                      color: '#D4A017',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>{v}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div style={{ marginBottom: '4rem' }}>
            {/* Hero: Image + Title + Info layout, similar to material pages */}
            <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr' : '1fr 1fr', gap: isLargeMobile ? '2rem' : '4rem', alignItems: 'start' }}>
              <motion.div variants={heroSlide} initial="hidden" animate="visible" style={{ position: 'relative' }}>
                <div style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'
                }}>
                  <Image
                    src={category.img}
                    alt={`${category.title} - Produk Percetakan Dallas Kediri`}
                    width={600}
                    height={600}
                    style={{ borderRadius: '24px', width: '100%', height: 'auto', display: 'block' }}
                  />
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '120px',
                    background: 'linear-gradient(to top, rgba(0,29,57,0.7), transparent)',
                    borderRadius: '0 0 24px 24px',
                    pointerEvents: 'none'
                  }} />
                  {/* Product badge */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'linear-gradient(135deg, #0A4174, #001D39)',
                    color: '#fff',
                    padding: '8px 18px',
                    borderRadius: '24px',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 15px rgba(10, 65, 116, 0.4)'
                  }}>
                    Produk Kami
                  </div>
                </div>
              </motion.div>

              <motion.div variants={heroSlideRight} initial="hidden" animate="visible">
                <h2 style={{ fontSize: isLargeMobile ? '2rem' : '2.75rem', fontWeight: '800', color: '#001D39', marginBottom: '8px', lineHeight: '1.1' }}>
                  {category.title}
                </h2>
                <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #D4A017, #B8860B)', borderRadius: '2px', marginBottom: '16px' }} />

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {category.tags?.map((tag: string) => (
                    <span key={tag} style={{
                      backgroundColor: 'rgba(10, 65, 116, 0.08)',
                      border: '1px solid rgba(10, 65, 116, 0.15)',
                      color: '#0A4174',
                      fontSize: '0.8rem',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontWeight: '600'
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Explanation */}
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#4b5563', marginBottom: '32px' }}>
                  {category.explanation || category.desc}
                </p>

                {/* Applications / Kegunaan */}
                {category.applications && (
                  <div style={{
                    background: 'linear-gradient(145deg, #001D39 0%, #0a2744 100%)',
                    padding: '28px',
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 160, 23, 0.2)',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#D4A017', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      <Icon icon="mdi:lightbulb-on-outline" /> Kegunaan Umum
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {category.applications.map((app: string, i: number) => (
                        <span key={i} style={{
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: '#e5e7eb',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>{app}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {category.commonMaterials && (
                  <div style={{
                    background: 'linear-gradient(145deg, #001D39 0%, #0a2744 100%)',
                    padding: '28px',
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 160, 23, 0.2)'
                  }}>
                    <h3 style={{ fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#D4A017', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      <Icon icon="mdi:layers-outline" /> Material yang Biasa Digunakan
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {category.commonMaterials.map((m: string, i: number) => (
                        <span key={i} style={{
                          background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.15), rgba(184, 134, 11, 0.1))',
                          border: '1px solid rgba(212, 160, 23, 0.3)',
                          color: '#D4A017',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>{m}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* Video Showcase Section (for categories with video) */}
        {category.video && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: smoothEase }}
            style={{
              marginBottom: '4rem',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '4rem'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#D4A017' }}>VIDEO</span>
                <span style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#001D39' }}>
                Contoh Penggunaan Box
              </h2>
            </div>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                  border: '2px solid rgba(212, 160, 23, 0.2)',
                  background: '#000'
                }}
              >
                <video
                  muted
                  loop
                  playsInline
                  controls
                  style={{
                    width: '100%',
                    display: 'block',
                    borderRadius: '18px'
                  }}
                >
                  <source src={category.video} type="video/webm" />
                  Browser Anda tidak mendukung pemutaran video.
                </video>
                {/* Decorative corner accents */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', width: '24px', height: '24px', borderTop: '2px solid #D4A017', borderLeft: '2px solid #D4A017', borderRadius: '4px 0 0 0', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderTop: '2px solid #D4A017', borderRight: '2px solid #D4A017', borderRadius: '0 4px 0 0', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '24px', height: '24px', borderBottom: '2px solid #D4A017', borderLeft: '2px solid #D4A017', borderRadius: '0 0 0 4px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '24px', height: '24px', borderBottom: '2px solid #D4A017', borderRight: '2px solid #D4A017', borderRadius: '0 0 4px 0', pointerEvents: 'none' }} />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Gallery Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          style={{ borderTop: '1px solid #e5e7eb', paddingTop: '4rem' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
              <motion.span initial={{ width: 0 }} whileInView={{ width: 30 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', color: '#D4A017' }}>GALLERY</span>
              <motion.span initial={{ width: 0 }} whileInView={{ width: 30 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ height: '1px', background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#001D39' }}>
              Contoh Penggunaan &amp; Gallery
            </h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: isLargeMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: isLargeMobile ? '12px' : '1.5rem'
            }}
          >
            {category.gallery.map((imageSrc, index) => (
              <motion.div
                key={index}
                variants={galleryItem}
                whileHover={{ scale: 1.04, boxShadow: '0 15px 40px rgba(0,0,0,0.18)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedImage(imageSrc)}
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.border = '2px solid rgba(212, 160, 23, 0.5)';
                  const overlay = e.currentTarget.querySelector('.gallery-overlay') as HTMLElement;
                  if (overlay) overlay.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.border = '2px solid transparent';
                  const overlay = e.currentTarget.querySelector('.gallery-overlay') as HTMLElement;
                  if (overlay) overlay.style.opacity = '0';
                }}
              >
                <Image
                  src={imageSrc}
                  alt={`${category.title} - Percetakan Dallas Kediri - Gallery ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                />
                {/* Hover overlay */}
                <div className="gallery-overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(0,29,57,0.6), rgba(212,160,23,0.15))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Icon icon="mdi:magnify-plus" style={{ fontSize: '36px', color: '#D4A017' }} />
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', letterSpacing: '1px' }}>LIHAT</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: '80px',
            textAlign: 'center',
            background: 'linear-gradient(145deg, #001D39 0%, #0a2744 50%, #001D39 100%)',
            padding: isLargeMobile ? '40px 24px' : '56px 40px',
            borderRadius: '32px',
            color: 'white',
            border: '1px solid rgba(212, 160, 23, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated decorative glow */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(10, 65, 116, 0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#D4A017' }}>KONSULTASI GRATIS</span>
            <span style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
          </div>
          <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '700', marginBottom: '16px', position: 'relative' }}>Tertarik Menggunakan Bahan Ini?</h2>
          <p style={{ marginBottom: '32px', opacity: 0.7, maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.7' }}>Dapatkan penawaran harga terbaik dan konsultasi gratis mengenai kebutuhan cetak Anda langsung dengan tim ahli kami.</p>
          <motion.a
            href="https://wa.me/6281260001487"
            whileHover={{ scale: 1.06, boxShadow: '0 8px 35px rgba(37, 211, 102, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: 'white',
              padding: '16px 40px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.35)',
              position: 'relative'
            }}
          >
            <Icon icon="mdi:whatsapp" fontSize="24" /> Hubungi Kami Sekarang
          </motion.a>
        </motion.div>

        {/* Related Products Section */}
        <RelatedProducts currentSlug={category.slug} categories={dallasCategories} />
      </main>

      {/* Image Zoom Modal */}
      {/* Image Zoom Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              zIndex: 100,
              overflow: 'auto',
              display: 'flex',
              alignItems: zoomLevel > 1 ? 'flex-start' : 'center',
              justifyContent: zoomLevel > 1 ? 'flex-start' : 'center',
            }}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.15, background: 'rgba(255, 255, 255, 0.35)' }}
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 110,
                color: 'white',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Icon icon="mdi:close" style={{ fontSize: '24px' }} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(prev => prev === 1 ? 2.5 : 1);
              }}
              style={{
                position: 'relative',
                minWidth: zoomLevel > 1 ? '250vw' : 'auto',
                minHeight: zoomLevel > 1 ? '250vh' : 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in',
                padding: '20px'
              }}
            >
              <img
                src={selectedImage}
                alt="Zoomed View"
                style={{
                  maxWidth: zoomLevel > 1 ? 'none' : '100vw',
                  maxHeight: zoomLevel > 1 ? 'none' : '100vh',
                  width: zoomLevel > 1 ? 'auto' : '100%',
                  height: zoomLevel > 1 ? 'auto' : '100%',
                  objectFit: 'contain',
                  userSelect: 'none',
                  transform: zoomLevel > 1 ? 'scale(1)' : 'none',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}