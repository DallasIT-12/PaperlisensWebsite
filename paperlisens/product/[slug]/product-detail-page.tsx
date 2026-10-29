'use client';

import { useState, useRef, useEffect, useMemo, memo, useCallback, useTransition } from 'react';
import { Icon } from '@iconify/react';
import { Link, useRouter } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { useTranslations, useLocale } from 'next-intl';
import Footer from '@/components/layout/Footer';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { getSmartTranslation } from '@/utils/productTranslations';
import VariantSelector from './VariantSelector';
import PaperlisensFloatingCart from '@/components/paperlisens/PaperlisensFloatingCart';
import UserMenu from '@/components/auth/UserMenu';

// --- Constants & Helpers ---

// --- Responsive Styles ---
const Styles = () => (
  <style>{`
    .gallery-container { display: flex; flex-direction: column; gap: 16px; }
    .thumbnail-list { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; justify-content: center; }
    .thumbnail-list::-webkit-scrollbar { display: none; }
    .thumbnail { width: 80px; height: 80px; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer; object-fit: cover; flex-shrink: 0; }
    .thumbnail.active { border-color: #40534c; border-width: 2px; }
    .main-image { width: 100%; height: 450px; object-fit: contain; border-radius: 8px; border: 1px solid #e5e7eb; background-color: #f9fafb; display: block; margin: 0 auto; }
    .tab-nav { display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 24px; overflow-x: auto; }
    .tab-item { padding: 12px 24px; cursor: pointer; color: #677d6a; border-bottom: 2px solid transparent; white-space: nowrap; }
    .tab-item.active { color: #40534c; border-bottom-color: #40534c; font-weight: bold; }
    
    @media (max-width: 768px) {
      .header-cart-btn { display: none !important; }
      .header-lang-switcher { display: none !important; }
      .main-image { height: 300px; }
      .back-text-full { display: none; }
      .back-text-short { display: inline !important; }
      .header-container { gap: 12px !important; padding: 0 12px !important; }
      .header-logo { height: 32px !important; }
      .search-input { font-size: 12px !important; padding: 8px 12px !important; }
      
      /* Mobile Gallery Styles - FIXED CENTERING */
      .desktop-gallery { display: none; }
      .mobile-gallery {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        gap: 0 !important; /* Remove gap for perfect centering on swipe */
        padding-bottom: 8px;
        scrollbar-width: none;
      }
      .mobile-gallery::-webkit-scrollbar { display: none; }
      .mobile-gallery-item {
        min-width: 100%;
        width: 100%;
        flex-shrink: 0;
        scroll-snap-align: center;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        background-color: #f9fafb;
        height: 350px;
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

// --- Product Card Component ---
const ProductCard = memo(({ product }: { product: any }) => {
  const pt = useTranslations('Paperlisens');
  const locale = useLocale();

  const getLocalized = (item: any, field: string) => {
    // @ts-ignore
    const specificTranslation = item[`${field}_${locale}`];
    if (specificTranslation) return specificTranslation;

    const originalValue = item[field];
    if (!originalValue || typeof originalValue !== 'string') return originalValue;

    // Smart Fallback Translation for common terms
    if (locale === 'en') {
      return originalValue
        .replace(/\bBox\b/g, 'Box')
        .replace(/\bKotak\b/g, 'Box')
        .replace(/\bIsi\b/gi, 'Count')
        .replace(/\bMotif\b/g, 'Patterned')
        .replace(/\bPutih\b/g, 'White')
        .replace(/\bHitam\b/g, 'Black')
        .replace(/\bMerah\b/g, 'Red')
        .replace(/\bBiru\b/g, 'Blue')
        .replace(/\bHijau\b/g, 'Green')
        .replace(/\bKuning\b/g, 'Yellow')
        .replace(/\bLaminasi\b/g, 'Laminated')
        .replace(/\bTanpa\b/g, 'Without')
        .replace(/\bPakai\b/g, 'With')
        .replace(/\bLobang\b/g, 'Hole')
        .replace(/\bTermurah\b/gi, 'Cheapest')
        .replace(/\bKue\b/gi, 'Cake')
        .replace(/\bNasi\b/gi, 'Rice')
        .replace(/\bPolos\b/gi, 'Plain');
    }

    if (locale === 'zh') {
      return originalValue
        .replace(/\bBox\b/g, '盒子')
        .replace(/\bKotak\b/g, '盒子')
        .replace(/\bIsi\b/gi, '装')
        .replace(/\bMotif\b/g, '图案')
        .replace(/\bPutih\b/g, '白色')
        .replace(/\bHitam\b/g, '黑色')
        .replace(/\bMerah\b/g, '红色')
        .replace(/\bBiru\b/g, '蓝色')
        .replace(/\bHijau\b/g, '绿色')
        .replace(/\bKuning\b/g, '黄色')
        .replace(/\bLaminasi\b/g, '层压')
        .replace(/\bTanpa\b/g, '无')
        .replace(/\bPakai\b/g, '带')
        .replace(/\bLobang\b/g, '孔')
        .replace(/\bTermurah\b/gi, '最便宜')
        .replace(/\bKue\b/gi, '蛋糕')
        .replace(/\bNasi\b/gi, '米饭')
        .replace(/\bPolos\b/gi, '纯色');
    }

    return originalValue;
  };

  const productName = getLocalized(product, 'name');
  const discountPercent = 10;
  const markupPrice = Math.ceil(product.price / 0.9);

  return (
    <Link href={`/paperlisens/product/${encodeURIComponent(product.productSlug)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '220px', flexShrink: 0 }}>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', height: '100%', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '200px', backgroundColor: '#f9fafb', position: 'relative', overflow: 'hidden' }}>
          {product.image && !product.image.includes('placeholder') ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db' }}>
              <Icon icon="mdi:image-off-outline" style={{ fontSize: '48px' }} />
            </div>
          )}
          <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#d6bd98', padding: '4px 8px', fontSize: '10px', color: '#1a3636', fontWeight: 'bold', borderBottomLeftRadius: '8px' }}>
            {discountPercent}% OFF
          </div>
        </div>
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '10px', color: '#677d6a', border: '1px solid #677d6a', display: 'inline-block', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              {product.category || 'Paperlisens'}
            </div>
          </div>
          <h4 style={{ fontSize: '14px', color: '#1a3636', marginBottom: '12px', lineHeight: '1.4', height: '40px', overflow: 'hidden', fontWeight: '600', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {productName}
          </h4>
          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', textDecoration: 'line-through', color: '#9ca3af' }}>Rp {markupPrice.toLocaleString('id-ID')}</span>
              <div style={{ fontSize: '11px', color: '#677d6a', display: 'flex', alignItems: 'center' }}>
                <Icon icon="material-symbols:star" style={{ color: '#d6bd98', fontSize: '14px', marginRight: '2px' }} />
                {product.sold} {pt('sold')}
              </div>
            </div>
            <div style={{ color: '#40534c', fontWeight: '800', fontSize: '16px' }}>
              Rp {product.price.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </Link>
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
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a3636', marginBottom: '16px', borderLeft: '4px solid #40534c', paddingLeft: '12px' }}>{title}</h3>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {isScrollable && (
          <>
            <button onClick={() => scroll('left')} style={{ position: 'absolute', left: '-15px', zIndex: 10, background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#40534c' }}><Icon icon="mdi:chevron-left" fontSize="24px" /></button>
            <button onClick={() => scroll('right')} style={{ position: 'absolute', right: '-15px', zIndex: 10, background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#40534c' }}><Icon icon="mdi:chevron-right" fontSize="24px" /></button>
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
    <div style={{ lineHeight: '1.8', color: '#1a3636', fontSize: '15px' }}>
      {text.split('\n').map((line, index) => {
        const trimmed = line.trim();

        // Render Horizontal Line
        if (trimmed === '---') {
          return <hr key={index} style={{ border: 'none', borderTop: '1px solid #eee', margin: '24px 0' }} />;
        }

        // Render Markdown Headers (###)
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={index} style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginTop: '28px',
              marginBottom: '16px',
              color: '#40534c',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ width: '4px', height: '18px', backgroundColor: '#d6bd98', borderRadius: '2px' }}></span>
              {trimmed.replace('###', '').trim()}
            </h4>
          );
        }

        // Render Bullet Points
        if (trimmed.startsWith('•') || trimmed.startsWith('*') || (trimmed.startsWith('-') && !trimmed.startsWith('---'))) {
          return (
            <div key={index} style={{ display: 'flex', marginLeft: '12px', marginBottom: '10px' }}>
              <span style={{ marginRight: '10px', color: '#d6bd98', fontWeight: 'bold' }}>•</span>
              <span style={{ flex: 1 }}>{trimmed.replace(/^[•\-\*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
            </div>
          );
        }

        // Empty line for spacing
        if (!trimmed) {
          return <div key={index} style={{ height: '16px' }} />;
        }

        // Normal paragraph with bold support
        return (
          <p key={index} style={{ marginBottom: '12px' }}>
            {trimmed.split('**').map((part, i) => (
              i % 2 === 1 ? <strong key={i} style={{ color: '#40534c' }}>{part}</strong> : part
            ))}
          </p>
        );
      })}
    </div>
  );
};

// --- Price Box: only re-renders when price/discount changes ---
const PriceBox = memo(({ price, originalPrice, discountPercent }: { price: number; originalPrice: number; discountPercent: number }) => (
  <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '4px', marginBottom: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '14px' }}>Rp {originalPrice.toLocaleString('id-ID')}</span>
      <span style={{ backgroundColor: '#d6bd98', color: '#1a3636', fontSize: '10px', fontWeight: 'bold', padding: '2px 4px', borderRadius: '2px' }}>{discountPercent}% OFF</span>
    </div>
    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#40534c' }}>Rp {price.toLocaleString('id-ID')}</div>
  </div>
));

// --- Product Meta: name + ratings — NEVER re-renders on variant click ---
const ProductMeta = memo(({ name, rating, reviewCount, sold, pt }: any) => (
  <>
    <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '12px', color: '#1a3636', lineHeight: '1.3' }}>{name}</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#40534c' }}>
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{rating}</span>
        <Icon icon="material-symbols:star" />
      </div>
      <div style={{ height: '16px', width: '1px', backgroundColor: '#ddd' }}></div>
      <div style={{ color: '#677d6a' }}>{reviewCount} {pt('rating')}</div>
      <div style={{ height: '16px', width: '1px', backgroundColor: '#ddd' }}></div>
      <div style={{ color: '#677d6a' }}>{sold} {pt('sold')}</div>
    </div>
  </>
));

