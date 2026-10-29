'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { Icon } from '@iconify/react';
import { Link, useRouter } from '@/i18n/routing';
import LoginModal from '@/components/auth/LoginModal';

// --- Store & Distance Config ---
const FREE_RADIUS_KM = 5;
const MAX_LOCAL_DELIVERY_KM = 25; // max range for local delivery

function calcLocalShippingCost(distanceKm: number, cartTotal: number): number {
  const extraKm = distanceKm > FREE_RADIUS_KM ? Math.ceil(distanceKm - FREE_RADIUS_KM) : 0;
  if (cartTotal >= 50000) {
    // ≥ Rp 50k: free up to 5km, then Rp 1,000/km
    return extraKm * 1000;
  } else {
    // < Rp 50k: Rp 3,000 base up to 5km, then + Rp 1,000/km
    return 3000 + (extraKm * 1000);
  }
}

export default function CheckoutClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');

  // Payment method: qris, bank_transfer, credit_card, cstore, paylater, direct_debit, or cod (COD only available for local delivery)
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'credit_card' | 'cstore' | 'paylater' | 'direct_debit' | 'cod'>('qris');

  // Shipping form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Discount states
  const [discountInfo, setDiscountInfo] = useState<{
    margin_pool: number;
    shipping_discount: number;
    final_shipping: number;
    product_discount: number;
  } | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  // Shipping options — declared before the discount useEffect that references selectedShipping
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [showAllCouriers, setShowAllCouriers] = useState(false);

  useEffect(() => {
    // Fetch discount info (margin pool) early when reaching Step 2
    if (step === 2 && cartItems.length > 0) {
      const fetchMargin = async () => {
        setDiscountLoading(true);
        try {
          const res = await fetch('/api/orders/calculate-discount', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cartItems.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price
              })),
              shippingCost: selectedShipping ? (parseInt(selectedShipping.price) || 0) : 0
            })
          });
          const data = await res.json();
          if (data.success) {
            setDiscountInfo({
              margin_pool: data.margin_pool || 0,
              shipping_discount: data.shipping_discount || 0,
              final_shipping: data.final_shipping || 0,
              product_discount: data.product_discount || 0
            });
          }
        } catch (e) {
          console.error('Error fetching discount info:', e);
        }
        setDiscountLoading(false);
      };
      fetchMargin();
    }
  }, [step, cartItems, selectedShipping?.price, selectedShipping?.code, selectedShipping?.service]);

  // Wilayah autocomplete
  const [wilayahQuery, setWilayahQuery] = useState('');
  const [wilayahResults, setWilayahResults] = useState<any[]>([]);
  const [wilayahLoading, setWilayahLoading] = useState(false);
  const [selectedWilayah, setSelectedWilayah] = useState<{ id: string; name: string; postal_code?: number } | null>(null);
  const [showWilayahDropdown, setShowWilayahDropdown] = useState(false);
  const wilayahTimeout = useRef<any>(null);


  // QRIS payment
  const [qrUrl, setQrUrl] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [midtransOrderId, setMidtransOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const pollingRef = useRef<any>(null);

  // QRIS countdown timer (5 minutes)
  const [countdown, setCountdown] = useState(300); // 300 seconds = 5 min
  const countdownRef = useRef<any>(null);

  // Distance for local delivery (auto-calculated from wilayah)
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [distanceLoading, setDistanceLoading] = useState(false);

  // Prefill from database when logged in
  useEffect(() => {
    if (session?.user) {
      // Start with session data as fallback
      setName(prev => prev || session.user?.name || '');
      setEmail(prev => prev || session.user?.email || '');
      // Then fetch full profile from DB (includes phone)
      fetch('/api/users/profile')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            if (data.name) setName(data.name);
            if (data.email) setEmail(data.email);
            if (data.phone) setPhone(data.phone);
          }
        })
        .catch(() => { }); // silently fail, session data is already set
    }
  }, [session]);

  // Geocode function — reusable
  const geocodeAddress = useCallback(async (query: string) => {
    setDistanceLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.roadDistanceKm !== null) {
        setDistanceKm(data.roadDistanceKm);
      } else {
        setDistanceKm(null);
      }
    } catch {
      setDistanceKm(null);
    }
    setDistanceLoading(false);
  }, []);

  // Auto-geocode when wilayah is selected (quick estimate using district name)
  // Only runs in background — result is used in Step 2
  useEffect(() => {
    if (!selectedWilayah?.name) { setDistanceKm(null); return; }
    geocodeAddress(selectedWilayah.name);
  }, [selectedWilayah, geocodeAddress]);

  // Local delivery pricing
  const localDeliveryCost = distanceKm !== null && distanceKm <= MAX_LOCAL_DELIVERY_KM
    ? calcLocalShippingCost(distanceKm, cartTotal)
    : null;

  // Wilayah search with debounce
  const searchWilayah = useCallback((q: string) => {
    if (wilayahTimeout.current) clearTimeout(wilayahTimeout.current);
    if (q.length < 3) { setWilayahResults([]); setShowWilayahDropdown(false); return; }
    setWilayahLoading(true);
    wilayahTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/wilayah?type=search&q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setWilayahResults(data.value || []);
        setShowWilayahDropdown(true);
      } catch { setWilayahResults([]); }
      setWilayahLoading(false);
    }, 400);
  }, []);

  // Fetch shipping costs
  const fetchShipping = async () => {
    if (!selectedWilayah) return;
    setShippingLoading(true);
    setShippingOptions([]);
    setShowAllCouriers(false);
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_area_id: selectedWilayah.id,
          destination_postal_code: parseInt(postalCode || '0') || selectedWilayah.postal_code,
          couriers: 'jne,jnt,sicepat,anteraja,ninja,lion,grab,gojek,paxel,sentral,pos,wahana,tiki,rpx',
          items: cartItems.map(item => ({
            name: item.name,
            value: item.price,
            weight: item.weight || 200,
            quantity: item.quantity,
            length: 10, width: 10, height: 10 // default dimensions
          }))
        })
      });
      const data = await res.json();
      if (data?.data?.costs) {
        setShippingOptions(data.data.costs);
      }
    } catch { /* ignore */ }
    setShippingLoading(false);
  };

  useEffect(() => {
    if (step === 2 && selectedWilayah) {
      fetchShipping();
      // Ensure distance is calculated (wilayah-level geocoding is accurate enough)
      if (distanceKm === null) {
        geocodeAddress(selectedWilayah.name);
      }
    }
  }, [step]);

  // Poll payment status
  useEffect(() => {
    if (paymentStatus === 'polling' && midtransOrderId) {
      // Start 5-min countdown
      setCountdown(300);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Poll Midtrans for payment status
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/payment/status?orderId=${midtransOrderId}`);
          const data = await res.json();
          if (data.data?.transactionStatus === 'settlement') {
            clearInterval(pollingRef.current);
            clearInterval(countdownRef.current);
            setPaymentStatus('success');
            clearCart();
            window.location.href = `/id/paperlisens/checkout/success?order=${midtransOrderId.replace('PL-', '')}`;
          } else if (data.data?.transactionStatus === 'expire' || data.data?.transactionStatus === 'cancel') {
            clearInterval(pollingRef.current);
            clearInterval(countdownRef.current);
            setPaymentStatus('expired');
          }
        } catch { }
      }, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [paymentStatus, midtransOrderId]);

  // Auto-expire when countdown hits 0
  useEffect(() => {
    if (countdown === 0 && paymentStatus === 'polling') {
      if (pollingRef.current) clearInterval(pollingRef.current);
      setPaymentStatus('expired');
    }
  }, [countdown, paymentStatus]);


  const sPrice = selectedShipping ? parseInt(selectedShipping.price) : 0;
  const sDisc = selectedShipping?.discount ? parseInt(selectedShipping.discount) : 0;
  const pDisc = selectedShipping ? Math.max(0, (discountInfo?.margin_pool || 0) - sDisc) : 0;
  const baseTotal = cartTotal + sPrice - pDisc;

  let adminFee = 0;
  if (paymentMethod === 'qris') {
    adminFee = Math.round(baseTotal * 0.007);
  } else if (paymentMethod === 'bank_transfer') {
    adminFee = 4000;
  } else if (paymentMethod === 'credit_card') {
    adminFee = Math.round(baseTotal * 0.029) + 2000;
  } else if (paymentMethod === 'cstore') {
    adminFee = 5000;
  } else if (paymentMethod === 'paylater') {
    adminFee = Math.round(baseTotal * 0.02);
  } else if (paymentMethod === 'direct_debit') {
    adminFee = 5000;
  }

  const grandTotal = baseTotal + adminFee;

  // Snap URL based on environment
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' || process.env.MIDTRANS_IS_PRODUCTION === 'true';
  const snapJsUrl = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';

  // Load Snap JS
  useEffect(() => {
    const script = document.createElement('script');
    script.src = snapJsUrl;
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [snapJsUrl]);

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');
    try {
      const cityName = selectedWilayah?.name?.split(',')[1]?.trim() || selectedWilayah?.name || '';

      const sDisc = selectedShipping?.discount ? parseInt(selectedShipping.discount) : 0;
      const pDisc = selectedShipping ? Math.max(0, (discountInfo?.margin_pool || 0) - sDisc) : 0;
      const finalShipping = selectedShipping ? parseInt(selectedShipping.price) : 0;
      const originalShipping = selectedShipping?.originalPrice ? parseInt(selectedShipping.originalPrice) : finalShipping;

      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.productId, id: item.id, name: item.name,
          variantId: item.variantId, variantName: item.variantName,
          price: item.price, quantity: item.quantity, image: item.image,
          weight: item.weight || 200,
        })),
        customer: {
          name, phone, email, address,
          city: cityName,
          district: selectedWilayah?.name?.split(',')[0]?.trim() || '',
          province: selectedWilayah?.name?.split(',')[2]?.trim() || '',
          postalCode: postalCode || selectedWilayah?.postal_code?.toString() || ''
        },
        shippingCost: finalShipping,
        shippingDiscount: sDisc,
        productDiscount: pDisc,
        originalShippingCost: originalShipping,
        shippingCourier: selectedShipping?.code || '',
        shippingService: selectedShipping?.service || '',
        shippingEtd: selectedShipping?.estimated || '',
        courierCode: selectedShipping?.code || '',
        courierServiceCode: selectedShipping?.service_code || '',
        destinationAreaId: selectedWilayah?.id || '',
        userId: session?.user?.id || null,
        notes,
        paymentMethod, // 'qris' or 'cod'
        adminFee,
      };

      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat pesanan');

      if (paymentMethod === 'cod') {
        const orderNum = data.data?.orderNumber || data.data?.orderId || '';
        clearCart();
        window.location.href = `/id/paperlisens/checkout/success?order=${orderNum}&method=cod`;
      } else {
        // Use Midtrans Snap
        if (data.data?.snapToken) {
          (window as any).snap.pay(data.data.snapToken, {
            onSuccess: (result: any) => {
              clearCart();
              window.location.href = `/id/paperlisens/checkout/success?order=${data.data.orderNumber}`;
            },
            onPending: (result: any) => {
              // Redirect to order page or show pending status
              window.location.href = `/id/paperlisens/checkout/success?order=${data.data.orderNumber}&status=pending`;
            },
            onError: (result: any) => {
              setError('Pembayaran gagal. Silakan coba lagi.');
            },
            onClose: () => {
              setIsLoading(false);
            }
          });
        } else {
          throw new Error('Sistem pembayaran (Snap) tidak tersedia.');
        }
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Icon icon="mdi:cart-off" width="64" style={{ color: '#9ca3af', marginBottom: '16px' }} />
          <h2 style={{ color: '#374151', marginBottom: '8px' }}>Keranjang Kosong</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Tambahkan produk ke keranjang terlebih dahulu</p>
          <Link href="/paperlisens" style={{ backgroundColor: '#40534c', color: '#d6bd98', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>Belanja Sekarang</Link>
        </div>
      </div>
    );
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#40534c', padding: '16px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              if (step > 1) {
                setStep(step - 1);
                if (step === 4) setPaymentStatus('idle');
              } else {
                router.back();
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#d6bd98',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              padding: 0
            }}
          >
            <Icon icon="mdi:arrow-left" width="20" /> Kembali
          </button>
          <h1 style={{ margin: 0, color: '#d6bd98', fontSize: '18px', fontWeight: '700' }}>Checkout</h1>
        </div>
      </div>

      {/* Steps Indicator */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {['Alamat', 'Pengiriman', 'Pembayaran'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', backgroundColor: step > i + 1 ? '#40534c' : step === i + 1 ? '#40534c' : '#e5e7eb', color: step >= i + 1 ? '#fff' : '#9ca3af' }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '13px', fontWeight: step === i + 1 ? '700' : '400', color: step === i + 1 ? '#40534c' : '#9ca3af' }}>{label}</span>
              {i < 2 && <div style={{ width: '30px', height: '2px', backgroundColor: step > i + 1 ? '#40534c' : '#e5e7eb' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px 40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Left: Form Steps */}
        <div>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon icon="mdi:alert-circle" width="18" />{error}
            </div>
          )}

          {/* STEP 1: Address */}
          {step === 1 && (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#1a3636', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon="mdi:map-marker" width="22" style={{ color: '#40534c' }} /> Alamat Pengiriman
              </h2>

              {!session && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#166534' }}>Punya akun? Login untuk pengalaman lebih baik</span>
                  <button onClick={() => setShowLogin(true)} style={{ backgroundColor: '#40534c', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Masuk</button>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Nama Penerima *</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>No. Telepon *</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Email *</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" type="email" style={inputStyle} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Alamat Lengkap *</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Jalan, No. Rumah, RT/RW" rows={3} style={{ ...inputStyle, resize: 'vertical' }} required />
                </div>
                <div style={{ gridColumn: '1 / -1', position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Kota / Kecamatan * <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '400' }}>(ketik min. 3 huruf)</span></label>
                  <div style={{ position: 'relative' }}>
                    <input value={wilayahQuery} onChange={e => { setWilayahQuery(e.target.value); searchWilayah(e.target.value); if (selectedWilayah) setSelectedWilayah(null); }} onFocus={() => { if (wilayahResults.length > 0) setShowWilayahDropdown(true); }} placeholder="Ketik nama kota, contoh: Kediri..." style={{ ...inputStyle, paddingRight: '36px' }} required />
                    {wilayahLoading && <Icon icon="mdi:loading" width="18" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', animation: 'spin 1s linear infinite', color: '#9ca3af' }} />}
                  </div>
                  {showWilayahDropdown && wilayahResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {wilayahResults.map((w: any) => (
                        <div key={w.id} onClick={() => { setSelectedWilayah(w); setWilayahQuery(w.name); setShowWilayahDropdown(false); }} style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6' }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fdf4')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}>
                          <Icon icon="mdi:map-marker" width="14" style={{ color: '#40534c', marginRight: '6px', verticalAlign: 'middle' }} />{w.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedWilayah && <div style={{ marginTop: '6px', fontSize: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}><Icon icon="mdi:check-circle" width="14" /> Wilayah dipilih: {selectedWilayah.name}</div>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Kode Pos</label>
                  <input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="64211" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#374151' }}>Catatan (opsional)</label>
                  <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Catatan untuk penjual" style={inputStyle} />
                </div>
              </div>


              <button onClick={() => {
                if (!name || !phone || !email || !address || !selectedWilayah) { setError('Mohon lengkapi nama, telepon, email, alamat, dan pilih wilayah'); return; }
                setError('');
                setStep(2);
              }} style={{ width: '100%', marginTop: '20px', padding: '14px', backgroundColor: '#40534c', color: '#d6bd98', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                Lanjut Pilih Pengiriman →
              </button>
            </div>
          )}

          {/* STEP 2: Shipping */}
          {step === 2 && (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#1a3636', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon="mdi:truck-delivery" width="22" style={{ color: '#40534c' }} /> Pilih Pengiriman
              </h2>

              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#374151' }}>
                <strong>Kirim ke:</strong> {name} — {address}, {selectedWilayah?.name || ''}
              </div>
              {/* Distance & Local Delivery */}
              {distanceLoading && (
                <div style={{ padding: '14px 16px', backgroundColor: '#fefce8', borderRadius: '10px', marginBottom: '10px', fontSize: '13px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon icon="mdi:loading" width="18" style={{ animation: 'spin 1s linear infinite' }} /> Menghitung jarak untuk pengiriman lokal...
                </div>
              )}

              {/* Instant Local Delivery Option */}
              {!distanceLoading && distanceKm !== null && distanceKm <= MAX_LOCAL_DELIVERY_KM && (() => {
                const originalPrice = localDeliveryCost || 0;
                const discount = Math.min(discountInfo?.margin_pool || 0, originalPrice);
                const finalPrice = originalPrice - discount;
                const isFree = finalPrice === 0;

                return (
                  <div onClick={() => setSelectedShipping({ code: 'local', service: 'Pengiriman Lokal Kediri', price: String(finalPrice), originalPrice: String(originalPrice), discount: String(discount), estimated: 'Hari ini', distance: distanceKm })} style={{
                    border: selectedShipping?.code === 'local' ? '2px solid #40534c' : '1px solid #bbf7d0',
                    borderRadius: '10px', padding: '14px 16px', cursor: 'pointer',
                    backgroundColor: selectedShipping?.code === 'local' ? '#f0fdf4' : '#fefce8',
                    transition: 'all 0.2s', marginBottom: '10px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon icon="mdi:motorbike" width="22" style={{ color: '#40534c' }} />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636' }}>Pengiriman Lokal Kediri</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>Jarak: {distanceKm} km • Estimasi hari ini</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {discount > 0 && <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af', textDecoration: 'line-through', marginBottom: '2px' }}>Rp {originalPrice.toLocaleString('id-ID')}</span>}
                        {isFree ? (
                          <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '14px' }}>GRATIS ✨</span>
                        ) : (
                          <span style={{ fontWeight: '700', color: '#40534c', fontSize: '14px' }}>Rp {finalPrice.toLocaleString('id-ID')}</span>
                        )}
                      </div>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0fdf4', border: '1px dashed #22c55e', borderRadius: '4px', padding: '2px 8px', marginTop: '6px' }}>
                        <Icon icon="mdi:ticket-percent" width="14" style={{ color: '#16a34a' }} />
                        <span style={{ fontSize: '11px', color: '#166534', fontWeight: '800' }}>DISKON ONGKIR OTOMATIS</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>atau kirim via kurir</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              </div>

              {shippingLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <Icon icon="mdi:loading" width="32" style={{ animation: 'spin 1s linear infinite' }} />
                  <p>Menghitung ongkos kirim...</p>
                </div>
              ) : shippingOptions.length > 0 ? (
                (() => {
                  const getOptionDays = (opt: any) => {
                    if (!opt.estimated) return 99;
                    const match = opt.estimated.match(/\d+/);
                    return match ? parseInt(match[0]) : 99;
                  };

                  const processedOptions = shippingOptions.map(opt => {
                    const originalPrice = parseInt(opt.price);
                    const discount = Math.min(discountInfo?.margin_pool || 0, originalPrice);
                    const finalPrice = originalPrice - discount;
                    const days = getOptionDays(opt);
                    return { ...opt, originalPrice, discount, finalPrice, days };
                  });

                  if (processedOptions.length === 0) return null;

                  // Find cheapest
                  let cheapestOpt = processedOptions[0];
                  for (const opt of processedOptions) {
                    if (opt.finalPrice < cheapestOpt.finalPrice) {
                      cheapestOpt = opt;
                    }
                  }

                  // Find fastest
                  let fastestOpt = processedOptions[0];
                  for (const opt of processedOptions) {
                    if (opt.days < fastestOpt.days) {
                      fastestOpt = opt;
                    } else if (opt.days === fastestOpt.days && opt.finalPrice < fastestOpt.finalPrice) {
                      fastestOpt = opt;
                    }
                  }

                  const isSame = cheapestOpt.code === fastestOpt.code && cheapestOpt.service === fastestOpt.service;
                  const recommended = isSame ? [cheapestOpt] : [cheapestOpt, fastestOpt];

                  const recKeys = new Set(recommended.map(r => `${r.code}-${r.service}`));
                  const otherOptions = processedOptions.filter(o => !recKeys.has(`${o.code}-${o.service}`));
                  const sortedOther = [...otherOptions].sort((a, b) => a.finalPrice - b.finalPrice);

                  const visibleOther = showAllCouriers ? sortedOther : sortedOther.slice(0, 3);

                  const renderCard = (opt: any, label?: string) => {
                    const isFree = opt.finalPrice === 0;
                    const isSelected = selectedShipping?.code === opt.code && selectedShipping?.service === opt.service;

                    return (
                      <div 
                        key={`${opt.code}-${opt.service}`} 
                        onClick={() => setSelectedShipping({
                          ...opt,
                          price: String(opt.finalPrice),
                          originalPrice: String(opt.originalPrice),
                          discount: String(opt.discount)
                        })} 
                        style={{
                          border: isSelected ? '2px solid #40534c' : (label ? '1.5px solid #d6bd98' : '1px solid #e5e7eb'),
                          borderRadius: '12px', 
                          padding: '16px', 
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#f0fdf4' : '#fff',
                          transition: 'all 0.2s',
                          position: 'relative',
                          boxShadow: label ? '0 4px 12px rgba(64,83,76,0.06)' : 'none',
                          marginTop: label ? '8px' : '0'
                        }}
                      >
                        {label && (
                          <div style={{
                            position: 'absolute', 
                            top: '-10px', 
                            left: '16px',
                            backgroundColor: '#d6bd98', 
                            color: '#1a3636',
                            fontSize: '9px', 
                            fontWeight: '800', 
                            padding: '2px 8px',
                            borderRadius: '10px', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            zIndex: 2
                          }}>
                            {label}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636', textTransform: 'uppercase' }}>{opt.code}</span>
                            <span style={{ marginLeft: '8px', fontSize: '13px', color: '#6b7280' }}>{opt.service}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {opt.discount > 0 && <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af', textDecoration: 'line-through', marginBottom: '2px' }}>Rp {opt.originalPrice.toLocaleString('id-ID')}</span>}
                            {isFree ? (
                              <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '15px' }}>GRATIS ✨</span>
                            ) : (
                              <span style={{ fontWeight: '700', color: '#40534c', fontSize: '15px' }}>Rp {opt.finalPrice.toLocaleString('id-ID')}</span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Estimasi: {opt.estimated} hari</div>
                          {opt.discount > 0 && (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0fdf4', border: '1px dashed #22c55e', borderRadius: '4px', padding: '2px 8px' }}>
                              <Icon icon="mdi:ticket-percent" width="12" style={{ color: '#16a34a' }} />
                              <span style={{ fontSize: '10px', color: '#166534', fontWeight: '800' }}>HEMAT Rp {opt.discount.toLocaleString('id-ID')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Recommended section header */}
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#40534c', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <Icon icon="mdi:thumb-up" style={{ color: '#d6bd98', fontSize: '16px' }} /> Rekomendasi Kami
                      </div>
                      {recommended.map(r => {
                        let label = 'Rekomendasi';
                        if (isSame) {
                          label = 'Termurah & Tercepat 🔥';
                        } else if (r.code === cheapestOpt.code && r.service === cheapestOpt.service) {
                          label = 'Paling Hemat 💰';
                        } else {
                          label = 'Paling Cepat ⚡';
                        }
                        return renderCard(r, label);
                      })}

                      {sortedOther.length > 0 && (
                        <>
                          {/* Other couriers section header */}
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                            <Icon icon="mdi:truck-delivery-outline" style={{ fontSize: '16px' }} /> Opsi Pengiriman Lainnya
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {visibleOther.map(o => renderCard(o))}
                          </div>
                          {sortedOther.length > 3 && (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                setShowAllCouriers(!showAllCouriers);
                              }}
                              style={{
                                alignSelf: 'center',
                                backgroundColor: 'transparent',
                                border: '1px solid #40534c',
                                color: '#40534c',
                                padding: '8px 24px',
                                borderRadius: '50px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#40534c';
                                e.currentTarget.style.color = '#fff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#40534c';
                              }}
                            >
                              {showAllCouriers ? (
                                <>Sembunyikan Kurir Lainnya <Icon icon="mdi:chevron-up" /></>
                              ) : (
                                <>Lihat Kurir Lainnya ({sortedOther.length - 3} Opsi) <Icon icon="mdi:chevron-down" /></>
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>
                  <p style={{ margin: '0 0 8px' }}>Ongkir via kurir belum tersedia. Mohon coba lagi atau hubungi admin.</p>
                  <button onClick={fetchShipping} style={{ backgroundColor: '#40534c', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}>Coba Lagi</button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '10px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#374151' }}>← Kembali</button>
                <button onClick={() => {
                  if (!selectedShipping) { setError('Pilih metode pengiriman'); return; }
                  setError(''); setStep(3);
                }} disabled={!selectedShipping} style={{ flex: 2, padding: '12px', backgroundColor: selectedShipping ? '#40534c' : '#d1d5db', color: selectedShipping ? '#d6bd98' : '#9ca3af', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: selectedShipping ? 'pointer' : 'not-allowed' }}>
                  Lanjut Pembayaran →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px', color: '#1a3636', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon="mdi:credit-card" width="22" style={{ color: '#40534c' }} /> Konfirmasi & Bayar
              </h2>

              {/* Address Summary */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '600' }}>ALAMAT PENGIRIMAN</div>
                <div style={{ fontSize: '14px', color: '#1a3636', fontWeight: '600' }}>{name}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{phone}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{address}, {selectedWilayah?.name || ''} {postalCode}</div>
              </div>

              {/* Shipping Summary */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '600' }}>PENGIRIMAN</div>
                {selectedShipping?.code === 'local' ? (
                  <div>
                    <div style={{ fontSize: '14px', color: '#1a3636', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon icon="mdi:motorbike" width="18" /> Pengiriman Lokal Kediri
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Jarak: {selectedShipping.distance} km • Estimasi hari ini • {parseInt(selectedShipping.price) === 0 ? 'GRATIS' : `Rp ${parseInt(selectedShipping.price).toLocaleString('id-ID')}`}</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '14px', color: '#1a3636' }}>
                      <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>{selectedShipping?.code}</span> — {selectedShipping?.service}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Estimasi {selectedShipping?.estimated} hari • Rp {parseInt(selectedShipping?.price || 0).toLocaleString('id-ID')}</div>
                  </div>
                )}
              </div>

              {/* Items Summary */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontWeight: '600' }}>PRODUK ({cartItems.length})</div>
                {cartItems.map(item => {
                  const markupPrice = Math.ceil(item.price / 0.9);
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <img src={item.image} alt="" style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a3636', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {item.quantity}x <span style={{ textDecoration: 'line-through', marginRight: '4px' }}>Rp {markupPrice.toLocaleString('id-ID')}</span>
                          <span style={{ color: '#40534c', fontWeight: '600' }}>Rp {item.price.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#40534c' }}>
                        <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px', fontSize: '11px' }}>Rp {(markupPrice * item.quantity).toLocaleString('id-ID')}</span>
                        <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {notes && <div style={{ backgroundColor: '#fffbeb', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}><strong>Catatan:</strong> {notes}</div>}

              {/* Payment Method Selection */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontWeight: '600' }}>METODE PEMBAYARAN</div>

                {/* 1. QRIS - always available */}
                <div onClick={() => setPaymentMethod('qris')} style={{
                  border: paymentMethod === 'qris' ? '2px solid #40534c' : '1px solid #e5e7eb',
                  borderRadius: '10px', padding: '14px 16px', cursor: 'pointer',
                  backgroundColor: paymentMethod === 'qris' ? '#f0fdf4' : '#fff',
                  transition: 'all 0.2s', marginBottom: '8px',
                  position: 'relative'
                }}>
                  {/* Recommended Badge */}
                  <div style={{
                    position: 'absolute', top: '-10px', right: '16px',
                    backgroundColor: '#d6bd98', color: '#1a3636',
                    fontSize: '9px', fontWeight: '800', padding: '2px 8px',
                    borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 2
                  }}>
                    Rekomendasi: Terhemat 👍
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon icon="mdi:qrcode" width="22" style={{ color: '#40534c' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636' }}>QRIS / E-Wallet</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Scan QRIS via GoPay, OVO, DANA, ShopeePay, LinkAja, dll</div>
                      <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700', marginTop: '4px' }}>
                        Biaya Admin: 0.7% (+Rp {Math.round(baseTotal * 0.007).toLocaleString('id-ID')})
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Bank Transfer / VA - always available */}
                <div onClick={() => setPaymentMethod('bank_transfer')} style={{
                  border: paymentMethod === 'bank_transfer' ? '2px solid #40534c' : '1px solid #e5e7eb',
                  borderRadius: '10px', padding: '14px 16px', cursor: 'pointer',
                  backgroundColor: paymentMethod === 'bank_transfer' ? '#f0fdf4' : '#fff',
                  transition: 'all 0.2s', marginBottom: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon icon="mdi:bank-transfer" width="22" style={{ color: '#40534c' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636' }}>Transfer Bank / Virtual Account (VA)</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>BCA, Mandiri, BNI, BRI, Permata, dll (Verifikasi Otomatis)</div>
                      <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                        Biaya Admin: Rp 4.000 (Flat)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Kartu Kredit / Debit - always available */}
                <div onClick={() => setPaymentMethod('credit_card')} style={{
                  border: paymentMethod === 'credit_card' ? '2px solid #40534c' : '1px solid #e5e7eb',
                  borderRadius: '10px', padding: '14px 16px', cursor: 'pointer',
                  backgroundColor: paymentMethod === 'credit_card' ? '#f0fdf4' : '#fff',
                  transition: 'all 0.2s', marginBottom: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon icon="mdi:credit-card" width="22" style={{ color: '#40534c' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636' }}>Kartu Kredit / Debit</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Bayar via Kartu Visa, MasterCard, JCB, Amex</div>
                      <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                        Biaya Admin: 2.9% + Rp 2.000 (+Rp {(Math.round(baseTotal * 0.029) + 2000).toLocaleString('id-ID')})
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Minimarket - always available */}
                <div onClick={() => setPaymentMethod('cstore')} style={{
                  border: paymentMethod === 'cstore' ? '2px solid #40534c' : '1px solid #e5e7eb',
                  borderRadius: '10px', padding: '14px 16px', cursor: 'pointer',
                  backgroundColor: paymentMethod === 'cstore' ? '#f0fdf4' : '#fff',
                  transition: 'all 0.2s', marginBottom: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon icon="mdi:storefront" width="22" style={{ color: '#40534c' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636' }}>Gerai Retail / Minimarket</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Bayar tunai di kasir Alfamart, Alfamidi, Indomaret, dll</div>
                      <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                        Biaya Admin: Rp 5.000 (Flat)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. PayLater - always available */}
                <div onClick={() => setPaymentMethod('paylater')} style={{
                  border: paymentMethod === 'paylater' ? '2px solid #40534c' : '1px solid #e5e7eb',
                  borderRadius: '10px', padding: '14px 16px', cursor: 'pointer',
                  backgroundColor: paymentMethod === 'paylater' ? '#f0fdf4' : '#fff',
                  transition: 'all 0.2s', marginBottom: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon icon="mdi:cash-clock" width="22" style={{ color: '#40534c' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636' }}>Cicilan Tanpa Kartu (PayLater)</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Kredivo, Akulaku PayLater</div>
                      <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                        Biaya Admin: 2% (+Rp {Math.round(baseTotal * 0.02).toLocaleString('id-ID')})
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Debit Langsung / Internet Banking - always available */}
                <div onClick={() => setPaymentMethod('direct_debit')} style={{
                  border: paymentMethod === 'direct_debit' ? '2px solid #40534c' : '1px solid #e5e7eb',
                  borderRadius: '10px', padding: '14px 16px', cursor: 'pointer',
                  backgroundColor: paymentMethod === 'direct_debit' ? '#f0fdf4' : '#fff',
                  transition: 'all 0.2s', marginBottom: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon icon="mdi:bank" width="22" style={{ color: '#40534c' }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636' }}>Debit Langsung / Internet Banking</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>BCA KlikPay, KlikBCA, CIMB Clicks, Danamon Online, dll</div>
                      <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                        Biaya Admin: Rp 5.000 (Flat)
                      </div>
                    </div>
                  </div>
                </div>

                {/* COD - only for local delivery */}
                {selectedShipping?.code === 'local' && (
                  <div onClick={() => setPaymentMethod('cod')} style={{
                    border: paymentMethod === 'cod' ? '2px solid #40534c' : '1px solid #e5e7eb',
                    borderRadius: '10px', padding: '14px 16px', cursor: 'pointer',
                    backgroundColor: paymentMethod === 'cod' ? '#f0fdf4' : '#fff',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon icon="mdi:cash-multiple" width="22" style={{ color: '#40534c' }} />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a3636' }}>Bayar di Tempat (COD)</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>Bayar tunai saat barang diterima</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: QRIS QR Code Display */}
          {step === 4 && (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: '#1a3636', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Icon icon="mdi:qrcode-scan" width="22" style={{ color: '#40534c' }} /> Scan QRIS untuk Bayar
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Scan QR code di bawah menggunakan aplikasi e-wallet atau m-Banking Anda</p>

              {paymentStatus === 'expired' ? (
                <div style={{ padding: '40px 20px' }}>
                  <Icon icon="mdi:timer-off" width="48" style={{ color: '#dc2626', marginBottom: '12px' }} />
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626', marginBottom: '8px' }}>QR Code Sudah Expired</p>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Batas waktu 5 menit telah habis. Silakan ulangi proses pembayaran.</p>
                  <button onClick={() => { setStep(3); setPaymentStatus('idle'); setQrUrl(''); setCountdown(300); }} style={{ padding: '12px 32px', backgroundColor: '#40534c', color: '#d6bd98', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Coba Lagi</button>
                </div>
              ) : (
                <>
                  {qrUrl && <img src={qrUrl} alt="QRIS QR Code" style={{ width: '280px', height: '280px', margin: '0 auto 16px', borderRadius: '12px', border: '2px solid #e5e7eb' }} />}

                  {/* Countdown Timer */}
                  <div style={{ backgroundColor: countdown <= 60 ? '#fef2f2' : '#fffbeb', border: `1px solid ${countdown <= 60 ? '#fecaca' : '#fde68a'}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Icon icon="mdi:timer-outline" width="20" style={{ color: countdown <= 60 ? '#dc2626' : '#d97706' }} />
                    <span style={{ fontSize: '16px', fontWeight: '700', color: countdown <= 60 ? '#dc2626' : '#d97706', fontFamily: 'monospace' }}>
                      {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '12px', color: countdown <= 60 ? '#dc2626' : '#92400e' }}>tersisa</span>
                  </div>

                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Icon icon="mdi:loading" width="18" style={{ animation: 'spin 1s linear infinite', color: '#16a34a' }} />
                    <span style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>Menunggu pembayaran...</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>Pembayaran akan otomatis terkonfirmasi setelah Anda scan dan bayar</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
                    {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja', 'm-Banking'].map(w => (
                      <span key={w} style={{ fontSize: '10px', backgroundColor: '#f3f4f6', padding: '3px 8px', borderRadius: '4px', color: '#6b7280' }}>{w}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div style={{ alignSelf: 'start', position: 'sticky', top: '80px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#1a3636', fontWeight: '700' }}>Ringkasan Pesanan</h3>
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              borderRadius: '8px', 
              padding: '10px 12px', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#166534',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              <Icon icon="mdi:ticket-percent" width="20" style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>Anda Mendapatkan Diskon Ongkir 10% Otomatis!</span>
            </div>
            {cartItems.map(item => {
              const markupPrice = Math.ceil(item.price / 0.9);
              return (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#374151' }}>
                  <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name} ×{item.quantity}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px', fontSize: '11px' }}>Rp {(markupPrice * item.quantity).toLocaleString('id-ID')}</span>
                    <span style={{ fontWeight: '600' }}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ borderTop: '1px solid #e5e7eb', margin: '12px 0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                <span>Subtotal</span>
                <div>
                  <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '6px', fontSize: '11px' }}>Rp {Math.ceil(cartTotal / 0.9).toLocaleString('id-ID')}</span>
                  <span style={{ fontWeight: '600', color: '#1a3636' }}>Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                <span>Ongkir</span>
                <div style={{ textAlign: 'right' }}>
                  {selectedShipping?.discount && parseInt(selectedShipping.discount) > 0 ? (
                    <>
                      <span style={{ textDecoration: 'line-through', fontSize: '11px', marginRight: '6px', opacity: 0.6 }}>Rp {parseInt(selectedShipping.originalPrice).toLocaleString('id-ID')}</span>
                      <span style={{ color: parseInt(selectedShipping.price) === 0 ? '#16a34a' : 'inherit', fontWeight: parseInt(selectedShipping.price) === 0 ? '700' : 'inherit' }}>
                        {parseInt(selectedShipping.price) === 0 ? 'GRATIS' : `Rp ${parseInt(selectedShipping.price).toLocaleString('id-ID')}`}
                      </span>
                    </>
                  ) : (
                    <span>{selectedShipping ? `Rp ${parseInt(selectedShipping.price).toLocaleString('id-ID')}` : '-'}</span>
                  )}
                </div>
              </div>

              {/* Product Discount (Excess Margin) */}
              {selectedShipping && (discountInfo?.margin_pool || 0) > (selectedShipping.discount ? parseInt(selectedShipping.discount) : 0) && (() => {
                const pDisc = (discountInfo?.margin_pool || 0) - (selectedShipping.discount ? parseInt(selectedShipping.discount) : 0);
                if (pDisc <= 0) return null;
                return (
                  <div style={{
                    border: '1.5px dashed #d6bd98', borderRadius: '10px',
                    padding: '10px 14px', backgroundColor: '#fffbeb',
                    marginTop: '12px', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon icon="mdi:ticket-percent" width="20" style={{ color: '#d97706' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#1a3636' }}>DISKON ONGKIR (SISA)</div>
                        <div style={{ fontSize: '10px', color: '#92400e' }}>Sisa diskon ongkir otomatis dipotong ke produk</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: '#16a34a' }}>-Rp {pDisc.toLocaleString('id-ID')}</span>
                  </div>
                );
              })()}
            </div>

            {/* Admin Fee */}
            {adminFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '8px', padding: '0 4px' }}>
                <span>
                  {paymentMethod === 'bank_transfer' ? 'Biaya Admin (Transfer Bank)' :
                   paymentMethod === 'credit_card' ? 'Biaya Admin (Kartu Kredit)' :
                   paymentMethod === 'cstore' ? 'Biaya Admin (Gerai Minimarket)' :
                   paymentMethod === 'paylater' ? 'Biaya Admin (PayLater)' :
                   paymentMethod === 'direct_debit' ? 'Biaya Admin (Internet Banking)' :
                   'Biaya Admin (QRIS 0.7%)'}
                </span>
                <span>Rp {adminFee.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div style={{ borderTop: '2px solid #40534c', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: '#1a3636' }}>
              <span>Total</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#40534c', fontSize: '20px', fontWeight: '900' }}>Rp {grandTotal.toLocaleString('id-ID')}</span>
                {(sDisc > 0 || pDisc > 0) && (
                  <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700', marginTop: '2px' }}>HEMAT Rp {(sDisc + pDisc).toLocaleString('id-ID')} ✨</div>
                )}
              </div>
            </div>
          </div>

          {/* Payment methods info */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginTop: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontWeight: '600' }}>SISTEM PEMBAYARAN</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon icon="mdi:shield-check" width="20" style={{ color: '#40534c' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#40534c' }}>Midtrans Secure</span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>— Pembayaran aman terverifikasi otomatis</span>
            </div>
          </div>

          {/* Pay Button */}
          {step === 3 && (
            <button 
              onClick={handlePayment} 
              disabled={isLoading} 
              style={{ 
                width: '100%', 
                padding: '14px', 
                backgroundColor: '#40534c', 
                color: '#d6bd98', 
                border: 'none', 
                borderRadius: '10px', 
                fontSize: '15px', 
                fontWeight: '700', 
                cursor: isLoading ? 'not-allowed' : 'pointer', 
                opacity: isLoading ? 0.7 : 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                marginTop: '16px',
                boxShadow: '0 4px 12px rgba(64,83,76,0.15)'
              }}
            >
              {isLoading ? (
                <><Icon icon="mdi:loading" width="18" style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</>
              ) : paymentMethod === 'cod' ? (
                <>Pesan Sekarang (COD) — Rp {grandTotal.toLocaleString('id-ID')}</>
              ) : (
                <>Bayar Sekarang — Rp {grandTotal.toLocaleString('id-ID')}</>
              )}
            </button>
          )}
        </div>
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 320px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
