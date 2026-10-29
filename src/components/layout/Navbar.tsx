'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Icon } from '@iconify/react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Navbar() {
    const t = useTranslations();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    // Consider window width for desktop vs mobile sizing
    const [isLargeMobile, setIsLargeMobile] = useState(false);

    // We need to run client-side to get window size accurately. 
    // However, simpler approach is to rely entirely on Tailwind's responsive classes 
    // where possible instead of tracking window.innerWidth.
    // We'll update inline styles to Tailwind classes where we can.

    const smoothScroll = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const renderNavLinks = () => {
        const baseClasses = "py-4 md:py-0 text-center md:text-left border-b border-gray-200/50 md:border-none w-full md:w-auto font-medium transition-all duration-300 hover:text-black md:hover:-translate-y-[2px] cursor-pointer no-underline text-gray-600 relative group";

        // Use a wrapper with top padding (md:pt-4) to create an invisible hover "bridge" so the mouse doesn't fall off
        const dropdownWrapperClasses = "md:absolute md:top-full md:left-0 md:w-56 md:pt-4 flex flex-col md:hidden md:group-hover:flex z-50";
        const dropdownMenuClasses = "bg-gray-50/50 md:bg-white md:shadow-xl md:rounded-xl md:border md:border-gray-100 overflow-hidden flex flex-col transition-all duration-300";

        const dropdownItemClasses = "py-3 px-6 md:px-5 text-center md:text-left text-[0.95rem] text-gray-600 hover:bg-gray-50 hover:text-[#0A4174] border-b border-gray-100 last:border-none no-underline block";

        return (
            <>
                <Link prefetch={false} href="/" onClick={() => setIsMenuOpen(false)} className={baseClasses}>
                    {t('Navbar.home')}
                </Link>

                {/* Produk Dropdown */}
                <div className={baseClasses} onMouseEnter={() => setIsProductsOpen(true)} onMouseLeave={() => setIsProductsOpen(false)}>
                    <div
                        className="flex items-center justify-center md:justify-start gap-1 w-full"
                        onClick={() => setIsProductsOpen(!isProductsOpen)}
                    >
                        {t('Navbar.produk_menu') || 'Produk'}
                        <Icon icon="mdi:chevron-down" className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-180 md:rotate-0' : ''}`} />
                    </div>
                    <div className={`${dropdownWrapperClasses} ${isProductsOpen ? 'flex' : 'hidden'}`}>
                        <div className={dropdownMenuClasses}>
                            <Link prefetch={false} href="/produk/kotak-hampers" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.hampers.title') || 'Kotak Hampers'}
                            </Link>
                            <Link prefetch={false} href="/produk/rokok" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.rokok.title') || 'Kotak Rokok'}
                            </Link>
                            <Link prefetch={false} href="/produk/kotak-bakery" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.bakery.title') || 'Kotak Bakery'}
                            </Link>
                            <Link prefetch={false} href="/produk/kotak-nasi" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.nasi.title') || 'Kotak Nasi'}
                            </Link>
                            <Link prefetch={false} href="/produk/buku" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.buku.title') || 'Buku & Majalah'}
                            </Link>
                            <Link prefetch={false} href="/produk/kalender" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.kalender.title') || 'Kalender'}
                            </Link>
                            <Link prefetch={false} href="/produk/map" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.map.title') || 'Map Folder'}
                            </Link>
                            <Link prefetch={false} href="/produk/paperbag" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.paperbag.title') || 'Paperbag'}
                            </Link>
                            <Link prefetch={false} href="/produk/brosur" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Categories.brosur.title') || 'Brosur'}
                            </Link>
                            <a href="/KATALOG DALLAS.pdf" download="KATALOG DALLAS.pdf" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Navbar.catalog')}
                            </a>
                        </div>
                    </div>
                </div>

                <Link prefetch={false} href="/paperlisens" onClick={() => setIsMenuOpen(false)} className={baseClasses}>
                    {t('Navbar.paperlisens')}
                </Link>

                {/* The translation key for articles is Navbar.articles, wait let me check if zh.json has articles key */}
                {/* zh.json is missing 'articles' in Navbar block, let's just use string placeholder if null */}
                <Link prefetch={false} href="/articles" onClick={() => setIsMenuOpen(false)} className={baseClasses}>
                    {t('Navbar.articles') || 'Artikel'}
                </Link>

                {/* Perusahaan Dropdown */}
                <div className={baseClasses} onMouseEnter={() => setIsCompanyOpen(true)} onMouseLeave={() => setIsCompanyOpen(false)}>
                    <div
                        className="flex items-center justify-center md:justify-start gap-1 w-full"
                        onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                    >
                        {t('Navbar.perusahaan') || 'Perusahaan'}
                        <Icon icon="mdi:chevron-down" className={`transition-transform duration-300 ${isCompanyOpen ? 'rotate-180 md:rotate-0' : ''}`} />
                    </div>
                    <div className={`${dropdownWrapperClasses} ${isCompanyOpen ? 'flex' : 'hidden'}`}>
                        <div className={dropdownMenuClasses}>
                            <Link prefetch={false} href="/about" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Navbar.about')}
                            </Link>
                            <Link prefetch={false} href="/about#visi-misi" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                Visi & Misi
                            </Link>
                            <Link prefetch={false} href="/about#portofolio" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                Portofolio
                            </Link>
                            <Link prefetch={false} href="/karir" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Navbar.karir')}
                            </Link>
                            <Link prefetch={false} href="/faq" onClick={() => setIsMenuOpen(false)} className={dropdownItemClasses}>
                                {t('Navbar.faq') || 'FAQ'}
                            </Link>
                            <a
                                href="#contact"
                                onClick={(e) => {
                                    if (window.location.pathname === '/' || window.location.pathname === '/id' || window.location.pathname === '/en' || window.location.pathname === '/zh') {
                                        smoothScroll(e, '#contact');
                                    }
                                    setIsMenuOpen(false);
                                }}
                                className={dropdownItemClasses}
                            >
                                {t('Navbar.contact')}
                            </a>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            {/* Top Bar Contact Info & Social Media */}
            <div className="bg-white text-black text-xs py-2 md:py-1 fixed top-0 left-0 w-full z-[100] border-b border-gray-200">
                <div className="max-w-[1280px] mx-auto px-6 flex justify-center md:justify-between items-center flex-wrap md:flex-nowrap gap-2 md:gap-0">
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <span className="hidden md:flex items-center gap-1">
                            <Icon icon="mdi:map-marker" className="text-[14px]" />
                            {t('TopBar.address')}
                        </span>
                        <span className="flex items-center gap-1">
                            <Icon icon="mdi:phone" className="text-[14px]" />
                            <span className="inline md:hidden">081260001487</span>
                            <span className="hidden md:inline">081260001487 | 085946896488 | 085235531946</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="https://www.instagram.com/paperlisens22?igsh=bDl4OHI3d2d0eHV0" target="_blank" rel="noopener noreferrer" className="text-black" title="Instagram">
                            <Icon icon="mdi:instagram" className="text-[18px]" />
                        </a>
                        <a href="https://www.tiktok.com/@paperlisenss22" target="_blank" rel="noopener noreferrer" className="text-black" title="TikTok">
                            <Icon icon="ic:baseline-tiktok" className="text-[18px]" />
                        </a>
                        <a href="https://id.shp.ee/tpQ9dbH" target="_blank" rel="noopener noreferrer" className="text-black" title="Shopee Paperlisens">
                            <Icon icon="ic:baseline-shopping-bag" className="text-[18px]" />
                        </a>
                        <a href="https://id.shp.ee/ZqzSum7" target="_blank" rel="noopener noreferrer" className="text-black" title="Shopee Tray&me">
                            <Icon icon="ic:baseline-shopping-bag" className="text-[18px]" />
                        </a>
                        <a href="https://www.facebook.com/share/1G3GADNMZi/" target="_blank" rel="noopener noreferrer" className="text-black" title="Facebook">
                            <Icon icon="mdi:facebook" className="text-[18px]" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-[36px] md:top-[30px] w-full z-50 bg-white/95 backdrop-blur-[20px] saturate-[180%] border-b border-gray-200/50">
                <div className="max-w-[1280px] mx-auto px-6 relative">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <Image src="/logo1.webp" alt="Percetakan Dallas" width={360} height={108} style={{ height: '36px', width: 'auto', filter: 'invert(1)' }} priority />
                        </Link>

                        <button aria-label="Toggle mobile menu" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden bg-transparent border-none text-black text-2xl">
                            <Icon icon={isMenuOpen ? "mdi:close" : "mdi:menu"} />
                        </button>
                        <div className="hidden md:flex gap-8 items-center">
                            {renderNavLinks()}
                            <LanguageSwitcher />
                        </div>
                    </div>

                    {isMenuOpen && (
                        <div className="md:hidden absolute top-[100%] left-0 right-0 bg-white flex flex-col items-center px-6 pb-4 border-b border-gray-200/50 shadow-md">
                            {renderNavLinks()}
                            <div className="mt-4 pt-4 border-t border-gray-200/50 w-full flex justify-center">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}
