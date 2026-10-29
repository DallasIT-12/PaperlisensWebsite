'use client';

import { use, useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Link, useRouter } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';
import { useTranslations, useLocale } from 'next-intl';
import Footer from '@/components/layout/Footer';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { getSmartTranslation } from '@/utils/productTranslations';
import PaperlisensFloatingCart from '@/components/paperlisens/PaperlisensFloatingCart';
import UserMenu from '@/components/auth/UserMenu';

// --- Responsive Styles Component ---
const ResponsiveStyles = () => (
  <style>{`
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .product-card { position: relative; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); height: 100%; display: flex; flex-direction: column; animation: fadeInUp 0.5s ease forwards; }
    .product-card:hover { box-shadow: 0 16px 40px -8px rgba(64, 83, 76, 0.2); transform: translateY(-4px); border-color: #d6bd98; }
    .card-image-wrapper { position: relative; width: 100%; padding-top: 100%; background-color: #f9fafb; overflow: hidden; }
    .card-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
    .product-card:hover .card-image { transform: scale(1.06); }
    .card-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(26,54,54,0.9) 0%, rgba(26,54,54,0.4) 50%, transparent 100%); opacity: 0; transition: opacity 0.35s ease; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding: 16px; text-align: center; z-index: 10; }
    .product-card:hover .card-overlay { opacity: 1; }
    .card-info { padding: 14px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; color: #1a3636; }

    .skeleton-card { border-radius: 12px; overflow: hidden; background: #fff; border: 1px solid #e5e7eb; }
    .skeleton-img { width: 100%; padding-top: 100%; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite linear; }
    .skeleton-line { height: 14px; border-radius: 6px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite linear; margin-bottom: 8px; }

    .desktop-sidebar { display: block; width: 250px; flex-shrink: 0; }
    .mobile-sidebar { display: none; }
    .mobile-filter-toggle { display: none; }
    .mobile-filter-overlay { display: none; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; width: 100%; }

    @media (max-width: 768px) {
      .header-cart-btn { display: none !important; }
      .header-lang-switcher { display: none !important; }
      .top-bar-address, .top-bar-separator { display: none !important; }
      .back-text-full { display: none; }
      .back-text-short { display: inline !important; }
      .header-container { gap: 12px !important; padding: 0 12px !important; }
      .header-logo { height: 32px !important; }
      .search-input { font-size: 12px !important; padding: 8px 12px !important; }
      .main-content { padding: 16px 8px !important; }
      .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
      .desktop-sidebar { display: none; }
      .card-overlay { opacity: 0 !important; }
      .card-info { padding: 10px !important; }
      .card-info h3 { font-size: 12px !important; line-height: 1.3 !important; height: 32px !important; margin-bottom: 4px !important; }

      .mobile-sidebar { display: none; position: fixed; top: 0; left: 0; height: 100%; width: 80%; background: #ffffff; z-index: 2000; padding: 20px; box-shadow: 4px 0 15px rgba(0,0,0,0.1); overflow-y: auto; color: #1a3636; }
      .mobile-sidebar.open { display: block; animation: slideIn 0.3s forwards; }
      @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      .mobile-filter-toggle { display: flex; align-items: center; gap: 6px; background-color: #ffffff; border: 1px solid #e5e7eb; padding: 8px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; font-weight: 500; color: #1a3636; cursor: pointer; width: fit-content; }
      .mobile-filter-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1999; }
      .mobile-filter-overlay.open { display: block; }
    }
  `}</style>
);

