'use client';

import { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { useTranslations, useLocale } from 'next-intl';
import Footer from '@/components/layout/Footer';
import { getSmartTranslation } from '@/utils/productTranslations';
import VariantSelector from './VariantSelector';
import PaperlisensFloatingCart from '@/components/paperlisens/PaperlisensFloatingCart';
import UserMenu from '@/components/auth/UserMenu';

// --- Constants & Helpers ---

// --- Responsive Styles ---
const Styles = memo(function Styles() {
  return (
    <style>{`
    .gallery-container { display: flex; flex-direction: column; gap: 16px; }
    .thumbnail-list { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; justify-content: center; }
    .thumbnail-list::-webkit-scrollbar { display: none; }
    .thumbnail { width: 80px; height: 80px; border: 1px solid #e5e5e5; border-radius: 8px; cursor: pointer; object-fit: cover; flex-shrink: 0; transition: all 0.2s; }
    .thumbnail.active { border-color: #ea580c; border-width: 2px; }
    .main-image { width: 100%; height: 450px; object-fit: contain; border-radius: 12px; border: 1px solid #e5e5e5; background-color: #fafafa; display: block; margin: 0 auto; }
    .tab-nav { display: flex; border-bottom: 1px solid #e5e5e5; margin-bottom: 24px; overflow-x: auto; }
    .tab-item { padding: 12px 24px; cursor: pointer; color: #737373; border-bottom: 2px solid transparent; white-space: nowrap; font-weight: 600; font-size: 14px; transition: all 0.2s; }
    .tab-item.active { color: #ea580c; border-bottom-color: #ea580c; font-weight: 800; }
    
    /* Interactive Recommendation Product Card */
    .slider-product-card {
      position: relative;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      display: flex;
      flex-direction: column;
      width: 220px;
      flex-shrink: 0;
    }
    .slider-product-card:hover {
      box-shadow: 0 16px 36px -8px rgba(234, 88, 12, 0.2);
      transform: translateY(-4px);
      border-color: #ea580c;
    }
    .slider-card-image-wrapper {
      position: relative;
      width: 100%;
      height: 190px;
      background-color: #f9f9f9;
      overflow: hidden;
    }
    .slider-card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .slider-product-card:hover .slider-card-image {
      transform: scale(1.08);
    }
    .slider-card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, transparent 100%);
      opacity: 0;
      transition: opacity 0.35s ease;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 12px;
      text-align: center;
      z-index: 10;
    }
    .slider-product-card:hover .slider-card-overlay {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .header-cart-btn { display: none !important; }
      .main-image { height: 300px; }
      .back-text-full { display: none; }
      .back-text-short { display: inline !important; }
      .header-container { gap: 12px !important; padding: 0 12px !important; }
      .header-logo { height: 32px !important; }
      .search-input { font-size: 12px !important; padding: 8px 12px !important; }
      
      .slider-product-card {
        width: 165px !important;
      }
      .slider-card-image-wrapper {
        height: 155px !important;
      }
      .slider-card-overlay {
        display: none !important;
      }
      .mobile-bottom-bar {
        display: flex !important;
      }
      .main-content {
        padding-bottom: calc(92px + env(safe-area-inset-bottom, 0px)) !important;
      }

      /* Mobile Gallery Styles */
      .desktop-gallery { display: none; }
      .mobile-gallery {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        gap: 0 !important;
        padding-bottom: 8px;
        scrollbar-width: none;
      }
      .mobile-gallery::-webkit-scrollbar { display: none; }
      .mobile-gallery-item {
        min-width: 100%;
        width: 100%;
        flex-shrink: 0;
        scroll-snap-align: center;
        border-radius: 12px;
        border: 1px solid #e5e5e5;
        background-color: #ffffff;
        height: min(85vw, 360px);
        overflow: hidden;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .mobile-gallery-img { width: 100%; height: 100%; object-fit: contain; display: block; margin: 0 auto; }
    }
    @media (min-width: 769px) {
      .mobile-gallery { display: none; }
    }
  `}</style>
  );
});

// --- Product Card Component with Interactive Glow & Quick Actions ---
const ProductCard = memo(({ product }: { product: any }) => {
  const pt = useTranslations('Paperlisens');
  const locale = useLocale();
  const router = useRouter();
  const { addToCart } = useCart();

  const getLocalized = (item: any, field: string) => {
    // @ts-ignore
    const specificTranslation = item[`${field}_${locale}`];
    if (specificTranslation) return specificTranslation;

    const originalValue = item[field];
    if (!originalValue || typeof originalValue !== 'string') return originalValue;
    return originalValue;
  };

  const productName = getLocalized(product, 'name');
  const discountPercent = 10;
  const markupPrice = Math.ceil(product.price / 0.9);

  return (
    <div 
      className="slider-product-card" 
      onClick={() => router.push(`/product/${encodeURIComponent(product.productSlug)}`)} 
      style={{ cursor: 'pointer' }}
    >
      <div className="slider-card-image-wrapper">
        {product.image && !product.image.includes('placeholder') ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="slider-card-image" 
            loading="lazy" 
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4d4d4' }}>
            <Icon icon="solar:gallery-remove-linear" style={{ fontSize: '44px', color: '#a3a3a3' }} />
          </div>
        )}
        <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#ea580c', padding: '4px 8px', fontSize: '11px', color: '#ffffff', fontWeight: 'bold', borderBottomLeftRadius: '8px', zIndex: 2 }}>
          {discountPercent}% OFF
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="slider-card-overlay">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault(); 
              addToCart(product, 1); 
            }} 
            style={{ 
              backgroundColor: '#ea580c', 
              color: '#ffffff', 
              border: 'none', 
              padding: '9px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              width: '100%', 
              marginBottom: '6px', 
              fontSize: '11px', 
              fontWeight: '700',
              letterSpacing: '0.3px',
              boxShadow: '0 4px 12px rgba(234,88,12,0.3)',
              transition: 'background 0.2s'
            }}
          >
            {pt('addToCart')}
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault(); 
              addToCart(product, 1, undefined, true); 
              router.push('/checkout'); 
            }} 
            style={{ 
              backgroundColor: '#000000', 
              color: '#ffffff', 
              border: '1px solid #ea580c', 
              padding: '9px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              width: '100%', 
              fontSize: '11px', 
              fontWeight: '700' 
            }}
          >
            {pt('orderNow')}
          </button>
        </div>
      </div>

      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '6px' }}>
          <div style={{ fontSize: '10px', color: '#ea580c', border: '1px solid #ea580c', backgroundColor: '#fff7ed', display: 'inline-block', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            {product.category || 'Paperlisens'}
          </div>
        </div>
        <h4 style={{ fontSize: '13px', color: '#000000', marginBottom: '8px', lineHeight: '1.35', height: '36px', overflow: 'hidden', fontWeight: '600', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {productName}
        </h4>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '10px', textDecoration: 'line-through', color: '#a3a3a3' }}>Rp {markupPrice.toLocaleString('id-ID')}</span>
            <div style={{ fontSize: '10px', color: '#737373', display: 'flex', alignItems: 'center' }}>
              <Icon icon="solar:star-bold" style={{ color: '#f59e0b', fontSize: '12px', marginRight: '2px' }} />
              {product.sold} {pt('sold')}
            </div>
          </div>
          <div style={{ color: '#ea580c', fontWeight: '900', fontSize: '15px' }}>
            Rp {product.price.toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
});

const ProductSlider = memo(({ title, products }: { title: string, products: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  useEffect(() => {
    const checkScrollable = () => { if (scrollRef.current) setIsScrollable(scrollRef.current.scrollWidth > scrollRef.current.clientWidth); };
    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [products]);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  return (
    <div style={{ marginBottom: '40px', position: 'relative' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#000000', marginBottom: '16px', borderLeft: '4px solid #ea580c', paddingLeft: '12px' }}>{title}</h3>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {isScrollable && (
          <>
            <button onClick={() => scroll('left')} style={{ position: 'absolute', left: '-15px', zIndex: 10, background: 'white', border: '1px solid #e5e5e5', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#171717' }} aria-label="Sebelumnya"><Icon icon="solar:alt-arrow-left-linear" fontSize="22px" /></button>
            <button onClick={() => scroll('right')} style={{ position: 'absolute', right: '-15px', zIndex: 10, background: 'white', border: '1px solid #e5e5e5', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#171717' }} aria-label="Berikutnya"><Icon icon="solar:alt-arrow-right-linear" fontSize="22px" /></button>
          </>
        )}
        <div ref={scrollRef} className="no-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollBehavior: 'smooth', padding: '4px' }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
});

const DescriptionFormatter = ({ text }: { text: string }) => {
  if (!text) return null;
  return (
    <div style={{ lineHeight: '1.8', color: '#171717', fontSize: '15px' }}>
      {text.split('\n').map((line, index) => {
        const trimmed = line.trim();

        // Render Horizontal Line
        if (trimmed === '---') {
          return <hr key={index} style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '24px 0' }} />;
        }

        // Render Markdown Headers (###)
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={index} style={{
              fontSize: '18px',
              fontWeight: '800',
              marginTop: '28px',
              marginBottom: '16px',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ width: '4px', height: '18px', backgroundColor: '#ea580c', borderRadius: '2px' }}></span>
              {trimmed.replace('###', '').trim()}
            </h4>
          );
        }

        // Render Bullet Points
        if (trimmed.startsWith('•') || trimmed.startsWith('*') || (trimmed.startsWith('-') && !trimmed.startsWith('---'))) {
          return (
            <div key={index} style={{ display: 'flex', marginLeft: '12px', marginBottom: '10px' }}>
              <span style={{ marginRight: '10px', color: '#ea580c', fontWeight: 'bold' }}>•</span>
              <span style={{ flex: 1, color: '#404040' }}>{trimmed.replace(/^[•\-\*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
            </div>
          );
        }

        // Empty line for spacing
        if (!trimmed) {
          return <div key={index} style={{ height: '16px' }} />;
        }

        // Normal paragraph with bold support
        return (
          <p key={index} style={{ marginBottom: '12px', color: '#404040' }}>
            {trimmed.split('**').map((part, i) => (
              i % 2 === 1 ? <strong key={i} style={{ color: '#000000', fontWeight: '700' }}>{part}</strong> : part
            ))}
          </p>
        );
      })}
    </div>
  );
};

// --- Price Box: only re-renders when price/discount changes ---
const PriceBox = memo(({ price, originalPrice, discountPercent }: { price: number; originalPrice: number; discountPercent: number }) => (
  <div style={{ backgroundColor: '#fafafa', padding: '18px 20px', borderRadius: '12px', border: '1px solid #f0f0f0', marginBottom: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <span style={{ textDecoration: 'line-through', color: '#a3a3a3', fontSize: '14px' }}>Rp {originalPrice.toLocaleString('id-ID')}</span>
      <span style={{ backgroundColor: '#ea580c', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>{discountPercent}% OFF</span>
    </div>
    <div style={{ fontSize: '32px', fontWeight: '900', color: '#ea580c', letterSpacing: '-0.5px' }}>Rp {price.toLocaleString('id-ID')}</div>
  </div>
));

// --- Product Meta: name + ratings — NEVER re-renders on variant click ---
const ProductMeta = memo(({ name, rating, reviewCount, sold, pt }: any) => (
  <>
    <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', color: '#000000', lineHeight: '1.3' }}>{name}</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#000000' }}>
        <span style={{ fontWeight: '800', textDecoration: 'underline' }}>{rating}</span>
        <Icon icon="solar:star-bold" style={{ color: '#f59e0b', fontSize: '16px' }} />
      </div>
      <div style={{ height: '16px', width: '1px', backgroundColor: '#e5e5e5' }}></div>
      <div style={{ color: '#737373', fontWeight: '500' }}>{reviewCount} {pt('rating')}</div>
      <div style={{ height: '16px', width: '1px', backgroundColor: '#e5e5e5' }}></div>
      <div style={{ color: '#737373', fontWeight: '500' }}>{sold} {pt('sold')}</div>
    </div>
  </>
));

// --- Tabs Section: only re-renders when activeTab changes ---
const TabsSection = memo(({ pt, activeTab, setActiveTab, description, weight, slug, category }: any) => (
  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e5e5', marginBottom: '24px' }}>
    <div className="tab-nav">
      {['deskripsi', 'info', 'review', 'pengiriman'].map(tab => (
        <div key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{pt(tab)}</div>
      ))}
    </div>
    <div style={{ padding: '0 12px' }}>
      {activeTab === 'deskripsi' && <DescriptionFormatter text={description} />}
      {activeTab === 'info' && <div style={{ color: '#171717', lineHeight: '1.8' }}><p><strong>{pt('weight')}:</strong> {weight}</p><p><strong>{pt('category')}:</strong> {pt(`categories.${slug.replace(/-./g, (x: string) => x[1].toUpperCase())}` as any) || category}</p></div>}
      {activeTab === 'review' && <div style={{ color: '#171717', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon icon="solar:star-bold" style={{ color: '#f59e0b', fontSize: '18px' }} /> <strong>4.9</strong> ({pt('reviewsCount', { count: 128 })})</div>}
      {activeTab === 'pengiriman' && <div style={{ color: '#171717', lineHeight: '1.8' }}><p>{pt('shippingInfo.from')}</p></div>}
    </div>
  </div>
));

// --- Static Sections (memoized to prevent re-render on variant click) ---
const StaticTopBar = memo(({ pt, t }: { pt: any; t: any }) => (
  <div style={{ backgroundColor: '#ffffff', color: '#171717', fontSize: '12px', padding: '8px 0', borderBottom: '1px solid #e5e5e5' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ color: '#ea580c', textDecoration: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon icon="solar:arrow-left-linear" style={{ fontSize: '18px' }} />
          <span className="back-text-full">Beranda Paperlisens</span>
          <span className="back-text-short" style={{ display: 'none' }}>Beranda</span>
        </Link>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#737373', fontWeight: '500' }}>
          <Icon icon="solar:phone-bold" style={{ fontSize: '14px', color: '#ea580c' }} /> 081260001487
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a href="https://www.instagram.com/paperlisens22" target="_blank" rel="noopener noreferrer" style={{ color: '#171717', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} aria-label="Instagram">
          <Icon icon="ri:instagram-fill" style={{ fontSize: '18px' }} />
        </a>
        <a href="https://www.tiktok.com/@paperlisenss22" target="_blank" rel="noopener noreferrer" style={{ color: '#171717', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} aria-label="TikTok">
          <Icon icon="ri:tiktok-fill" style={{ fontSize: '18px' }} />
        </a>
        <a href="https://id.shp.ee/tpQ9dbH" target="_blank" rel="noopener noreferrer" style={{ color: '#171717', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} aria-label="Shopee">
          <Icon icon="ri:shopping-bag-3-fill" style={{ fontSize: '18px' }} />
        </a>
        <a href="https://www.facebook.com/share/1G3GADNMZi/" target="_blank" rel="noopener noreferrer" style={{ color: '#171717', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} aria-label="Facebook">
          <Icon icon="ri:facebook-fill" style={{ fontSize: '18px' }} />
        </a>
      </div>
    </div>
  </div>
));

const StaticHeader = memo(({ pt, searchQuery, setSearchQuery, handleSearch, cartCount, setIsCartOpen }: any) => (
  <header style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', padding: '16px 0', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #e5e5e5' }}>
    <div className="header-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '32px' }}>
      <Link href="/" style={{ flexShrink: 0 }}>
        <img src="/logo-paperlisens.png" alt="Paperlisens" className="header-logo" style={{ height: '42px', flexShrink: 0, width: 'auto' }} />
      </Link>
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={pt('searchPlaceholder')}
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ width: '100%', padding: '11px 16px', paddingRight: '52px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '14px', backgroundColor: '#f5f5f5', color: '#000000', outline: 'none' }}
          />
          <button type="submit" style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', width: '40px', backgroundColor: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Cari">
            <Icon icon="solar:minimalistic-magnifer-bold" style={{ fontSize: '20px', color: '#ffffff' }} />
          </button>
        </form>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="header-cart-btn"
          style={{
            position: 'relative',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e5e5e5',
            color: '#171717',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            borderRadius: '10px',
            marginRight: '4px',
            transition: 'all 0.2s'
          }}
          aria-label="Keranjang Belanja"
        >
          <Icon icon="solar:cart-large-minimalistic-bold" style={{ fontSize: '22px' }} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#ea580c',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '900',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffffff'
            }}>
              {cartCount}
            </span>
          )}
        </button>
        <UserMenu />
      </div>
    </div>
  </header>
));

export default function ProductDetailPage({ initialProduct, relatedProducts, otherProducts }: any) {
  const t = useTranslations();
  const pt = useTranslations('Paperlisens');
  const locale = useLocale();
  const router = useRouter();
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  const [activeTab, setActiveTab] = useState('deskripsi');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [hoveredVariant, setHoveredVariant] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  // Refs to hold current variant/quantity from child without re-rendering parent
  const selectedVariantRef = useRef<any>(null);
  const quantityRef = useRef(1);

  // Preload ALL variant images in background eagerly with high priority
  useEffect(() => {
    const variants: any[] = initialProduct.variants || [];
    const toPreload = new Set<string>();

    variants.forEach((v: any) => {
      if (v.image && !v.image.includes('placeholder') && v.image !== '/placeholder.png') {
        toPreload.add(v.image);
      }
    });

    toPreload.forEach((src) => {
      const img = new window.Image();
      img.decoding = 'async';
      img.src = src;
      // Also request via fetch if supported for aggressive browser disk/memory cache
      try {
        if ('fetch' in window) {
          fetch(src, { mode: 'no-cors', priority: 'high' } as any).catch(() => {});
        }
      } catch (e) {}
    });
  }, [initialProduct.variants]);

  const getLocalized = useCallback((item: any, field: string) => {
    // @ts-ignore
    const specificTranslation = item[`${field}_${locale}`];
    if (specificTranslation) return specificTranslation;
    return getSmartTranslation(item[field], locale);
  }, [locale]);

  const handleVariantChange = useCallback((variant: any | null) => {
    selectedVariantRef.current = variant;
    // Immediate synchronous update - zero input latency
    setSelectedVariant(variant);

    // Only switch main display if new variant has a valid unique image
    const hasValidImage = variant?.image && !variant.image.includes('placeholder') && variant.image !== '/placeholder.png';
    if (hasValidImage) {
      setSelectedImage(-1);
    }
  }, []);

  const handleQuantityChange = useCallback((qty: number) => {
    quantityRef.current = qty;
  }, []);

  const activeVisualVariant = hoveredVariant || selectedVariant;
  const displayProduct = activeVisualVariant || initialProduct;

  const productName = getLocalized(initialProduct, 'name');
  const productDescription = getLocalized(initialProduct, 'description');
  const discountPercent = 10;
  const markupPrice = useMemo(() => Math.ceil(displayProduct.price / 0.9), [displayProduct.price]);

  const productImages = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();
    const skip = (url: string) => !url || url === '/placeholder.png' || url.includes('placeholder');
    const add = (url: string) => {
      if (url && !skip(url) && !seen.has(url)) {
        list.push(url);
        seen.add(url);
      }
    };

    // Always use base product gallery only (no variant images mixed in)
    add(initialProduct.image);
    if (Array.isArray(initialProduct.images)) {
      initialProduct.images.forEach((img: string) => add(img));
    } else if (initialProduct.images && typeof initialProduct.images === 'string') {
      try {
        const parsed = JSON.parse(initialProduct.images);
        if (Array.isArray(parsed)) parsed.forEach((img: string) => add(img));
      } catch (e) { }
    }

    return list;
  }, [initialProduct]);

  // Mobile & Lightbox gallery logic: Includes variant preview if applicable
  const isPlaceholder = useCallback((url: string) => !url || url === '/placeholder.png' || url.includes('placeholder'), []);

  const fullGalleryImages = useMemo(() => {
    if (activeVisualVariant?.image && !isPlaceholder(activeVisualVariant.image) && !productImages.includes(activeVisualVariant.image)) {
      return [activeVisualVariant.image, ...productImages];
    }
    return productImages;
  }, [productImages, activeVisualVariant, isPlaceholder]);

  const mainDisplayImage = selectedImage === -1 && activeVisualVariant?.image && !isPlaceholder(activeVisualVariant.image)
    ? activeVisualVariant.image
    : (productImages[selectedImage] || productImages[0] || initialProduct.image || '/placeholder.png');

  // Ref always holds latest product data for cart — updating ref does NOT trigger re-render
  const cartProductRef = useRef<any>(null);
  cartProductRef.current = {
    ...initialProduct,
    ...displayProduct,
    id: initialProduct?.id || displayProduct?.id,
    productId: initialProduct?.id || displayProduct?.id,
    name: initialProduct.name,
    localizedName: productName,
    localizedDescription: productDescription,
    category: initialProduct.category,
    slug: initialProduct.slug,
    images: productImages,
    rating: 4.9,
    reviewCount: 128,
    price: displayProduct.price,
    originalPrice: displayProduct.price,
    stock: 150,
    weight: typeof initialProduct?.weight === 'number' ? initialProduct.weight : 200,
  };

  const getVariantName = useCallback((p: any) => {
    const localizedName = getLocalized(p, 'variant_name');
    if (localizedName && localizedName !== 'Standard') return localizedName;
    return getLocalized(p, 'variant') || 'Standard';
  }, [getLocalized]);

  // STABLE: no longer depends on product useMemo — VariantSelector won't re-render on variant change
  const handleAddToCart = useCallback((variant: any | null, qty: number) => {
    addToCart(cartProductRef.current, qty, variant);
  }, [addToCart]);

  // Pesan Sekarang langsung memasukkan ke keranjang dan membuka halaman Checkout
  const handleOrderNow = useCallback((variant: any | null, qty: number) => {
    const chosenVariant = variant || (initialProduct.variants && initialProduct.variants.length > 0 ? initialProduct.variants[0] : null);
    addToCart(cartProductRef.current, qty, chosenVariant, true);
    router.push('/checkout');
  }, [addToCart, router, initialProduct.variants]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produk?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, router]);

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Styles />

      <StaticTopBar pt={pt} t={t} />
      <StaticHeader pt={pt} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} cartCount={cartCount} setIsCartOpen={setIsCartOpen} />

      <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
        {/* BREADCRUMB */}
        <div style={{ fontSize: '13px', color: '#737373', marginBottom: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#737373', fontWeight: '500' }}>
            {pt('home')}
          </Link>
          <span style={{ color: '#a3a3a3' }}>/</span>
          <Link href={`/category/${initialProduct.slug}`} style={{ textDecoration: 'none', color: '#737373', fontWeight: '500' }}>
            {initialProduct.category}
          </Link>
          <span style={{ color: '#a3a3a3' }}>/</span>
          <span style={{ color: '#000000', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {productName}
          </span>
        </div>

        {/* MAIN PRODUCT AREA */}
        <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '16px', border: '1px solid #e5e5e5', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>

            {/* Gallery Section - only show if there are real images */}
            {productImages.length > 0 ? (
              <div className="gallery-container">
                <div className="desktop-gallery" style={{ position: 'relative' }}>
                  <img
                    key={mainDisplayImage}
                    src={mainDisplayImage}
                    className="main-image"
                    alt={productName}
                    onClick={() => setIsLightboxOpen(true)}
                    style={{ cursor: 'pointer', transition: 'opacity 0.15s ease' }}
                    decoding="async"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />

                  {/* Left Arrow */}
                  {productImages.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => { const idx = prev === -1 ? 0 : prev; return idx <= 0 ? productImages.length - 1 : idx - 1; }); }}
                      style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s', zIndex: 2 }}
                      aria-label="Foto Sebelumnya"
                    >
                      <Icon icon="solar:alt-arrow-left-linear" style={{ color: '#171717', fontSize: '20px' }} />
                    </button>
                  )}

                  {/* Right Arrow */}
                  {productImages.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => { const idx = prev === -1 ? 0 : prev; return idx >= productImages.length - 1 ? 0 : idx + 1; }); }}
                      style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s', zIndex: 2 }}
                      aria-label="Foto Berikutnya"
                    >
                      <Icon icon="solar:alt-arrow-right-linear" style={{ color: '#171717', fontSize: '20px' }} />
                    </button>
                  )}

                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', padding: '8px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    aria-label="Perbesar Foto"
                  >
                    <Icon icon="solar:maximize-square-linear" style={{ color: '#171717', fontSize: '20px' }} />
                  </button>

                  <div className="thumbnail-list" style={{ marginTop: '12px' }}>
                    {productImages.map((img: string, idx: number) => (
                      <img key={idx} src={img} className={`thumbnail ${selectedImage === idx ? 'active' : ''}`} onClick={() => setSelectedImage(idx)} alt={`Thumb ${idx}`} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ))}
                  </div>
                </div>
                <div className="mobile-gallery">
                  {fullGalleryImages.map((img: string, idx: number) => (
                    <div key={idx} className="mobile-gallery-item" onClick={() => { setSelectedImage(idx); setIsLightboxOpen(true); }}>
                      <img src={img} className="mobile-gallery-img" alt={`Product ${idx}`} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{idx + 1} / {fullGalleryImages.length}</div>

                      <button
                        style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Perbesar"
                      >
                        <Icon icon="solar:maximize-square-linear" style={{ color: '#171717', fontSize: '16px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #e5e5e5', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a3a3a3' }}>
                <Icon icon="solar:gallery-remove-linear" style={{ fontSize: '48px', marginBottom: '8px' }} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Foto belum tersedia</span>
              </div>
            )}
            <div>
              <ProductMeta
                name={productName}
                rating={4.9}
                reviewCount={128}
                sold={initialProduct.sold}
                pt={pt}
              />
              <PriceBox
                price={displayProduct.price}
                originalPrice={markupPrice}
                discountPercent={discountPercent}
              />
              <VariantSelector
                initialProduct={initialProduct}
                onVariantChange={handleVariantChange}
                onQuantityChange={handleQuantityChange}
                onOrderNow={handleOrderNow}
                onAddToCart={handleAddToCart}
                pt={pt}
              />
            </div>
          </div>
        </div>

        <TabsSection
          pt={pt}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          description={productDescription}
          weight="1000 gr"
          slug={initialProduct.slug}
          category={initialProduct.category}
        />

        <ProductSlider title={pt('relatedProducts')} products={relatedProducts} />
        <ProductSlider title={pt('youMayAlsoLike')} products={otherProducts} />
      </main>

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && fullGalleryImages.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, transition: 'opacity 0.3s ease' }} onClick={() => setIsLightboxOpen(false)}>
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20 }}
            aria-label="Tutup"
          >
            <Icon icon="solar:close-circle-bold" style={{ color: 'white', fontSize: '28px' }} />
          </button>

          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            {fullGalleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev === -1 || prev === 0 ? fullGalleryImages.length - 1 : prev - 1)); }}
                  style={{ position: 'absolute', left: '20px', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
                  aria-label="Sebelumnya"
                >
                  <Icon icon="solar:alt-arrow-left-linear" style={{ color: 'white', fontSize: '28px' }} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev === fullGalleryImages.length - 1 ? 0 : (prev === -1 ? 1 : prev + 1))); }}
                  style={{ position: 'absolute', right: '20px', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
                  aria-label="Berikutnya"
                >
                  <Icon icon="solar:alt-arrow-right-linear" style={{ color: 'white', fontSize: '28px' }} />
                </button>
              </>
            )}

            <img
              src={selectedImage === -1 ? fullGalleryImages[0] : fullGalleryImages[selectedImage] || fullGalleryImages[0]}
              alt="Full Preview"
              style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '8px' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />

            <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 16px', borderRadius: '20px', color: 'white', fontSize: '13px', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
              {(selectedImage === -1 ? 0 : selectedImage) + 1} / {fullGalleryImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="mobile-bottom-bar" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #e5e5e5',
        padding: '10px 16px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
        zIndex: 990,
        display: 'none',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)'
      }}>
        {/* WhatsApp Consultation */}
        <a 
          href={`https://wa.me/6281260001487?text=${encodeURIComponent(`Halo CS Paperlisens, saya ingin konsultasi produk ${initialProduct.name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a',
            textDecoration: 'none',
            fontSize: '10px',
            fontWeight: '700',
            padding: '6px 12px',
            borderRadius: '10px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            flexShrink: 0
          }}
          aria-label="Konsultasi WhatsApp"
        >
          <Icon icon="ri:whatsapp-fill" style={{ fontSize: '20px' }} />
          <span>Chat WA</span>
        </a>

        {/* Add to Cart */}
        <button
          onClick={() => {
            const chosen = selectedVariantRef.current || selectedVariant;
            if (initialProduct.variants && initialProduct.variants.length > 1 && !chosen) {
              window.scrollTo({ top: 380, behavior: 'smooth' });
              return;
            }
            handleAddToCart(chosen, quantityRef.current);
          }}
          style={{
            flex: 1,
            padding: '12px 14px',
            backgroundColor: '#fff7ed',
            color: '#ea580c',
            border: '1.5px solid #ea580c',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Icon icon="solar:cart-plus-bold" style={{ fontSize: '18px' }} />
          <span>+ Keranjang</span>
        </button>

        {/* Order Now */}
        <button
          onClick={() => {
            const chosen = selectedVariantRef.current || selectedVariant;
            if (initialProduct.variants && initialProduct.variants.length > 1 && !chosen) {
              window.scrollTo({ top: 380, behavior: 'smooth' });
              return;
            }
            handleOrderNow(chosen, quantityRef.current);
          }}
          style={{
            flex: 1.2,
            padding: '12px 14px',
            backgroundColor: '#ea580c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
          }}
        >
          <Icon icon="solar:bag-check-bold" style={{ fontSize: '18px' }} />
          <span>Beli Sekarang</span>
        </button>
      </div>

      <Footer />
      <PaperlisensFloatingCart />
    </div>
  );
}
