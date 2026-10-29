'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Icon } from '@iconify/react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';

const GoogleMapEmbed = dynamic(() => import('@/components/common/GoogleMapEmbed'), { ssr: false });
import { useTranslations } from 'next-intl';

// --- Banner Slider Component ---
const BannerSlider = ({ images, interval = 10000, transitionType = 'fade' }: { images: string[], interval?: number, transitionType?: 'fade' | 'slide' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    resetTimer();
    timerRef.current = setTimeout(() => {
      goToNextSlide();
    }, interval);

    return () => {
      resetTimer();
    };
  }, [currentIndex, images.length, interval]);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % images.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Banner ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 80vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            opacity: currentIndex === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        />
      ))}
      <button onClick={goToPrevSlide} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10 }}>&#10094;</button>
      <button onClick={goToNextSlide} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10 }}>&#10095;</button>
    </div>
  );
};

export default function AboutPage() {
  const t = useTranslations();
  const tCat = useTranslations('Categories');
  const tFeatured = useTranslations('FeaturedProducts');
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isMediumMobile, setIsMediumMobile] = useState(false);
  const [isLargeMobile, setIsLargeMobile] = useState(false);

  const machineImages = [
    '/foto mesin.webp',
    '/foto mesin (1).webp',
    '/foto mesin (2).webp',
    '/foto mesin (3).webp',
    '/foto mesin (4).webp',
    '/foto mesin (5).webp',
    '/foto mesin (6).webp',
    '/foto mesin (7).webp'
  ];

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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    },
    viewport: { once: true }
  };

  // --- Premium Animated Background Blobs ---
  // --- Premium Portfolio Card with 3D Tilt & Shine ---
  const PremiumPortfolioCard = ({ children, category, delay, href, image }: { children: React.ReactNode, category: string, delay: number, href: string, image: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <Link href={href} style={{ textDecoration: 'none', perspective: '1000px' }}>
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            position: 'relative'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay
          }}
        >
          {/* Shine Effect */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              background: useTransform(
                [shineX, shineY],
                ([sx, sy]) => `radial-gradient(circle at ${sx} ${sy}, rgba(255,255,255,0.15) 0%, transparent 60%)`
              ),
              borderRadius: '32px',
              pointerEvents: 'none'
            }}
          />

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '32px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
            height: '100%',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative',
            overflow: 'hidden',
            transform: 'translateZ(50px)',
            transformStyle: 'preserve-3d'
          }}>
            {/* Background Image */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              transform: 'translateZ(-10px)'
            }}>
              <Image
                src={image}
                alt={category || 'Portfolio'}
                fill
                style={{ objectFit: 'cover', opacity: 0.6 }}
              />
              {/* Dark Gradient Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)'
              }} />
            </div>

            {/* Internal Glow Decorator */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
            }} />

            {category && (
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#D4A017',
                marginBottom: '20px',
                opacity: 0.8,
                transform: 'translateZ(20px)'
              }}>
                {category}
              </div>
            )}

            <div style={{ transform: 'translateZ(40px)' }}>
              {children}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  const BackgroundDecoration = () => (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none' }}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(10, 65, 116, 0.08) 0%, rgba(10, 65, 116, 0) 70%)',
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -120, 0],
          y: [0, -80, 0],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0) 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
        }}
      />
    </div>
  );

  // --- Reusable Motion Card Component ---
  const MotionCard = ({ children, style = {}, delay = 0, hoverEffect = true, category }: { children: React.ReactNode, style?: React.CSSProperties, delay?: number, hoverEffect?: boolean, category?: string }) => {
    const isDark = style.backgroundColor === '#0A4174';

    return (
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay
        }}
        whileHover={hoverEffect ? {
          y: -12,
          scale: 1.02,
          boxShadow: isDark
            ? '0 40px 80px -20px rgba(0, 0, 0, 0.5)'
            : '0 30px 60px -15px rgba(0, 0, 0, 0.12)',
          transition: { type: "spring", stiffness: 400, damping: 25 }
        } : {}}
        whileTap={hoverEffect ? { scale: 0.97 } : {}}
        style={{
          backgroundColor: isDark ? '#0A4174' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: isDark ? 'none' : 'blur(20px)',
          WebkitBackdropFilter: isDark ? 'none' : 'blur(20px)',
          borderRadius: '40px',
          padding: '48px',
          boxShadow: isDark
            ? '0 20px 40px -10px rgba(10, 65, 116, 0.3)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: hoverEffect ? 'pointer' : 'default',
          zIndex: 1,
          ...style
        }}
      >
        {/* Glossy Overlay for Light Cards */}
        {!isDark && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
            pointerEvents: 'none',
            zIndex: -1
          }} />
        )}

        {category && (
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: isDark ? 'rgba(255,255,255,0.6)' : '#0A4174',
            marginBottom: '16px',
            display: 'block'
          }}>
            {category}
          </span>
        )}
        {children}
      </motion.div>
    );
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1f2937', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif' }}>

      <Navbar />

      {/* Hero Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          paddingTop: isLargeMobile ? '180px' : '220px',
          paddingBottom: isLargeMobile ? '100px' : '140px',
          backgroundImage: 'linear-gradient(rgba(0, 29, 57, 0.65), rgba(0, 29, 57, 0.65)), url("/about_us.webp")',
          backgroundSize: 'cover',
          backgroundPosition: isLargeMobile ? 'center 20%' : 'center',
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
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
        />
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontSize: isSmallMobile ? '1.85rem' : (isMediumMobile ? '2.25rem' : '4.5rem'),
            fontWeight: '700',
            lineHeight: '1.2',
            padding: '0 20px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          {t('Navbar.about')}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            color: '#BDD8E9',
            marginTop: '20px',
            fontSize: isSmallMobile ? '1rem' : '1.25rem',
            padding: '0 20px',
            maxWidth: '800px',
            textShadow: '0 1px 5px rgba(0,0,0,0.2)'
          }}
        >
          Percetakan Offset Dallas Kediri
        </motion.p>
      </motion.header>

      {/* 1. Mengenali Kami Section */}
      <section style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff' }}>
        <BackgroundDecoration />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{
              fontSize: isMediumMobile ? '2.5rem' : '4.5rem',
              fontWeight: '900',
              marginBottom: '40px',
              color: '#0f172a',
              letterSpacing: '-0.04em',
              lineHeight: '1.05'
            }}
          >
            {t('CompanyProfile.title')}
          </motion.h2>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: '120px', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: '8px',
              backgroundColor: '#f97316',
              margin: '0 auto 64px',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.7 }}
            style={{
              fontSize: isMediumMobile ? '1.2rem' : '1.5rem',
              lineHeight: '1.7',
              color: '#475569',
              textAlign: 'center',
              fontWeight: '450',
              letterSpacing: '-0.01em'
            }}
          >
            {t('CompanyProfile.description')}
          </motion.p>
        </div>
      </section>

      {/* 2. Visi & Misi Section */}
      <section id="visi-misi" style={{ padding: '140px 24px', backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden', scrollMarginTop: '120px' }}>
        <BackgroundDecoration />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isLargeMobile ? '1fr' : '1fr 1fr',
            gap: '40px',
            alignItems: 'stretch'
          }}>
            {/* Vision Card */}
            <MotionCard delay={0.1} category="Vision Statement">
              <h3 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px', color: '#0A4174', letterSpacing: '-0.05em', lineHeight: '1' }}>
                {t('AboutUs.visi.title')}
              </h3>
              <p style={{ fontSize: '1.4rem', lineHeight: '1.5', color: '#475569', fontWeight: '500', letterSpacing: '-0.02em' }}>
                {t('AboutUs.visi.desc')}
              </p>
            </MotionCard>

            {/* Mission Card */}
            <MotionCard
              delay={0.3}
              category="Our Mission"
              style={{
                backgroundColor: '#0A4174',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 30px 60px -15px rgba(10, 65, 116, 0.4)'
              }}
            >
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                {t('AboutUs.misi.title')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {([0, 1, 2, 3, 4] as const).map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: 0.6 + (index * 0.12)
                    }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}
                  >
                    <div style={{
                      marginTop: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#f97316',
                      flexShrink: 0,
                      boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)'
                    }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: '450', opacity: 0.9, lineHeight: '1.4' }}>
                      {t(`AboutUs.misi.points.${index}`)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </MotionCard>
          </div>
        </div>
      </section>

      {/* 3. Produk Kami Section */}
      <section id="portofolio" style={{ padding: '140px 24px', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden', scrollMarginTop: '120px' }}>
        <BackgroundDecoration />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontSize: isMediumMobile ? '2.5rem' : '4.5rem', fontWeight: '900', marginBottom: '32px', color: '#0f172a', letterSpacing: '-0.04em', lineHeight: '1' }}>
              {t('AboutUs.produk.title')}
            </h2>
            <p style={{ fontSize: '1.5rem', color: '#64748b', maxWidth: '850px', margin: '0 auto', lineHeight: '1.5', fontWeight: '450' }}>
              {t('AboutUs.produk.desc')}
            </p>
          </motion.div>

          {/* PPT Presentation Slideshow */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.2 }}
            style={{ marginBottom: '100px' }}
          >
            {(() => {
              const totalSlides = 16;
              const slideImages = Array.from({ length: totalSlides }, (_, i) => `/ppt-slides/slide_${i + 1}.jpg`);

              const [currentPptSlide, setCurrentPptSlide] = useState(0);

              const goToPrevPptSlide = () => {
                setCurrentPptSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
              };

              const goToNextPptSlide = () => {
                setCurrentPptSlide((prev) => (prev + 1) % totalSlides);
              };

              return (
                <div style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  background: '#0f172a',
                }}>
                  {/* Header Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMediumMobile ? '14px 16px' : '16px 32px',
                    background: 'linear-gradient(135deg, #0A4174 0%, #0d5a9e 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon icon="solar:presentation-graph-bold-duotone" style={{ fontSize: isMediumMobile ? '22px' : '26px', color: '#f97316' }} />
                      <span style={{
                        color: '#ffffff',
                        fontSize: isMediumMobile ? '0.9rem' : '1.1rem',
                        fontWeight: '700',
                        letterSpacing: '-0.01em'
                      }}>
                        Portofolio Produk
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Slide Counter */}
                      <span style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}>
                        {currentPptSlide + 1} / {totalSlides}
                      </span>
                      <a
                        href="/portofolio_produk.pdf"
                        download
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: isMediumMobile ? '7px 12px' : '8px 20px',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontSize: isMediumMobile ? '0.75rem' : '0.85rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(249, 115, 22, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                        }}
                      >
                        <Icon icon="solar:download-minimalistic-bold" style={{ fontSize: '16px' }} />
                        {!isSmallMobile && 'Download'}
                      </a>
                    </div>
                  </div>

                  {/* Slide Area */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    backgroundColor: '#0f172a',
                    overflow: 'hidden',
                  }}>
                    {slideImages.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Portofolio Slide ${index + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          opacity: currentPptSlide === index ? 1 : 0,
                          transition: 'opacity 0.5s ease-in-out',
                          pointerEvents: currentPptSlide === index ? 'auto' : 'none',
                        }}
                      />
                    ))}

                    {/* Navigation Arrows */}
                    <button
                      onClick={goToPrevPptSlide}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: isMediumMobile ? '8px' : '16px',
                        transform: 'translateY(-50%)',
                        width: isMediumMobile ? '36px' : '48px',
                        height: isMediumMobile ? '36px' : '48px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMediumMobile ? '18px' : '22px',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.7)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'; }}
                    >
                      &#10094;
                    </button>
                    <button
                      onClick={goToNextPptSlide}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: isMediumMobile ? '8px' : '16px',
                        transform: 'translateY(-50%)',
                        width: isMediumMobile ? '36px' : '48px',
                        height: isMediumMobile ? '36px' : '48px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMediumMobile ? '18px' : '22px',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.7)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'; }}
                    >
                      &#10095;
                    </button>
                  </div>

                  {/* Dot Indicators */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '14px 16px',
                    background: 'linear-gradient(135deg, #0A4174 0%, #0d5a9e 100%)',
                    flexWrap: 'wrap',
                  }}>
                    {slideImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPptSlide(index)}
                        style={{
                          width: currentPptSlide === index ? '24px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: currentPptSlide === index ? '#f97316' : 'rgba(255,255,255,0.25)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          padding: 0,
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMediumMobile ? '1fr' : isLargeMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {/* Detailed Portfolio Grid */}
            {[
              { slug: 'rokok', category: 'Industry Specialty', title: tCat('rokok.title'), desc: tCat('rokok.desc'), image: '/foto_rokok_1.webp', delay: 0.1 },
              { slug: 'kotak-hampers', category: 'Gift & Heritage', title: tCat('hampers.title'), desc: tCat('hampers.desc'), image: '/kotak%20hampers.webp', delay: 0.2 },
              { slug: 'kotak-bakery', category: 'Food & Culinary', title: tCat('bakery.title'), desc: tCat('bakery.desc'), image: '/foto_bakery_1.webp', delay: 0.3 },
              { slug: 'kotak-nasi', category: 'Catering Solutions', title: tCat('nasi.title'), desc: tCat('nasi.desc'), image: '/foto_ricebox.webp', delay: 0.4 },
              { slug: 'paperbag', category: 'Retail & Branding', title: tCat('paperbag.title'), desc: tCat('paperbag.desc'), image: '/paperbag.webp', delay: 0.5 },
              { slug: 'brosur', category: 'Marketing Media', title: tCat('brosur.title'), desc: tCat('brosur.desc'), image: '/foto%20brosur.webp', delay: 0.6 },
              { slug: 'buku', category: 'Publication & Print', title: tCat('buku.title'), desc: tCat('buku.desc'), image: '/foto_buku.webp', delay: 0.7 },
              { slug: 'kalender', category: 'Corporate Gifts', title: tCat('kalender.title'), desc: tCat('kalender.desc'), image: '/foto_kalender.webp', delay: 0.8 },
              { slug: 'map', category: 'Office Essentials', title: tCat('map.title'), desc: tCat('map.desc'), image: '/map.webp', delay: 0.9 }
            ].map((item) => (
              <PremiumPortfolioCard key={item.slug} href={`/produk/${item.slug}`} category={item.category} image={item.image} delay={item.delay}>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '900',
                  marginBottom: '16px',
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.2',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: '1.6',
                  fontSize: '1.05rem',
                  fontWeight: '450'
                }}>
                  {item.desc}
                </p>
              </PremiumPortfolioCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Modern Technology Section */}
      <section style={{
        padding: isMediumMobile ? '120px 24px' : '180px 24px',
        backgroundColor: '#0A4174',
        color: '#ffffff',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Advanced Parallax Overlay */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '60px 60px',
            zIndex: 0
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isLargeMobile ? '1fr' : '1fr 1fr',
          gap: isLargeMobile ? '80px' : '120px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            style={{ order: isLargeMobile ? 2 : 1 }}
          >
            <h2 style={{
              fontSize: isMediumMobile ? '3rem' : '5rem',
              fontWeight: '900',
              marginBottom: '40px',
              lineHeight: '0.95',
              letterSpacing: '-0.05em'
            }}>
              {t('AboutUs.title')}
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '120px' }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ height: '10px', backgroundColor: '#f97316', marginBottom: '48px', borderRadius: '5px' }}
            />
            <p style={{
              fontSize: isMediumMobile ? '1.25rem' : '1.6rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: '1.6',
              fontWeight: '400',
              letterSpacing: '-0.01em'
            }}>
              {t('AboutUs.description')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              order: isLargeMobile ? 1 : 2,
              height: isSmallMobile ? '350px' : (isLargeMobile ? '450px' : '550px'),
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
              border: '4px solid rgba(255,255,255,0.1)'
            }}
          >
            <BannerSlider images={machineImages} interval={4000} />
          </motion.div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section style={{ padding: '160px 24px', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <BackgroundDecoration />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ textAlign: 'center', marginBottom: '120px' }}
          >
            <h2 style={{ fontSize: isMediumMobile ? '3rem' : '5.5rem', fontWeight: '900', marginBottom: '32px', color: '#0f172a', letterSpacing: '-0.05em', lineHeight: '1' }}>
              {t('WhyChoose.title')}
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '160px' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: '12px', width: '160px', backgroundColor: '#0A4174', margin: '0 auto', borderRadius: '6px' }}
            />
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmallMobile ? '1fr' : (isMediumMobile ? '1fr 1fr' : 'repeat(4, 1fr)'),
            gap: '32px'
          }}>
            {[
              { icon: "solar:ranking-bold-duotone", title: t('WhyChoose.points.experience.title'), desc: t('WhyChoose.points.experience.desc'), color: '#f97316', category: 'Heritage' },
              { icon: "solar:medal-star-bold-duotone", title: t('WhyChoose.points.quality.title'), desc: t('WhyChoose.points.quality.desc'), color: '#0A4174', category: 'Standard' },
              { icon: "solar:chat-round-line-bold-duotone", title: t('WhyChoose.points.consultation.title'), desc: t('WhyChoose.points.consultation.desc'), color: '#f97316', category: 'Support' },
              { icon: "solar:alarm-bold-duotone", title: t('WhyChoose.points.punctuality.title'), desc: t('WhyChoose.points.punctuality.desc'), color: '#0A4174', category: 'Efficiency' }
            ].map((item, i) => (
              <MotionCard
                key={i}
                delay={i * 0.1}
                category={item.category}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '32px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  backgroundColor: `${item.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <Icon icon={item.icon} style={{ fontSize: '32px', color: item.color }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '12px', color: '#0f172a', lineHeight: '1.2' }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.5' }}>{item.desc}</p>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      <GoogleMapEmbed backgroundColor="#ffffff" />
      <Footer />
    </div>
  );
}