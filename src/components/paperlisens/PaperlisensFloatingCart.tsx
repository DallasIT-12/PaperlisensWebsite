'use client';

import { useCart } from '@/context/CartContext';
import { Icon } from '@iconify/react';
import ProductQuickView from '@/components/product/ProductQuickView';
import { usePathname } from 'next/navigation';

interface PaperlisensFloatingCartProps {
  quickViewProduct?: any;
  setQuickViewProduct?: (p: any) => void;
}

export default function PaperlisensFloatingCart({
  quickViewProduct,
  setQuickViewProduct
}: PaperlisensFloatingCartProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith('/product/');

  return (
    <>
      <style>{`
        .floating-cart-btn {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #ea580c;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(234, 88, 12, 0.45);
          cursor: pointer;
          z-index: 999;
          animation: bounceIn 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .floating-cart-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 10px 28px rgba(234, 88, 12, 0.55);
        }
        @media (max-width: 768px) {
          .floating-cart-btn {
            bottom: calc(${isProductPage ? '76px' : '84px'} + env(safe-area-inset-bottom, 0px));
            right: 16px;
            width: 50px;
            height: 50px;
          }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Floating Cart Button - Vibrant Orange & Pure Black */}
      {cartCount > 0 && (
        <div 
          onClick={() => setIsCartOpen(true)} 
          className="floating-cart-btn"
          aria-label="Buka Keranjang Belanja"
        >
          <Icon icon="solar:cart-large-minimalistic-bold" style={{ fontSize: '24px' }} />
          <span style={{
            position: 'absolute', 
            top: '-4px', 
            right: '-4px',
            backgroundColor: '#000000', 
            color: '#ffffff',
            fontSize: '11px', 
            fontWeight: '900', 
            borderRadius: '50%',
            width: '20px', 
            height: '20px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '2px solid white'
          }}>{cartCount}</span>
        </div>
      )}

      {/* Product Quick View */}
      {setQuickViewProduct && (
        <ProductQuickView 
          product={quickViewProduct} 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </>
  );
}