// --- Fade Product Card Component ---
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

  const productName = getLocalized(product, 'name');

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
          router.push(`/paperlisens/product/${encodeURIComponent(product.productSlug)}`);
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-image-wrapper">
        <img src={product.image} alt={product.name} className="card-image" loading="lazy" />
        <div style={{
          position: 'absolute', top: '0px', right: '0px', backgroundColor: '#d6bd98',
          padding: '4px 8px', textAlign: 'center', lineHeight: '1', zIndex: 2
        }}>
          <div style={{ color: '#1a3636', fontSize: '12px', fontWeight: 'bold' }}>{discountPercent}%</div>
          <div style={{ color: '#40534c', fontSize: '10px', fontWeight: 'bold' }}>OFF</div>
        </div>

        <div className="card-overlay">
          <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); addToCart(product, 1); }} style={{ backgroundColor: 'rgba(214,189,152,0.95)', color: '#1a3636', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>{pt('addToCart')}</button>
          <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (onQuickView) { onQuickView(product); } else { addToCart(product, 1, undefined, true); router.push('/paperlisens/checkout'); } }} style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontSize: '12px', fontWeight: '600' }}>{pt('orderNow')}</button>
        </div>
      </div>

      <div className="card-info">
        <div style={{ flexGrow: 1 }}>
          <div style={{ fontSize: '10px', color: '#40534c', border: '1px solid #40534c', display: 'inline-block', padding: '1px 4px', borderRadius: '4px', marginBottom: '4px', fontWeight: 'bold' }}>
            {product.category || 'Paperlisens'}
          </div>
          <h3 style={{ fontSize: '14px', color: '#1a3636', lineHeight: '1.4', height: '40px', overflow: 'hidden', marginBottom: '8px', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{productName}</h3>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ minWidth: 0, flexShrink: 0 }}>
            <span style={{ fontSize: '10px', textDecoration: 'line-through', color: '#9ca3af', display: 'block' }}>Rp {markupPrice.toLocaleString('id-ID')}</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#40534c' }}>Rp {product.price.toLocaleString('id-ID')}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#677d6a', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 1, minWidth: 0, overflow: 'hidden' }}>
            <Icon icon="material-symbols:star" style={{ color: '#d6bd98', fontSize: '12px', marginRight: '2px', flexShrink: 0 }} />
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
    <div className="sidebar-content" style={{ color: '#1a3636' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a3636', margin: 0 }}> <Icon icon="material-symbols:filter-alt-outline" style={{ verticalAlign: 'middle' }} /> {pt('filter')}</h3>
        {closeSidebar && (
          <button onClick={closeSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a3636' }}>
            <Icon icon="mdi:close" width="24" />
          </button>
        )}
      </div>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#40534c' }}>{pt('priceRange')}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <input type="number" placeholder={pt('minPrice')} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#f9fafb' }} />
          <span style={{ color: '#1a3636' }}>-</span>
          <input type="number" placeholder={pt('maxPrice')} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#f9fafb' }} />
        </div>
        <button onClick={() => { if (closeSidebar) closeSidebar(); }} style={{ width: '100%', backgroundColor: '#40534c', color: '#d6bd98', border: 'none', padding: '6px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>{pt('apply')}</button>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#40534c' }}>{pt('sortBy')}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['sales', 'price_asc', 'price_desc'].map(opt => (
            <div key={opt} onClick={() => setSortBy(opt)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: sortBy === opt ? '#40534c' : '#677d6a', fontWeight: sortBy === opt ? '600' : 'normal' }}>
              <Icon icon={sortBy === opt ? "mdi:radiobox-marked" : "mdi:radiobox-blank"} style={{ fontSize: '20px', color: sortBy === opt ? '#40534c' : '#999' }} />
              <span>{pt(opt === 'sales' ? 'bestSeller' : opt === 'price_asc' ? 'priceLowHigh' : 'priceHighLow')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CategoryPageClient({ params }: { params: Promise<{ slug: string }> }) {
  const t = useTranslations();
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

  const categoryName = pt(`categories.${slug.replace(/-./g, (x: string) => x[1].toUpperCase())}` as any);

  const filteredCategoryProducts = useMemo(() => {
    let result = categoryProducts.filter(p => p.image && p.image !== '/placeholder.png');
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
      router.push(`/paperlisens?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filterProps = { minPrice, setMinPrice, maxPrice, setMaxPrice, sortBy, setSortBy };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <ResponsiveStyles />
        <div style={{ backgroundColor: '#40534c', padding: '16px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ width: '100px', height: '40px', borderRadius: '8px' }} className="skeleton-line" />
            <div style={{ flex: 1, height: '40px', borderRadius: '8px' }} className="skeleton-line" />
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div style={{ padding: '14px' }}>
                  <div className="skeleton-line" style={{ width: '60%' }} />
                  <div className="skeleton-line" style={{ width: '90%' }} />
                  <div className="skeleton-line" style={{ width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <ResponsiveStyles />
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
      <header style={{ backgroundColor: '#40534c', padding: '16px 0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="header-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/paperlisens"><img src="/paperlisens.jpg" alt="Paperlisens" className="header-logo" style={{ height: '40px' }} /></Link>
          <div style={{ flexGrow: 1 }}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input type="text" placeholder={pt('searchInCategory', { category: categoryName })} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" style={{ width: '100%', padding: '10px 16px', borderRadius: '3px', border: 'none', fontSize: '14px', backgroundColor: 'white', color: '#1a3636', outline: 'none' }} />
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
      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#677d6a' }}>
          <Link href="/paperlisens" style={{ textDecoration: 'none', color: '#40534c' }}>{pt('home')}</Link>
          <span>/</span> <span>{pt('category')}</span> <span>/</span> <span style={{ fontWeight: 'bold', color: '#1a3636' }}>{categoryName}</span>
        </div>
        <div className="mobile-filter-toggle" onClick={() => setIsMobileFilterOpen(true)}><Icon icon="material-symbols:filter-list" width="20" style={{ color: '#1a3636' }} /><span>Filter & Sort</span></div>
        <div className={`mobile-filter-overlay ${isMobileFilterOpen ? 'open' : ''}`} onClick={() => setIsMobileFilterOpen(false)} />
        <div className={`mobile-sidebar ${isMobileFilterOpen ? 'open' : ''}`}><SidebarFilter closeSidebar={() => setIsMobileFilterOpen(false)} {...filterProps} /></div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div className="desktop-sidebar"><SidebarFilter {...filterProps} /></div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '24px', border: '1px solid #e5e7eb' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a3636', marginBottom: '24px', borderLeft: '4px solid #40534c', paddingLeft: '12px' }}>{categoryName}</h1>
              <div className="product-grid">{displayedProducts.map(p => <ProductCard key={p.id} product={p} onQuickView={(prod) => setQuickViewProduct(prod)} />)}</div>
              {filteredCategoryProducts.length > visibleCount && <div style={{ textAlign: 'center', marginTop: '32px' }}><button onClick={loadMore} style={{ padding: '12px 32px', backgroundColor: '#40534c', color: '#d6bd98', border: 'none', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>{pt('loadMore')}</button></div>}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <PaperlisensFloatingCart 
        quickViewProduct={quickViewProduct} 
        setQuickViewProduct={setQuickViewProduct} 
      />
    </div>
  );
}
