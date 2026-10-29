'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || '';
  const status = searchParams.get('status') || 'success';
  const isPending = status === 'pending';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', width: '100%', margin: '16px', backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', border: '1px solid #e5e5e5' }}>
        <div style={{ background: isPending ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', padding: '40px 24px', textAlign: 'center', color: '#fff' }}>
          <Icon icon={isPending ? 'solar:clock-circle-bold' : 'solar:check-circle-bold'} width="64" style={{ marginBottom: '16px', color: '#ffffff' }} />
          <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '800' }}>
            {isPending ? 'Menunggu Pembayaran' : 'Pembayaran Berhasil!'}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.95 }}>
            {isPending ? 'Silakan selesaikan pembayaran Anda' : 'Terima kasih telah berbelanja kemasan di Paperlisens'}
          </p>
        </div>

        <div style={{ padding: '24px' }}>
          {orderNumber && (
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '20px', border: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '4px', fontWeight: '700' }}>NOMOR PESANAN</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#000000', letterSpacing: '1px' }}>{orderNumber}</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link 
              href={`/orders?q=${orderNumber}`} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                padding: '14px', 
                backgroundColor: '#ea580c', 
                color: '#ffffff', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                fontWeight: '800', 
                fontSize: '15px',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
              }}
            >
              <Icon icon="solar:box-minimalistic-bold" width="20" /> Lacak Pesanan
            </Link>
            <Link href="/produk" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', border: '1.5px solid #e5e5e5', color: '#171717', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', backgroundColor: '#ffffff' }}>
              <Icon icon="solar:shop-2-bold" width="18" style={{ color: '#ea580c' }} /> Lanjut Belanja
            </Link>
            <a href={`https://wa.me/6281260001487?text=${encodeURIComponent(`Halo, saya ingin mengecek status pesanan ${orderNumber}`)}`} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', border: '1px solid #e5e5e5', borderRadius: '12px', textDecoration: 'none', color: '#374151', fontWeight: '600', fontSize: '14px' }}>
              <Icon icon="ri:whatsapp-fill" width="18" style={{ color: '#25d366' }} /> Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
