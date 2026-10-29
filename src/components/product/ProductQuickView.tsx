'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { getSmartTranslation } from '@/utils/productTranslations';

interface ProductQuickViewProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const pt = useTranslations('Paperlisens');
  
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(null);
      setQuantity(1);
      setCurrentImageIndex(0);
      if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    }
  }, [product]);

  // Must be above early return — Rules of Hooks
  const variants = product?.variants || [];

  const allImages = useMemo(() => {
    if (!product) return [];
    const list = [product.image];
    if (Array.isArray(product.images)) {
      product.images.forEach((img: string) => {
        if (img && img !== product.image) list.push(img);
      });
    }
    variants.forEach((v: any) => {
      if (v.image && !list.includes(v.image) && !v.image.includes('placeholder')) {
        list.push(v.image);
      }
    });
    return list.filter(img => img && !img.includes('placeholder'));
  }, [product, variants]);

  if (!product || !isOpen) return null;

  const getLocalized = (item: any, field: string) => {
    // @ts-ignore
    const specificTranslation = item[`${field}_${locale}`];
    if (specificTranslation) return specificTranslation;
    return getSmartTranslation(item[field], locale);
  };

  const name = getLocalized(product, 'name');
  
  // Use variant price/image if selected, else base product
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayImage = selectedVariant?.image || product.image;

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setCurrentImageIndex(index);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant, true); // true to clear cart or just add
    router.push('/checkout');
    onClose();
  };

  const discountPercent = 10;
  const markupPrice = Math.ceil(displayPrice / 0.9);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 4000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
    }}>
      {/* Overlay Click to Close */}
      <div 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
        onClick={onClose}
      />

      {/* Modal Content (Bottom Sheet) */}
      <div style={{
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        backgroundColor: 'white',
        maxHeight: '88dvh',
        position: 'relative',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px 24px 0 0',
        animation: 'slideInUp 0.4s cubic-bezier(0, 0.55, 0.45, 1)',
        overflow: 'hidden'
      }}>
        {/* Drag Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#e5e7eb' }} />
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px calc(90px + env(safe-area-inset-bottom, 0px))' }}>
          
          {/* Close Button */}
          <button onClick={onClose} style={{ position: 'absolute', right: '16px', top: '14px', background: '#f5f5f5', border: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#525252', zIndex: 10 }}>
            <Icon icon="solar:close-circle-bold" width="22" />
          </button>

          {/* Image Swiper */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                borderRadius: '16px',
                aspectRatio: '1/1',
                backgroundColor: '#f9fafb'
              }}
            >
              {allImages.map((img, idx) => (
                <div key={idx} style={{ minWidth: '100%', scrollSnapAlign: 'start', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
            
            {/* Dots */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                {allImages.map((_, idx) => (
                  <div key={idx} style={{ width: currentImageIndex === idx ? '16px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: currentImageIndex === idx ? '#ea580c' : '#d1d5db', transition: 'all 0.3s' }} />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#000000', marginBottom: '8px', lineHeight: '1.4' }}>{name}</h2>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#ea580c' }}>Rp {displayPrice.toLocaleString('id-ID')}</span>
            <span style={{ fontSize: '14px', textDecoration: 'line-through', color: '#9ca3af' }}>Rp {markupPrice.toLocaleString('id-ID')}</span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff', backgroundColor: '#ea580c', padding: '2px 8px', borderRadius: '4px' }}>{discountPercent}% OFF</span>
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '13px', fontWeight: '800', color: '#525252', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pilih Varian:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      border: selectedVariant?.id === v.id ? '2px solid #ea580c' : '1px solid #e5e5e5',
                      backgroundColor: selectedVariant?.id === v.id ? '#fff7ed' : 'white',
                      color: selectedVariant?.id === v.id ? '#ea580c' : '#171717',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {getLocalized(v, 'variant_name') || v.variant_name || 'Standard'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', fontWeight: '800', color: '#525252', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jumlah:</p>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e5e5', borderRadius: '12px', width: 'fit-content', overflow: 'hidden' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px', color: '#000000' }}
              >
                -
              </button>
              <span style={{ width: '50px', textAlign: 'center', fontSize: '16px', fontWeight: '800', color: '#000000' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px', color: '#000000' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Full Link */}
          <Link 
            href={`/product/${product.productSlug}`}
            onClick={onClose}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              color: '#ea580c', textDecoration: 'none', fontSize: '14px', fontWeight: '700',
              padding: '12px', border: '1px solid #e5e5e5', borderRadius: '12px', marginBottom: '20px',
              backgroundColor: '#fafafa'
            }}
          >
            <span>Lihat Detail Lengkap</span> <Icon icon="solar:arrow-right-linear" width="18" />
          </Link>
        </div>

        {/* Footer Actions */}
        <div style={{ 
          position: 'absolute', bottom: 0, left: 0, width: '100%', 
          padding: '12px 16px calc(14px + env(safe-area-inset-bottom, 0px))', backgroundColor: 'white', 
          borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px',
          boxShadow: '0 -10px 20px rgba(0,0,0,0.03)'
        }}>
          <button 
            onClick={handleAddToCart}
            style={{ 
              flex: 1, backgroundColor: 'white', color: '#ea580c', 
              border: '2px solid #ea580c', padding: '14px', borderRadius: '14px', 
              fontSize: '14px', fontWeight: '800', cursor: 'pointer',
              minHeight: '48px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fff7ed')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            + Keranjang
          </button>
          <button 
            onClick={handleBuyNow}
            style={{ 
              flex: 1.4, backgroundColor: '#ea580c', color: '#ffffff', 
              border: 'none', padding: '14px', borderRadius: '14px', 
              fontSize: '14px', fontWeight: '800', cursor: 'pointer',
              minHeight: '48px',
              boxShadow: '0 6px 18px rgba(234,88,12,0.3)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
          >
            Beli Sekarang
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
