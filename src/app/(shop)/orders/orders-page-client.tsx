'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import UserMenu from '@/components/auth/UserMenu';
import { Link } from '@/i18n/routing';

const STATUS_TABS = [
  { key: 'processing', label: 'Menunggu Proses', icon: 'lucide:clock' },
  { key: 'shipped', label: 'Dikirim', icon: 'lucide:truck' },
  { key: 'completed', label: 'Selesai', icon: 'lucide:check-check' },
  { key: 'cancelled', label: 'Dibatalkan', icon: 'lucide:x-circle' },
];

const ORDER_STEPS = [
  { status: 'pending_payment', label: 'Diterima' },
  { status: 'paid', label: 'Dibayar' },
  { status: 'processing', label: 'Diproses' },
  { status: 'shipped', label: 'Dikirim' },
  { status: 'completed', label: 'Selesai' },
];

export default function OrdersPageClient() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('processing');
  const t = useTranslations();
  const pt = useTranslations('Paperlisens');

  const fetchOrders = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/my-orders?tab=${activeTab}`);
      const data = await res.json();
      setOrders(data.data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, activeTab]);

  const fmtRp = (n: number) => `Rp ${(n || 0).toLocaleString('id-ID')}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' }}>
      {/* Top Bar Contact Info & Social Media */}
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

      {/* Header / Navbar */}
      <header style={{ backgroundColor: '#40534c', padding: '16px 0', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="header-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/paperlisens" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/paperlisens.jpg" alt="Logo" className="header-logo" style={{ height: '40px' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <UserMenu />
          </div>
        </div>
      </header>

      <main style={{ padding: '40px 20px 60px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Page Title & Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <Link href="/paperlisens" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '12px',
            backgroundColor: '#ffffff', border: '1px solid #edf2f0',
            color: '#40534c', cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            textDecoration: 'none'
          }}
            title="Kembali ke Dashboard Paperlisens"
          >
            <Icon icon="mdi:arrow-left" style={{ fontSize: '20px' }} />
          </Link>
          <h1 style={{ color: '#1a3636', fontSize: '24px', fontWeight: '800', margin: 0 }}>Pesanan Saya</h1>
        </div>

        {/* Welcome Banner / Overview */}
        {status === 'authenticated' && (
          <div style={{
            background: 'linear-gradient(135deg, #40534c 0%, #1a3636 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: '#ffffff',
            marginBottom: '32px',
            boxShadow: '0 10px 25px rgba(26,54,54,0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background decorative patterns */}
            <div style={{
              position: 'absolute', right: '-30px', bottom: '-30px',
              width: '150px', height: '150px', borderRadius: '50%',
              background: 'rgba(214,189,152,0.1)', zIndex: 1
            }} />
            <div style={{
              position: 'absolute', right: '40px', top: '-20px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(214,189,152,0.05)', zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <span style={{
                backgroundColor: 'rgba(214,189,152,0.2)',
                color: '#d6bd98',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Dashboard Pelanggan
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '12px 0 6px', color: '#ffffff' }}>
                Selamat Datang, {session.user?.name || 'Pelanggan'}
              </h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: '1.5' }}>
                Pantau proses pembuatan, pengiriman, dan riwayat belanja Anda dengan mudah di satu tempat.
              </p>
            </div>
          </div>
        )}

        {status === 'unauthenticated' ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Icon icon="lucide:user-x" style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '18px', color: '#1a3636', marginBottom: '8px' }}>Masuk untuk melihat pesanan</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Anda dapat melacak pesanan tamu tanpa akun melalui halaman lacak pesanan.</p>
            <Link href="/track-order" style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              backgroundColor: '#40534c', color: '#d6bd98', padding: '12px 24px', 
              borderRadius: '12px', fontWeight: '700', textDecoration: 'none'
            }}>
              Lacak Pesanan Tamu <Icon icon="lucide:arrow-right" />
            </Link>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '20px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {STATUS_TABS.map(tab => (
                <button 
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', borderRadius: '14px', border: 'none',
                    backgroundColor: activeTab === tab.key ? '#40534c' : '#fff',
                    color: activeTab === tab.key ? '#d6bd98' : '#6b7280',
                    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                    whiteSpace: 'nowrap', transition: 'all 0.2s',
                    boxShadow: activeTab === tab.key ? '0 4px 12px rgba(64,83,76,0.2)' : '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <Icon icon={tab.icon} /> {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Icon icon="lucide:loader-2" style={{ fontSize: '32px', color: '#40534c', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Icon icon="lucide:inbox" style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
                <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px' }}>Belum ada pesanan di kategori ini</p>
                <Link href="/paperlisens" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  backgroundColor: '#40534c', color: '#d6bd98', padding: '12px 24px',
                  borderRadius: '12px', fontWeight: '700', textDecoration: 'none',
                  transition: 'all 0.2s'
                }}>
                  Mulai Belanja <Icon icon="lucide:arrow-right" />
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} fmtRp={fmtRp} fmtDate={fmtDate} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .back-text-full { display: none !important; }
          .back-text-short { display: inline !important; }
          .header-container { gap: 12px !important; padding: 0 12px !important; }
          .header-logo { height: 32px !important; }
        }
      `}</style>
    </div>
  );
}

function OrderCard({ order, fmtRp, fmtDate }: { order: any; fmtRp: any; fmtDate: any }) {
  const currentStep = ORDER_STEPS.findIndex(s => s.status === order.status);
  
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #edf2f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f0f4f2' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>{fmtDate(order.created_at)}</span>
          <h3 style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: '800', color: '#1a3636' }}>#{order.order_number}</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ 
            fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', 
            padding: '6px 12px', borderRadius: '20px', letterSpacing: '0.05em',
            backgroundColor: order.status === 'completed' ? '#ecfdf5' : order.status === 'cancelled' || order.status === 'expired' ? '#fef2f2' : '#eff6ff',
            color: order.status === 'completed' ? '#059669' : order.status === 'cancelled' || order.status === 'expired' ? '#dc2626' : '#2563eb'
          }}>
            {order.status === 'pending_payment' ? 'Menunggu Bayar' : 
             order.status === 'paid' ? 'Sudah Dibayar' : 
             order.status === 'processing' ? 'Diproses' : 
             order.status === 'shipped' ? 'Dikirim' : 
             order.status === 'completed' ? 'Selesai' : 
             order.status === 'expired' ? 'Expired' : 'Dibatalkan'}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {order.order_items?.slice(0, 2).map((item: any) => (
          <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#f3f4f6', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={item.image || '/LOGO 1.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product_name}</p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>{item.quantity} x {fmtRp(item.price)}</p>
            </div>
          </div>
        ))}
        {order.order_items?.length > 2 && (
          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>+ {order.order_items.length - 2} produk lainnya</p>
        )}
      </div>

      {/* Visual Stepper */}
      {order.status !== 'cancelled' && order.status !== 'expired' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '8px' }}>
            {/* Background Line */}
            <div style={{ position: 'absolute', top: '10px', left: '0', right: '0', height: '2px', backgroundColor: '#f1f5f9', zIndex: 0 }} />
            {/* Active Line */}
            <div style={{ 
              position: 'absolute', top: '10px', left: '0', 
              width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%`, 
              height: '2px', backgroundColor: '#40534c', zIndex: 1,
              transition: 'width 0.5s ease'
            }} />
            
            {ORDER_STEPS.map((step, idx) => {
              const isActive = idx <= currentStep;
              return (
                <div key={idx} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                  <div style={{ 
                    width: '20px', height: '20px', borderRadius: '50%', 
                    backgroundColor: isActive ? '#40534c' : '#fff',
                    border: `2px solid ${isActive ? '#40534c' : '#e2e8f0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}>
                    {isActive && <Icon icon="lucide:check" style={{ fontSize: '12px', color: '#d6bd98' }} />}
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: isActive ? '#1a3636' : '#9ca3af', marginTop: '6px', textAlign: 'center', textTransform: 'uppercase' }}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f0f4f2' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Total Pesanan</span>
          <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '800', color: '#40534c' }}>{fmtRp(order.total)}</p>
        </div>
        <Link href={`/track-order?q=${order.order_number}`} style={{ 
          backgroundColor: '#f8faf9', color: '#40534c', border: '1px solid #40534c',
          padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          Detail & Lacak <Icon icon="lucide:external-link" />
        </Link>
      </div>
    </div>
  );
}
