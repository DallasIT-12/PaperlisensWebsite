'use client';

import { useCart } from '../../context/CartContext';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartModal() {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, addToCart } = useCart();
  const [realRecommendations, setRealRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const router = useRouter();

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsCartOpen]);

  // Fetch real products from Supabase API when cart is open and empty
  useEffect(() => {
    if (!isCartOpen || cartItems.length > 0) return;

    if (realRecommendations.length === 0) {
      setLoadingRecs(true);
      fetch('/api/paperlisens/products')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            // Filter products with actual images and distinct names
            const valid = data.filter(
              (p) => p && p.image && !p.image.includes('placeholder') && p.price > 0
            );
            const seen = new Set();
            const unique: any[] = [];
            for (const item of valid) {
              if (!seen.has(item.name)) {
                seen.add(item.name);
                unique.push(item);
                if (unique.length >= 4) break;
              }
            }
            setRealRecommendations(unique.length > 0 ? unique : data.slice(0, 4));
          }
        })
        .catch(() => setRealRecommendations([]))
        .finally(() => setLoadingRecs(false));
    }
  }, [isCartOpen, cartItems.length, realRecommendations.length]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleGoToCatalog = () => {
    setIsCartOpen(false);
    router.push('/produk');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 3000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(3px)',
    }}>
      {/* Overlay Click to Close */}
      <div 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
        onClick={() => setIsCartOpen(false)}
      />

      {/* Modal Content (Bottom Sheet) */}
      <div style={{
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        maxHeight: '90dvh',
        position: 'relative',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px 24px 0 0',
        animation: 'slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}>
        {/* Drag Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', backgroundColor: '#ffffff' }}>
          <div style={{ width: '44px', height: '5px', borderRadius: '3px', backgroundColor: '#e5e5e5' }} />
        </div>

        {/* Header - Hitam & Putih dengan aksen Oranye */}
        <div style={{ padding: '8px 20px 14px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
              <Icon icon="solar:cart-large-minimalistic-bold" width="18" />
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#000000' }}>Keranjang Belanja</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)} 
            style={{ background: '#f5f5f5', border: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#525252', transition: 'all 0.2s' }}
            aria-label="Tutup Keranjang"
          >
            <Icon icon="solar:close-circle-bold" width="22" />
          </button>
        </div>

        {/* Items List / Empty State with Real Recommendations */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', backgroundColor: '#f9f9f9' }}>
          {cartItems.length === 0 ? (
            <div>
              {/* Empty state notice */}
              <div style={{ textAlign: 'center', padding: '24px 16px 20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#fff7ed', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#ea580c' }}>
                  <Icon icon="solar:cart-cross-bold" width="32" />
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '900', color: '#000000' }}>Keranjang Belanja Anda Kosong</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#525252' }}>Silakan pilih produk kemasan food grade pilihan di bawah ini:</p>
              </div>

              {/* Recommended Products Title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon icon="solar:fire-bold" className="text-orange-600" />
                  Rekomendasi Produk Asli Terlaris:
                </span>
                <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: '800' }}>Ready Stock</span>
              </div>

              {/* Recommended Products List (Real Data from Supabase) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loadingRecs ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#737373', fontSize: '13px' }}>
                    Memuat rekomendasi produk asli...
                  </div>
                ) : realRecommendations.length > 0 ? (
                  realRecommendations.map((rec) => {
                    const displayImg = rec.image || (Array.isArray(rec.images) && rec.images[0]) || '/placeholder.png';
                    const priceNum = Number(rec.price) || 0;

                    return (
                      <div
                        key={rec.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          backgroundColor: '#ffffff',
                          borderRadius: '14px',
                          border: '1px solid #e5e5e5',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                          <img
                            src={displayImg}
                            alt={rec.name}
                            style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', backgroundColor: '#f5f5f5', border: '1px solid #e5e5e5' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                          />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', color: '#ea580c', backgroundColor: '#fff7ed', padding: '1px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '2px' }}>
                              {rec.category || 'Paperlisens'}
                            </span>
                            <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: '700', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {rec.name}
                            </h4>
                            <div style={{ fontSize: '14px', fontWeight: '900', color: '#ea580c' }}>
                              Rp {priceNum.toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(rec, 1)}
                          style={{
                            marginLeft: '12px',
                            padding: '8px 14px',
                            backgroundColor: '#ea580c',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(234,88,12,0.25)',
                            transition: 'all 0.15s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                        >
                          <Icon icon="solar:add-circle-bold" width="16" />
                          <span>+ Tambah</span>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#737373', fontSize: '13px' }}>
                    Silakan buka katalog toko untuk melihat seluruh produk.
                  </div>
                )}
              </div>

              {/* View Full Catalog Button */}
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={handleGoToCatalog}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#171717')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
                >
                  <Icon icon="solar:shop-2-bold" width="18" className="text-orange-500" />
                  <span>Jelajahi Semua 500+ Produk di Toko</span>
                  <Icon icon="solar:arrow-right-linear" width="16" />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    gap: '14px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    padding: '14px', 
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ width: '74px', height: '74px', flexShrink: 0, backgroundColor: '#f9f9f9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: '#000000', lineHeight: '1.4', maxHeight: '36px', overflow: 'hidden' }}>
                      {item.name}
                    </h4>
                    {item.variantName && (
                      <div style={{ fontSize: '10px', color: '#ea580c', marginBottom: '6px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', display: 'inline-block', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                        {item.variantName}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <div style={{ color: '#ea580c', fontWeight: '900', fontSize: '15px' }}>
                        Rp {item.price.toLocaleString('id-ID')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d4d4d4', borderRadius: '8px', overflow: 'hidden', height: '28px', backgroundColor: '#f9f9f9' }}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '28px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#000000' }}
                            aria-label="Kurangi Jumlah"
                          >
                            -
                          </button>
                          <span style={{ width: '28px', textAlign: 'center', fontSize: '12px', fontWeight: '800', borderLeft: '1px solid #d4d4d4', borderRight: '1px solid #d4d4d4', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '28px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#000000' }}
                            aria-label="Tambah Jumlah"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#737373', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', transition: 'color 0.2s' }}
                          onMouseOver={(e) => (e.currentTarget.style.color = '#dc2626')}
                          onMouseOut={(e) => (e.currentTarget.style.color = '#737373')}
                          title="Hapus Produk"
                          aria-label="Hapus Produk"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" width="18" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: '16px 20px calc(16px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid #f0f0f0', backgroundColor: '#ffffff', boxShadow: '0 -4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '13px', color: '#525252', fontWeight: '600' }}>Total Pembayaran:</span>
              <span style={{ color: '#000000', fontSize: '20px', fontWeight: '900' }}>Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleCheckout}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#ea580c', 
                  color: '#ffffff', 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: '14px', 
                  fontSize: '15px', 
                  fontWeight: '800', 
                  cursor: 'pointer',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px', 
                  boxShadow: '0 6px 20px rgba(234,88,12,0.3)',
                  transition: 'background-color 0.2s',
                  minHeight: '48px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
              >
                <span>Lanjut ke Checkout</span>
                <Icon icon="solar:arrow-right-linear" width="18" />
              </button>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes slideInUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
