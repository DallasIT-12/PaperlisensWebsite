'use client';

import React from 'react';

// --- Responsive Styles for Product Detail ---
const ResponsiveStyles = () => (
  <style>{`
    @media (max-width: 768px) {
      .product-detail-container {
        padding: 16px !important;
      }
      .product-detail-layout {
        flex-direction: column !important;
      }
      .product-detail-title {
        font-size: 20px !important;
      }
      .product-detail-price {
        font-size: 28px !important;
      }
      .product-detail-buttons {
        flex-direction: column;
      }
    }
  `}</style>
);

// --- Self-Contained Product Detail using Inline Styles ---
const ProductDetail = ({ product, onBack }: { product: any; onBack: () => void; }) => {
  if (!product) return null;

  return (
    <div className="product-detail-container" style={{
      backgroundColor: 'white',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <ResponsiveStyles />
      <button
        onClick={onBack}
        style={{
          marginBottom: '24px',
          padding: '10px 16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: '#f0f0f0'
        }}
      >
        &larr; Kembali
      </button>

      <div className="product-detail-layout" style={{ display: 'flex', gap: '32px' }}>
        {/* Image Section */}
        <div style={{ flex: '1 1 40%' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              aspectRatio: '1',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}
          />
        </div>

        {/* Details Section */}
        <div style={{ flex: '1 1 60%' }}>
          <h1 className="product-detail-title" style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>{product.name}</h1>

          <div style={{
            backgroundColor: '#fafafa',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p className="product-detail-price" style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ee4d2d',
              margin: 0
            }}>
              <span style={{ fontSize: '20px' }}>Rp</span>
              {product.price.toLocaleString('id-ID')}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>Deskripsi Produk</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
              Ini adalah deskripsi untuk <strong>{product.name}</strong>.
              Produk ini memiliki kualitas terbaik dan harga yang terjangkau.
              Terjual lebih dari {product.sold} buah. Dibuat dengan bahan pilihan
              and proses yang modern.
            </p>
          </div>

          <div className="product-detail-buttons" style={{ display: 'flex', gap: '16px' }}>
            <button style={{
              flexGrow: 1,
              padding: '12px 24px',
              backgroundColor: 'rgba(238, 77, 45, 0.1)',
              color: '#ee4d2d',
              border: '1px solid #ee4d2d',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              🛒 Masukkan Keranjang
            </button>
            <button style={{
              flexGrow: 1,
              padding: '12px 24px',
              backgroundColor: '#ee4d2d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
