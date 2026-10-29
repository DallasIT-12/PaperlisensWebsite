'use client';

import { use, useState, useMemo, useEffect, memo } from 'react';
import { Icon } from '@iconify/react';
import { Link, useRouter } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';
import { useTranslations, useLocale } from 'next-intl';
import Footer from '@/components/layout/Footer';
import { getSmartTranslation } from '@/utils/productTranslations';
import PaperlisensFloatingCart from '@/components/paperlisens/PaperlisensFloatingCart';
import UserMenu from '@/components/auth/UserMenu';

// --- Responsive Styles Component ---
const ResponsiveStyles = () => (
  <style>{`
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

    .product-card { 
      position: relative; 
      background-color: #ffffff; 
      border: 1px solid #e5e5e5; 
      border-radius: 12px; 
      overflow: hidden; 
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); 
      height: 100%; 
      display: flex; 
      flex-direction: column; 
      animation: fadeInUp 0.4s ease forwards; 
    }
    .product-card:hover { 
      box-shadow: 0 16px 36px -8px rgba(234, 88, 12, 0.15); 
      transform: translateY(-4px); 
      border-color: #ea580c; 
    }
    .card-image-wrapper { 
      position: relative; 
      width: 100%; 
      padding-top: 100%; 
      background-color: #f9f9f9; 
      overflow: hidden; 
    }
    .card-image { 
      position: absolute; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      transition: transform 0.5s ease; 
    }
    .product-card:hover .card-image { 
      transform: scale(1.06); 
    }
    .card-overlay { 
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
      padding: 16px; 
      text-align: center; 
      z-index: 10; 
    }
    .product-card:hover .card-overlay { 
      opacity: 1; 
    }
    .card-info { 
      padding: 14px; 
      flex-grow: 1; 
      display: flex; 
      flex-direction: column; 
      justify-content: space-between; 
      color: #000000; 
    }

    .skeleton-card { 
      border-radius: 12px; 
      overflow: hidden; 
      background: #ffffff; 
      border: 1px solid #e5e5e5; 
    }
    .skeleton-img { 
      width: 100%; 
      padding-top: 100%; 
      background: linear-gradient(90deg, #f5f5f5 25%, #e5e5e5 50%, #f5f5f5 75%); 
      background-size: 800px 100%; 
      animation: shimmer 1.5s infinite linear; 
    }
    .skeleton-line { 
      height: 14px; 
      border-radius: 6px; 
      background: linear-gradient(90deg, #f5f5f5 25%, #e5e5e5 50%, #f5f5f5 75%); 
      background-size: 800px 100%; 
      animation: shimmer 1.5s infinite linear; 
      margin-bottom: 8px; 
    }

    .desktop-sidebar { 
      display: block; 
      width: 250px; 
      flex-shrink: 0; 
    }
    .mobile-sidebar { 
      display: none; 
    }
    .mobile-filter-toggle { 
      display: none; 
    }
    .mobile-filter-overlay { 
      display: none; 
    }
    .product-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
      gap: 20px; 
      width: 100%; 
    }

    @media (max-width: 768px) {
      .header-cart-btn { display: none !important; }
      .back-text-full { display: none; }
      .back-text-short { display: inline !important; }
      .header-container { gap: 12px !important; padding: 0 12px !important; }
      .header-logo { height: 34px !important; }
      .search-input { font-size: 13px !important; padding: 9px 12px !important; }
      .main-content { padding: 16px 12px !important; }
      .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
      .desktop-sidebar { display: none; }
      .card-overlay { opacity: 0 !important; }
      .card-info { padding: 10px !important; }
      .card-info h3 { font-size: 13px !important; line-height: 1.35 !important; height: 35px !important; margin-bottom: 4px !important; }

      .mobile-sidebar { 
        display: none; 
        position: fixed; 
        top: 0; 
        left: 0; 
        height: 100%; 
        width: 84%; 
        max-width: 320px;
        background: #ffffff; 
        z-index: 2000; 
        padding: 24px 20px calc(24px + env(safe-area-inset-bottom, 0px)); 
        box-shadow: 8px 0 24px rgba(0,0,0,0.15); 
        overflow-y: auto; 
        color: #000000; 
      }
      .mobile-sidebar.open { 
        display: block; 
        animation: slideIn 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1); 
      }
      @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      .mobile-filter-toggle { 
        display: flex; 
        align-items: center; 
        gap: 8px; 
        background-color: #ffffff; 
        border: 1px solid #e5e5e5; 
        padding: 8px 16px; 
        border-radius: 10px; 
        font-size: 13px; 
        font-weight: 700; 
        color: #000000; 
        cursor: pointer; 
        width: fit-content; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        transition: all 0.2s;
      }
      .mobile-filter-toggle:active {
        background-color: #f5f5f5;
        transform: scale(0.98);
      }
      .mobile-filter-overlay { 
        display: none; 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0,0,0,0.55); 
        backdrop-filter: blur(2px);
        z-index: 1999; 
      }
      .mobile-filter-overlay.open { display: block; }
    }
  `}</style>
);