// --- Tabs Section: only re-renders when activeTab changes ---
const TabsSection = memo(({ pt, activeTab, setActiveTab, description, weight, slug, category }: any) => (
  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
    <div className="tab-nav">
      {['deskripsi', 'info', 'review', 'pengiriman'].map(tab => (
        <div key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{pt(tab)}</div>
      ))}
    </div>
    <div style={{ padding: '0 12px' }}>
      {activeTab === 'deskripsi' && <DescriptionFormatter text={description} />}
      {activeTab === 'info' && <div style={{ color: '#1a3636' }}><p><strong>{pt('weight')}:</strong> {weight}</p><p><strong>{pt('category')}:</strong> {pt(`categories.${slug.replace(/-./g, (x: string) => x[1].toUpperCase())}` as any) || category}</p></div>}
      {activeTab === 'review' && <div style={{ color: '#1a3636' }}><strong>4.9</strong> ({pt('reviewsCount', { count: 128 })})</div>}
      {activeTab === 'pengiriman' && <div style={{ color: '#1a3636' }}><p>{pt('shippingInfo.from')}</p></div>}
    </div>
  </div>
));

// --- Static Sections (memoized to prevent re-render on variant click) ---
const StaticTopBar = memo(({ pt, t }: { pt: any; t: any }) => (
  <div style={{ backgroundColor: '#ffffff', color: '#1a3636', fontSize: '12px', padding: '8px 0', borderBottom: '1px solid #eee' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/" style={{ color: '#40534c', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Icon icon="mdi:arrow-left" />
          <span className="back-text-full">{pt('backToDallas')}</span>
          <span className="back-text-short" style={{ display: 'none' }}>{t('Common.back')}</span>
        </Link>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icon icon="mdi:phone" style={{ fontSize: '14px', color: '#40534c' }} /> 081260001487</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a href="https://www.instagram.com/paperlisens22" target="_blank" style={{ color: '#1a3636' }}><Icon icon="mdi:instagram" style={{ fontSize: '18px' }} /></a>
        <a href="https://www.tiktok.com/@paperlisenss22" target="_blank" style={{ color: '#1a3636' }}><Icon icon="ic:baseline-tiktok" style={{ fontSize: '18px' }} /></a>
        <a href="https://id.shp.ee/tpQ9dbH" target="_blank" style={{ color: '#1a3636' }}><Icon icon="ic:baseline-shopping-bag" style={{ fontSize: '18px' }} /></a>
        <a href="https://www.facebook.com/share/1G3GADNMZi/" target="_blank" style={{ color: '#1a3636' }}><Icon icon="mdi:facebook" style={{ fontSize: '18px' }} /></a>
      </div>
    </div>
  </div>
));

const StaticHeader = memo(({ pt, searchQuery, setSearchQuery, handleSearch, cartCount, setIsCartOpen }: any) => (
  <header style={{ backgroundColor: '#40534c', padding: '16px 0', position: 'sticky', top: 0, zIndex: 1000 }}>
    <div className="header-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '32px' }}>
      <Link href="/paperlisens"><img src="/paperlisens.jpg" alt="Paperlisens" className="header-logo" style={{ height: '40px' }} /></Link>
      <div style={{ flexGrow: 1 }}>
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={pt('searchPlaceholder')}
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ width: '100%', padding: '10px 16px', paddingRight: '48px', borderRadius: '3px', border: 'none', fontSize: '14px', backgroundColor: 'white', color: '#1a3636', outline: 'none' }}
          />
          <button type="submit" style={{ position: 'absolute', right: '5px', top: '5px', bottom: '5px', width: '40px', backgroundColor: '#1a3636', color: '#d6bd98', border: 'none', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon="material-symbols:search" style={{ fontSize: '20px', color: '#d6bd98' }} />
          </button>
        </form>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="header-cart-btn"
          style={{
            position: 'relative',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#d6bd98',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            marginRight: '4px'
          }}
          aria-label="Keranjang Belanja"
        >
          <Icon icon="material-symbols:shopping-cart-outline" style={{ fontSize: '24px' }} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#d6bd98',
              color: '#40534c',
              fontSize: '9px',
              fontWeight: '900',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #40534c'
            }}>
              {cartCount}
            </span>
          )}
        </button>
        <span className="header-lang-switcher">
          <LanguageSwitcher light />
        </span>
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
  const [selectedImage, setSelectedImage] = useState(-1);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [hoveredVariant, setHoveredVariant] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  // Refs to hold current variant/quantity from child without re-rendering parent
  const selectedVariantRef = useRef<any>(null);
  const quantityRef = useRef(1);
  const [, startTransition] = useTransition();

  // Preload ALL variant images on mount so switching variants is instant
  // Root cause: variants 2,5-12 are slow because browser fetches image on click
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
      img.src = src;
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
    // Only update parent state for price/image display
    startTransition(() => {
      setSelectedVariant(variant);

      // Only reset the gallery if the new variant actually has a unique image.
      // If it has no image (or placeholder), don't force the gallery to jump.
      const hasValidImage = variant?.image && !variant.image.includes('placeholder') && variant.image !== '/placeholder.png';
      if (hasValidImage) {
        setSelectedImage(-1);
      }
    });
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
    : productImages[Math.max(0, selectedImage)];

  // Ref always holds latest product data for cart — updating ref does NOT trigger re-render
  const cartProductRef = useRef<any>(null);
  cartProductRef.current = {
    ...displayProduct,
    localizedName: productName,
    localizedDescription: productDescription,
    category: initialProduct.category,
    slug: initialProduct.slug,
    images: productImages,
    rating: 4.9,
    reviewCount: 128,
    originalPrice: displayProduct.price,
    stock: 150,
    weight: '1000 gr',
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

  const handleOrderNow = useCallback(async (variant: any | null, qty: number) => {
    try {
      await fetch(`/api/paperlisens/products/${initialProduct.productSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: variant?.id })
      });
    } catch (e) { }
    const variantName = variant ? getVariantName(variant) : (initialProduct.variant || 'Standard');
    const message = `Halo Paperlisens,\n\nSaya ingin memesan produk berikut:\n📦 *${productName}*\n🔹 Varian: ${variantName}\n🔢 Jumlah: ${qty} pcs\n\nMohon informasi selanjutnya, terima kasih!`;
    window.open(`https://wa.me/6281260001487?text=${encodeURIComponent(message)}`, '_blank');
  }, [getVariantName, initialProduct, productName]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/paperlisens?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, router]);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Styles />

      <StaticTopBar pt={pt} t={t} />
      <StaticHeader pt={pt} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} cartCount={cartCount} setIsCartOpen={setIsCartOpen} />

      <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
        {/* BREADCRUMB - uses initialProduct directly (stable, never changes with variant) */}
        <div style={{ fontSize: '14px', color: '#677d6a', marginBottom: '16px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
          <Link href="/paperlisens" style={{ textDecoration: 'none', color: '#40534c' }}>{pt('home')}</Link>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <Link href={`/paperlisens/category/${initialProduct.slug}`} style={{ textDecoration: 'none', color: '#40534c' }}>{initialProduct.category}</Link>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span style={{ color: '#1a3636', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{productName}</span>
        </div>

        {/* MAIN PRODUCT AREA */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

            {/* Gallery Section - only show if there are real images */}
            {productImages.length > 0 ? (
              <div className="gallery-container">
                <div className="desktop-gallery" style={{ position: 'relative' }}>
                  <img
                    src={mainDisplayImage}
                    className="main-image"
                    alt={productName}
                    onClick={() => setIsLightboxOpen(true)}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />

                  {/* Left Arrow */}
                  {productImages.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => { const idx = prev === -1 ? 0 : prev; return idx <= 0 ? productImages.length - 1 : idx - 1; }); }}
                      style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s', zIndex: 2 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.1)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.85)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1)'; }}
                    >
                      <Icon icon="lucide:chevron-left" style={{ color: '#1a3636', fontSize: '22px' }} />
                    </button>
                  )}

                  {/* Right Arrow */}
                  {productImages.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => { const idx = prev === -1 ? 0 : prev; return idx >= productImages.length - 1 ? 0 : idx + 1; }); }}
                      style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s', zIndex: 2 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.1)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.85)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1)'; }}
                    >
                      <Icon icon="lucide:chevron-right" style={{ color: '#1a3636', fontSize: '22px' }} />
                    </button>
                  )}

                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '8px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  >
                    <Icon icon="lucide:maximize-2" style={{ color: '#1a3636', fontSize: '20px' }} />
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
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '10px' }}>{idx + 1} / {fullGalleryImages.length}</div>

                      <button
                        style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon icon="lucide:maximize-2" style={{ color: '#1a3636', fontSize: '16px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                <Icon icon="mdi:image-off-outline" style={{ fontSize: '48px', marginBottom: '8px' }} />
                <span style={{ fontSize: '14px' }}>Foto belum tersedia</span>
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
            style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20 }}
          >
            <Icon icon="lucide:x" style={{ color: 'white', fontSize: '24px' }} />
          </button>

          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            {fullGalleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev === -1 || prev === 0 ? fullGalleryImages.length - 1 : prev - 1)); }}
                  style={{ position: 'absolute', left: '20px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
                >
                  <Icon icon="lucide:chevron-left" style={{ color: 'white', fontSize: '28px' }} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev === fullGalleryImages.length - 1 ? 0 : (prev === -1 ? 1 : prev + 1))); }}
                  style={{ position: 'absolute', right: '20px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(4px)' }}
                >
                  <Icon icon="lucide:chevron-right" style={{ color: 'white', fontSize: '28px' }} />
                </button>
              </>
            )}

            <img
              src={selectedImage === -1 ? fullGalleryImages[0] : fullGalleryImages[selectedImage] || fullGalleryImages[0]}
              alt="Full Preview"
              style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '4px' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />

            <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '14px', backdropFilter: 'blur(4px)' }}>
              {(selectedImage === -1 ? 0 : selectedImage) + 1} / {fullGalleryImages.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <PaperlisensFloatingCart />
    </div>
  );
}
