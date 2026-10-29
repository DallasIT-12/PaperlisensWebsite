'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import { Icon } from '@iconify/react';

// Dynamically import heavy components
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });
const PromoBanner = dynamic(() => import('@/components/page/home/PromoBanner'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/page/home/PricingSection'), { ssr: false });
const TrustedMarquee = dynamic(() => import('@/components/page/home/TrustedMarquee'), { ssr: false });
const WhyChooseUs = dynamic(() => import('@/components/page/home/WhyChooseUs'), { ssr: false });
const FeaturedProducts = dynamic(() => import('@/components/page/home/FeaturedProducts'), { ssr: false });
const MaterialsSection = dynamic(() => import('@/components/page/home/MaterialsSection'), { ssr: false });
const NonCigaretteSection = dynamic(() => import('@/components/page/home/NonCigaretteSection'), { ssr: false });
const GoogleMapEmbed = dynamic(() => import('@/components/common/GoogleMapEmbed'), { ssr: false });

export default function Home() {
  const t = useTranslations();
  const [showPromo, setShowPromo] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // Show scroll indicator if idle for 10 seconds anywhere on the page
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleInteraction = () => {
      setShowScrollIndicator(false); // Hide instantly
      clearTimeout(scrollTimer);
      
      // Don't show if we are near the very bottom of the page
      const scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight
      );
      const isNearBottom = window.innerHeight + window.scrollY >= scrollHeight - 200;
      
      if (!isNearBottom) {
        scrollTimer = setTimeout(() => {
          // Double check bottom position before showing
          const currentScrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight
          );
          if (window.innerHeight + window.scrollY < currentScrollHeight - 200) {
            setShowScrollIndicator(true);
          }
        }, 10000);
      }
    };

    // Initial timeout when page loads
    scrollTimer = setTimeout(() => {
      setShowScrollIndicator(true);
    }, 10000);

    // Bind to multiple events for guaranteed capture
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('wheel', handleInteraction, { passive: true });
    window.addEventListener('touchmove', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchmove', handleInteraction);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Smart promo: IntersectionObserver to trigger when scrolled down 20-30%
  useEffect(() => {
    const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
    const lastDismissed = localStorage.getItem('promo_dismissed_at');

    // Skip if dismissed within cooldown period
    if (lastDismissed && Date.now() - Number(lastDismissed) < COOLDOWN_MS) {
      return;
    }

    const timer = setTimeout(() => {
      // Find an element that is roughly 30% down the page. 
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShowPromo(true);
            observer.disconnect();
          }
        },
        { rootMargin: '0px', threshold: 0.1 }
      );

      const target = document.querySelector('#pricing-section') || document.querySelector('section:nth-of-type(3)');
      if (target) {
        observer.observe(target);
      } else {
        setTimeout(() => setShowPromo(true), 5000);
      }

      return () => observer.disconnect();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClosePromo = () => {
    setShowPromo(false);
    localStorage.setItem('promo_dismissed_at', String(Date.now()));
  };

  return (
    <div style={{
      backgroundColor: '#001D39',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }}>
      <PromoBanner isOpen={showPromo} onClose={handleClosePromo} />

      {/* Hidden H1 for SEO */}
      <h1 style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0'
      }}>
        {t('Home.mainH1')}
      </h1>

      <Navbar />

      {/* Premium Quality Section with Video Background - LOADED IMMEDIATELY */}
      <section className="relative flex items-center justify-center text-center overflow-hidden text-white mt-[88px] h-[100vw] md:h-[calc(100vh-88px)]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/about_us.webp"
          className="absolute top-0 left-0 w-full h-full object-cover z-[1]"
        >
          <source src="/vidio.webm" type="video/webm" />
        </video>

        {/* Overlay to ensure text readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-[2]"></div>

        <div className="relative z-[3] px-6">
          <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] font-light mb-4 md:mb-6 leading-tight text-white">
            {t('PremiumQuality.title')}<br />
            <span className="font-semibold text-white">
              {t('PremiumQuality.titleSpan')}
            </span>
          </h2>
          <p className="text-[1rem] md:text-[1.25rem] lg:text-[1.5rem] text-gray-200 font-light max-w-[600px] mx-auto mb-8 md:mb-12">
            {t('PremiumQuality.description')}
          </p>
          <div className="flex gap-3 justify-center flex-wrap flex-col sm:flex-row items-center">
            <a href="/KATALOG DALLAS.pdf"
              download="KATALOG DALLAS.pdf"
              className="bg-white text-black py-2.5 px-6 md:py-3 md:px-8 text-[14px] md:text-[16px] w-full sm:w-auto max-w-[280px] sm:max-w-none rounded-[30px] font-medium transition-transform hover:scale-105 hover:bg-gray-100 active:scale-95 inline-block"
            >
              {t('PremiumQuality.btnDownload')}
            </a>
            <a href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20ingin%20tanya%20produk%20percetakan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white border border-white py-2.5 px-6 md:py-3 md:px-8 text-[14px] md:text-[16px] w-full sm:w-auto max-w-[280px] sm:max-w-none rounded-[30px] font-medium flex items-center justify-center gap-2 transition-transform hover:scale-105 hover:bg-white hover:text-black active:scale-95"
            >
              <Icon icon="mdi:whatsapp" className="text-[20px]" />
              {t('Paperlisens.orderWa')}
            </a>
          </div>
        </div>
      </section>

      {/* --- LAZY LOADED COMPONENTS MAPPED OVER ORIGINAL UI SEQUENCE --- */}

      {/* Price Promotion Section */}
      <PricingSection />

      {/* Trusted By Section (Marquee) */}
      <TrustedMarquee />

      {/* Why Choose Dallas Section */}
      <WhyChooseUs />

      {/* Classic Product Card Grid Section */}
      <FeaturedProducts />

      {/* Restored Materials Section */}
      <MaterialsSection />

      {/* Non-Cigarette Products Section */}
      <NonCigaretteSection />

      {/* Location Map Section */}
      <GoogleMapEmbed backgroundColor="#001D39" />

      {/* Footer */}
      <Footer />

      {/* Global Scroll Down Indicator (Non-Interactive) */}
      <div 
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[99] animate-bounce flex flex-col items-center transition-all duration-700 ease-in-out pointer-events-none ${showScrollIndicator ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{
          backgroundColor: 'rgba(0, 29, 57, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '12px 24px',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        }}
      >
        <span className="text-white text-[10px] md:text-xs font-semibold tracking-[0.2em] mb-1">SCROLL</span>
        <Icon icon="mdi:chevron-down" className="text-white text-[24px] md:text-[28px]" />
      </div>
    </div>
  );
}