// --- Product Card Component ---
const ProductCard = ({ product, onQuickView }: { product: any; onQuickView?: (p: any) => void }) => {
  const { addToCart } = useCart();
  const pt = useTranslations('Paperlisens');
  const locale = useLocale();
  const router = useRouter();

  const getLocalized = (item: any, field: string) => {
    // @ts-ignore
    const specificTranslation = item[`${field}_${locale}`];
    if (specificTranslation) return specificTranslation;
    return getSmartTranslation(item[field], locale);
  };

  const productName = getLocalized(product, 'name') || 'Produk Paperlisens';
  const displayImage = (product.image && typeof product.image === 'string' && product.image.trim() !== '' && !product.image.includes('placeholder'))
    ? product.image
    : (Array.isArray(product.images) && product.images[0] ? product.images[0] : (product.image || '/placeholder.png'));

  const { discountPercent, markupPrice } = useMemo(() => {
    return {
      discountPercent: 10,
      markupPrice: Math.ceil(product.price / 0.9)
    };
  }, [product.price]);

  return (
    <div 
      className="product-card"
      onClick={() => {
        if (window.innerWidth <= 768 && onQuickView) {
          onQuickView(product);
        } else {
          router.push(`/product/${encodeURIComponent(product.productSlug)}`);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-image-wrapper">
        <img 
          src={displayImage} 
          alt={productName} 
          className="card-image" 
          loading="lazy" 
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
        />
        
        {/* Discount Badge */}
        <div style={{
          position: 'absolute', 
          top: '0px', 
          right: '0px', 
          backgroundColor: '#ea580c',
          padding: '4px 8px', 
          textAlign: 'center', 
          zIndex: 2,
          borderBottomLeftRadius: '8px'
        }}>
          <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold', lineHeight: '1.2' }}>{discountPercent}%</div>
          <div style={{ color: '#fed7aa', fontSize: '9px', fontWeight: 'bold' }}>OFF</div>
        </div>

        {/* Hover Overlay Buttons */}
        <div className="card-overlay">
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
              padding: '10px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              width: '100%', 
              marginBottom: '8px', 
              fontSize: '12px', 
              fontWeight: '700',
              letterSpacing: '0.3px',
              transition: 'background 0.2s',
              boxShadow: '0 4px 12px rgba(234,88,12,0.3)'
            }}
          >
            {pt('addToCart')}
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault(); 
              if (onQuickView) { 
                onQuickView(product); 
              } else { 
                addToCart(product, 1, undefined, true); 
                router.push('/checkout'); 
              } 
            }} 
            style={{ 
              backgroundColor: '#000000', 
              color: '#ffffff', 
              border: '1px solid #ea580c', 
              padding: '10px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              width: '100%', 
              fontSize: '12px', 
              fontWeight: '700' 
            }}
          >
            {pt('orderNow')}
          </button>
        </div>
      </div>

      <div className="card-info">
        <div style={{ flexGrow: 1 }}>
          <div style={{ 
            fontSize: '10px', 
            color: '#ea580c', 
            backgroundColor: '#fff7ed',
            border: '1px solid #ea580c', 
            display: 'inline-block', 
            padding: '1px 6px', 
            borderRadius: '4px', 
            marginBottom: '6px', 
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.4px'
          }}>
            {product.category || 'Paperlisens'}
          </div>
          <h3 style={{ 
            fontSize: '14px', 
            color: '#000000', 
            lineHeight: '1.4', 
            height: '40px', 
            overflow: 'hidden', 
            marginBottom: '8px', 
            fontWeight: '600', 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical' 
          }}>
            {productName}
          </h3>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ minWidth: 0, flexShrink: 0 }}>
            <span style={{ fontSize: '10px', textDecoration: 'line-through', color: '#a3a3a3', display: 'block' }}>
              Rp {markupPrice.toLocaleString('id-ID')}
            </span>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#ea580c' }}>
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#737373', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 1, minWidth: 0, overflow: 'hidden' }}>
            <Icon icon="solar:star-bold" style={{ color: '#f59e0b', fontSize: '13px', marginRight: '3px', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.sold} {pt('sold')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sidebar Filter Component ---
const SidebarFilter = ({ closeSidebar, minPrice, setMinPrice, maxPrice, setMaxPrice, sortBy, setSortBy }: any) => {
  const pt = useTranslations('Paperlisens');
  return (
    <div className="sidebar-content" style={{ color: '#000000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e5e5' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#000000', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon icon="solar:tuning-bold" style={{ color: '#ea580c', fontSize: '18px' }} />
          {pt('filter')}
        </h3>
        {closeSidebar && (
          <button onClick={closeSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center' }}>
            <Icon icon="solar:close-circle-bold" width="22" style={{ color: '#737373' }} />
          </button>
        )}
      </div>

      {/* Rentang Harga */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {pt('priceRange')}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <input 
            type="number" 
            placeholder={pt('minPrice')} 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)} 
            style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #e5e5e5', borderRadius: '8px', backgroundColor: '#f9f9f9', outline: 'none' }} 
          />
          <span style={{ color: '#737373' }}>-</span>
          <input 
            type="number" 
            placeholder={pt('maxPrice')} 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
            style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #e5e5e5', borderRadius: '8px', backgroundColor: '#f9f9f9', outline: 'none' }} 
          />
        </div>
        <button 
          onClick={() => { if (closeSidebar) closeSidebar(); }} 
          style={{ width: '100%', backgroundColor: '#ea580c', color: '#ffffff', border: 'none', padding: '9px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(234,88,12,0.25)', transition: 'background 0.2s' }}
        >
          {pt('apply')}
        </button>
      </div>

      {/* Urutan Produk */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {pt('sortBy')}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'sales', label: pt('bestSeller') },
            { id: 'price_asc', label: pt('priceLowHigh') },
            { id: 'price_desc', label: pt('priceHighLow') }
          ].map(opt => (
            <div 
              key={opt.id} 
              onClick={() => setSortBy(opt.id)} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '13px', 
                cursor: 'pointer', 
                color: sortBy === opt.id ? '#ea580c' : '#525252', 
                fontWeight: sortBy === opt.id ? '700' : '500',
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: sortBy === opt.id ? '#fff7ed' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              <Icon 
                icon={sortBy === opt.id ? "solar:check-circle-bold" : "solar:circle-linear"} 
                style={{ fontSize: '18px', color: sortBy === opt.id ? '#ea580c' : '#a3a3a3', flexShrink: 0 }} 
              />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Static TopBar Component ---
const StaticTopBar = memo(() => (
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
StaticTopBar.displayName = 'StaticTopBar';

// --- Static Header Component ---
const StaticHeader = memo(({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  cartCount, 
  setIsCartOpen,
  placeholderText
}: any) => (
  <header style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', padding: '16px 0', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #e5e5e5' }}>
    <div className="header-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '32px' }}>
      <Link href="/" style={{ flexShrink: 0 }}>
        <img src="/logo-paperlisens.png" alt="Paperlisens" className="header-logo" style={{ height: '42px', flexShrink: 0, width: 'auto' }} />
      </Link>
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ width: '100%', padding: '11px 16px', paddingRight: '52px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '14px', backgroundColor: '#f5f5f5', color: '#000000', outline: 'none' }}
          />
          <button 
            type="submit" 
            style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', width: '40px', backgroundColor: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            aria-label="Cari"
          >
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
StaticHeader.displayName = 'StaticHeader';

export default function CategoryPageClient({ params }: { params: Promise<{ slug: string }> }) {
  const pt = useTranslations('Paperlisens');
  const router = useRouter();
  const { slug } = use(params);
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('sales');
  const [visibleCount, setVisibleCount] = useState(24);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/paperlisens/products?category=${encodeURIComponent(slug)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => { setCategoryProducts(Array.isArray(data) ? data : []); })
      .catch(() => setCategoryProducts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  // Safely translate category title or format slug as fallback
  const categoryName = useMemo(() => {
    try {
      const camelCaseSlug = slug.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
      const translated = pt(`categories.${camelCaseSlug}` as any);
      if (translated && !translated.startsWith('Paperlisens.categories.')) {
        return translated;
      }
    } catch (e) {
      // ignore
    }
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [slug, pt]);

  const filteredCategoryProducts = useMemo(() => {
    let result = categoryProducts.filter(p => p.image && !p.image.includes('placeholder'));
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Infinity;
      result = result.filter(p => p.price >= min && p.price <= max);
    }
    const seen = new Set();
    result = result.filter(p => {
      const duplicate = seen.has(p.name);
      seen.add(p.name);
      return !duplicate;
    });
    result.sort((a, b) => {
      if (sortBy === 'sales') return b.sold - a.sold;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });
    return result;
  }, [categoryProducts, searchQuery, minPrice, maxPrice, sortBy]);

  const displayedProducts = filteredCategoryProducts.slice(0, visibleCount);
  const loadMore = () => setVisibleCount(prev => prev + 24);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produk?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filterProps = { minPrice, setMinPrice, maxPrice, setMaxPrice, sortBy, setSortBy };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <ResponsiveStyles />
        <div style={{ backgroundColor: '#ffffff', height: '37px', borderBottom: '1px solid #e5e5e5' }} />
        <div style={{ backgroundColor: '#ffffff', padding: '16px 0', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ width: '140px', height: '42px', borderRadius: '8px' }} className="skeleton-line" />
            <div style={{ flex: 1, height: '42px', borderRadius: '10px' }} className="skeleton-line" />
            <div style={{ width: '80px', height: '42px', borderRadius: '10px' }} className="skeleton-line" />
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ width: '220px', height: '28px', borderRadius: '6px', marginBottom: '24px' }} className="skeleton-line" />
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div style={{ padding: '14px' }}>
                  <div className="skeleton-line" style={{ width: '40%' }} />
                  <div className="skeleton-line" style={{ width: '90%' }} />
                  <div className="skeleton-line" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <ResponsiveStyles />
      
      {/* Top Bar */}
      <StaticTopBar />

      {/* Main Header */}
      <StaticHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        placeholderText={`Cari di kategori ${categoryName}...`}
      />

      {/* Main Category Content */}
      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#737373', flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#737373', transition: 'color 0.2s' }}>
            {pt('home')}
          </Link>
          <span>/</span>
          <Link href="/produk" style={{ textDecoration: 'none', color: '#737373', transition: 'color 0.2s' }}>
            Katalog Produk
          </Link>
          <span>/</span>
          <span style={{ fontWeight: '700', color: '#000000' }}>{categoryName}</span>
        </div>

        {/* Mobile Filter Toggle Drawer Overlay */}
        <div className={`mobile-filter-overlay ${isMobileFilterOpen ? 'open' : ''}`} onClick={() => setIsMobileFilterOpen(false)} />
        <div className={`mobile-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <SidebarFilter closeSidebar={() => setIsMobileFilterOpen(false)} {...filterProps} />
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Desktop Left Sidebar Filter */}
          <div className="desktop-sidebar">
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <SidebarFilter {...filterProps} />
            </div>
          </div>

          {/* Main Product Area */}
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              {/* Category Header & Filter Trigger */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#000000', borderLeft: '4px solid #ea580c', paddingLeft: '14px', lineHeight: '1.2', margin: 0 }}>
                    {categoryName}
                  </h1>
                  <p style={{ margin: '6px 0 0 18px', color: '#737373', fontSize: '13px' }}>
                    Menampilkan {displayedProducts.length} dari {filteredCategoryProducts.length} kemasan berkualitas
                  </p>
                </div>
                
                {/* Mobile Filter Trigger Button */}
                <div className="mobile-filter-toggle" onClick={() => setIsMobileFilterOpen(true)}>
                  <Icon icon="solar:tuning-bold" width="18" style={{ color: '#ea580c' }} />
                  <span>Filter & Urutkan</span>
                </div>
              </div>

              {/* Product Grid or Empty State */}
              {filteredCategoryProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#737373' }}>
                  <Icon icon="solar:box-minimalistic-linear" style={{ fontSize: '56px', color: '#d4d4d4', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#000000', marginBottom: '8px' }}>
                    {pt('noProductsFound')}
                  </h3>
                  <p style={{ fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px auto', color: '#737373' }}>
                    Tidak ada produk yang cocok dengan pencarian atau rentang harga filter ini.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setMinPrice(''); setMaxPrice(''); setSortBy('sales'); }}
                    style={{ padding: '10px 24px', backgroundColor: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(234,88,12,0.25)' }}
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {displayedProducts.map(p => (
                    <ProductCard key={p.id} product={p} onQuickView={(prod) => setQuickViewProduct(prod)} />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {filteredCategoryProducts.length > visibleCount && (
                <div style={{ textAlign: 'center', marginTop: '36px' }}>
                  <button 
                    onClick={loadMore} 
                    style={{ 
                      padding: '12px 36px', 
                      backgroundColor: '#ea580c', 
                      color: '#ffffff', 
                      border: 'none', 
                      borderRadius: '50px', 
                      fontSize: '14px', 
                      fontWeight: '800', 
                      cursor: 'pointer', 
                      boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)',
                      transition: 'transform 0.2s, background-color 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = '#c2410c'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = '#ea580c'; }}
                  >
                    <span>{pt('loadMore')}</span>
                    <Icon icon="solar:alt-arrow-down-linear" style={{ fontSize: '18px' }} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Global Modern Footer */}
      <Footer />

      {/* Floating Cart and Quick View */}
      <PaperlisensFloatingCart 
        quickViewProduct={quickViewProduct} 
        setQuickViewProduct={setQuickViewProduct} 
      />
    </div>
  );
}
