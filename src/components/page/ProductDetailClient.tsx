'use client';

import { useParams, useRouter } from 'next/navigation';
import { Product, customBoxProducts } from '@/data/customBoxProducts';
import ProductDetail from '@/components/product/ProductDetail';
import Footer from '@/components/layout/Footer';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const product = customBoxProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h1>Produk tidak ditemukan</h1>
        <button 
          onClick={() => router.back()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#001D39',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* We can include a simple header here if needed, but ProductDetail has a back button */}
        <div style={{ flexGrow: 1 }}>
            <ProductDetail 
                product={product} 
                onBack={() => router.back()} 
            />
        </div>
        <Footer />
    </div>
  );
}
