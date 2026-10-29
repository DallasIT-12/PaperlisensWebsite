'use client';

import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Icon } from '@iconify/react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || '';
  const status = searchParams.get('status') || 'success';
  const isPending = status === 'pending';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', width: '100%', margin: '16px', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ background: isPending ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #40534c 0%, #1a3636 100%)', padding: '40px 24px', textAlign: 'center', color: '#fff' }}>
          <Icon icon={isPending ? 'mdi:clock-outline' : 'mdi:check-circle'} width="64" style={{ marginBottom: '16px', color: '#d6bd98' }} />
          <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '700' }}>
            {isPending ? 'Menunggu Pembayaran' : 'Pembayaran Berhasil!'}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            {isPending ? 'Silakan selesaikan pembayaran Anda' : 'Terima kasih telah berbelanja di Paperlisens'}
          </p>
        </div>

        <div style={{ padding: '24px' }}>
          {orderNumber && (
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>NOMOR PESANAN</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a3636', letterSpacing: '1px' }}>{orderNumber}</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link 
              href={`/track-order?q=${orderNumber}`} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                padding: '14px', 
                backgroundColor: '#d6bd98', 
                color: '#40534c', 
                borderRadius: '10px', 
                textDecoration: 'none', 
                fontWeight: '800', 
                fontSize: '15px',
                boxShadow: '0 4px 12px rgba(214, 189, 152, 0.2)'
              }}
            >
              <Icon icon="mdi:package-variant-closed" width="20" /> Lacak Pesanan
            </Link>
            <Link href="/paperlisens" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', border: '1px solid #40534c', color: '#40534c', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
              <Icon icon="mdi:shopping" width="18" /> Lanjut Belanja
            </Link>
            <a href={`https://wa.me/6281260001487?text=${encodeURIComponent(`Halo, saya ingin mengecek status pesanan ${orderNumber}`)}`} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', textDecoration: 'none', color: '#374151', fontWeight: '600', fontSize: '14px' }}>
              <Icon icon="mdi:whatsapp" width="18" style={{ color: '#25d366' }} /> Hubungi Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
