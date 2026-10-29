'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useCart } from '@/context/CartContext';
import UserMenu from '@/components/auth/UserMenu';

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'beranda' | 'keunggulan' | 'kategori' | 'custom' | 'faq'>('beranda');
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  // Scroll Spy to track active section dynamically
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // 120px offset for sticky navbar

      if (window.scrollY < 250) {
        setActiveSection('beranda');
        return;
      }

      const sections: ('keunggulan' | 'kategori' | 'custom' | 'faq')[] = [
        'faq',
        'custom',
        'kategori',
        'keunggulan',
      ];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top - 80) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Handler for Beranda click
  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('beranda');
      setMobileMenuOpen(false);
    }
  };

  // Handler for Anchor section clicks
  const handleSectionClick = (e: React.MouseEvent, sectionId: 'keunggulan' | 'kategori' | 'custom' | 'faq') => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 80; // Navbar height
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth',
        });
        setActiveSection(sectionId);
        setMobileMenuOpen(false);
      }
    }
  };

  const navItemClass = (section: 'beranda' | 'keunggulan' | 'kategori' | 'custom' | 'faq') => {
    const isActive = activeSection === section;
    return `text-sm transition-all duration-200 cursor-pointer py-1 border-b-2 ${
      isActive
        ? 'text-orange-600 font-black border-orange-600'
        : 'text-neutral-700 hover:text-orange-600 font-semibold border-transparent hover:border-neutral-300'
    }`;
  };

  return (
    <>
      {/* Top Announcement Bar - Putih Bersih dengan font hitam & aksen oranye */}
      <div className="bg-white text-neutral-600 text-xs py-2 px-4 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-neutral-800">
              <Icon icon="solar:verified-check-bold" className="text-orange-600 text-sm" />
              Produsen Kemasan Food Grade Terpercaya Langsung dari Pabrik
            </span>
            <span className="hidden md:inline-block text-neutral-300">|</span>
            <a 
              href="https://wa.me/6281260001487" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden sm:flex items-center gap-1 text-neutral-600 hover:text-orange-600 font-medium transition-colors"
            >
              <Icon icon="ri:whatsapp-fill" className="text-green-600 text-sm" />
              <span>0812-6000-1487</span>
            </a>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-neutral-500 hidden lg:inline">Ikuti Kami:</span>
            <a href="https://www.instagram.com/paperlisens22" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-orange-600 transition-colors" aria-label="Instagram">
              <Icon icon="ri:instagram-fill" className="text-base" />
            </a>
            <a href="https://www.tiktok.com/@paperlisenss22" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-orange-600 transition-colors" aria-label="TikTok">
              <Icon icon="ri:tiktok-fill" className="text-base" />
            </a>
            <a href="https://id.shp.ee/tpQ9dbH" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-orange-600 transition-colors" aria-label="Shopee">
              <Icon icon="ri:shopping-bag-3-fill" className="text-base" />
            </a>
            <a href="https://www.facebook.com/share/1G3GADNMZi/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-orange-600 transition-colors" aria-label="Facebook">
              <Icon icon="ri:facebook-fill" className="text-base" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header - Background Putih Murni (#ffffff), Elemen Hitam & Aksen Oranye */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" onClick={handleHomeClick} className="flex items-center gap-3 group">
              <img 
                src="/logo-paperlisens.png" 
                alt="Paperlisens Logo" 
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-wider text-black">
                  PAPER<span className="text-orange-600">LISENS</span>
                </span>
                <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-bold">
                  Food Packaging Expert
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm">
              <Link 
                href="/" 
                onClick={handleHomeClick} 
                className={navItemClass('beranda')}
              >
                Beranda
              </Link>
              <a 
                href="#keunggulan" 
                onClick={(e) => handleSectionClick(e, 'keunggulan')} 
                className={navItemClass('keunggulan')}
              >
                Keunggulan
              </a>
              <a 
                href="#kategori" 
                onClick={(e) => handleSectionClick(e, 'kategori')} 
                className={navItemClass('kategori')}
              >
                Kategori
              </a>
              <a 
                href="#custom" 
                onClick={(e) => handleSectionClick(e, 'custom')} 
                className={navItemClass('custom')}
              >
                Custom Sablon
              </a>
              <a 
                href="#faq" 
                onClick={(e) => handleSectionClick(e, 'faq')} 
                className={navItemClass('faq')}
              >
                FAQ
              </a>
            </nav>

            {/* Right Buttons: Cart, User, & Single Primary Shop CTA */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 hover:text-orange-600 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
                aria-label="Keranjang Belanja"
                title="Buka Keranjang Belanja"
              >
                <Icon icon="solar:cart-large-minimalistic-bold" className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account Menu */}
              <div className="hidden sm:block">
                <UserMenu />
              </div>

              {/* Single Primary Action Button: Katalog Toko (500+ Item) */}
              <Link
                href="/produk"
                className="hidden md:inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Icon icon="solar:bag-5-bold" className="text-lg" />
                <span>Katalog Toko</span>
                <span className="bg-black/20 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  500+ Item
                </span>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 hover:text-orange-600 focus:outline-none"
                aria-label="Buka Menu"
              >
                <Icon icon={mobileMenuOpen ? "solar:close-circle-bold" : "solar:hamburger-menu-linear"} className="text-2xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu - Putih Bersih */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <Link 
              href="/" 
              onClick={handleHomeClick}
              className={`block py-2 text-base font-bold border-b border-neutral-100 ${
                activeSection === 'beranda' ? 'text-orange-600' : 'text-neutral-800'
              }`}
            >
              Beranda
            </Link>
            <a 
              href="#keunggulan" 
              onClick={(e) => handleSectionClick(e, 'keunggulan')}
              className={`block py-2 text-base font-semibold border-b border-neutral-100 ${
                activeSection === 'keunggulan' ? 'text-orange-600' : 'text-neutral-700'
              }`}
            >
              Keunggulan Food Grade
            </a>
            <a 
              href="#kategori" 
              onClick={(e) => handleSectionClick(e, 'kategori')}
              className={`block py-2 text-base font-semibold border-b border-neutral-100 ${
                activeSection === 'kategori' ? 'text-orange-600' : 'text-neutral-700'
              }`}
            >
              Kategori Kemasan
            </a>
            <a 
              href="#custom" 
              onClick={(e) => handleSectionClick(e, 'custom')}
              className={`block py-2 text-base font-semibold border-b border-neutral-100 ${
                activeSection === 'custom' ? 'text-orange-600' : 'text-neutral-700'
              }`}
            >
              Custom Sablon Brand
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleSectionClick(e, 'faq')}
              className={`block py-2 text-base font-semibold border-b border-neutral-100 ${
                activeSection === 'faq' ? 'text-orange-600' : 'text-neutral-700'
              }`}
            >
              Tanya Jawab (FAQ)
            </a>
            
            <div className="pt-3 space-y-2">
              <div className="sm:hidden pb-1">
                <UserMenu />
              </div>
              <Link
                href="/produk"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 rounded-xl shadow-md"
              >
                <Icon icon="solar:bag-5-bold" className="text-xl" />
                <span>Buka Katalog Toko (500+ Item)</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
