'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { signIn } from 'next-auth/react';
import { Icon } from '@iconify/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: 'track' | 'login' | 'register';
}

export default function LoginModal({ isOpen, onClose, onSuccess, initialTab = 'track' }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'track' | 'login' | 'register'>(initialTab);
  const [mounted, setMounted] = useState(false);

  // Tracking state
  const [trackQuery, setTrackQuery] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackResult, setTrackResult] = useState<any[] | null>(null);
  const [trackError, setTrackError] = useState('');

  // Auth state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setTrackError('');
      setTrackResult(null);
      setError('');
      setSuccess('');
    }
  }, [isOpen, initialTab]);

  if (!mounted || !isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setIsTracking(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(trackQuery.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
        setTrackResult(data.data);
      } else {
        setTrackError('Pesanan tidak ditemukan. Periksa kembali Nomor Pesanan atau Nomor HP Anda.');
      }
    } catch {
      setTrackError('Gagal memuat status pesanan. Silakan periksa koneksi internet Anda.');
    } finally {
      setIsTracking(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: window.location.href });
    } catch {
      setError('Gagal login dengan Google. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah.');
      } else {
        onSuccess?.();
        onClose();
        window.location.reload();
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mendaftar.');
        return;
      }

      setSuccess('Registrasi berhasil! Silakan masuk ke akun Anda.');
      setTimeout(() => {
        resetForm();
        setActiveTab('login');
      }, 1500);
    } catch {
      setError('Terjadi kesalahan server.');
    } finally {
      setIsLoading(false);
    }
  };

  const fmtRp = (n: number) => `Rp ${(n || 0).toLocaleString('id-ID')}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'modalZoomIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalZoomIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>

        {/* Modal Header - Pure Black Theme */}
        <div
          style={{
            backgroundColor: '#121212',
            padding: '24px',
            color: '#ffffff',
            position: 'relative',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            <Icon icon="solar:close-circle-bold" style={{ fontSize: '20px' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(234, 88, 12, 0.18)',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
              }}
            >
              <Icon icon={activeTab === 'track' ? 'solar:box-minimalistic-bold' : 'solar:user-circle-bold'} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                {activeTab === 'track'
                  ? 'Lacak Pesanan'
                  : activeTab === 'login'
                  ? 'Masuk ke Akun'
                  : 'Daftar Akun Baru'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#a3a3a3' }}>
                {activeTab === 'track'
                  ? 'Cek status pesanan Anda dengan mudah & cepat'
                  : activeTab === 'login'
                  ? 'Kelola pesanan dan nikmati promo khusus'
                  : 'Buat akun untuk pengalaman belanja terbaik'}
              </p>
            </div>
          </div>

          {/* Tab Selector Buttons */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '4px',
              borderRadius: '12px',
              marginTop: '18px',
              gap: '4px',
            }}
          >
            <button
              onClick={() => setActiveTab('track')}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: activeTab === 'track' ? '800' : '600',
                cursor: 'pointer',
                backgroundColor: activeTab === 'track' ? '#ea580c' : 'transparent',
                color: activeTab === 'track' ? '#ffffff' : '#d4d4d4',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Icon icon="solar:box-minimalistic-bold" style={{ fontSize: '16px' }} />
              <span>Lacak Pesanan</span>
            </button>
            <button
              onClick={() => setActiveTab('login')}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: activeTab !== 'track' ? '800' : '600',
                cursor: 'pointer',
                backgroundColor: activeTab !== 'track' ? '#ea580c' : 'transparent',
                color: activeTab !== 'track' ? '#ffffff' : '#d4d4d4',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Icon icon="solar:user-bold" style={{ fontSize: '16px' }} />
              <span>Masuk Akun</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', maxHeight: '65vh', overflowY: 'auto' }}>
          {/* TAB 1: LACAK PESANAN */}
          {activeTab === 'track' && (
            <div>
              <form onSubmit={handleTrackSubmit} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#171717', marginBottom: '8px' }}>
                  Nomor Pesanan atau No. WhatsApp
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Icon
                      icon="solar:minimalistic-magnifer-linear"
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#a3a3a3',
                        fontSize: '18px',
                      }}
                    />
                    <input
                      type="text"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      placeholder="Contoh: PL-202610-001 / 0812xxxx"
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        border: '1.5px solid #e5e5e5',
                        borderRadius: '10px',
                        fontSize: '13px',
                        outline: 'none',
                        color: '#000000',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#ea580c')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isTracking}
                    style={{
                      padding: '11px 18px',
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: isTracking ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                  >
                    {isTracking ? (
                      <Icon icon="solar:restart-circle-bold" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Icon icon="solar:minimalistic-magnifer-bold" style={{ fontSize: '18px' }} />
                    )}
                    <span>{isTracking ? 'Mencari...' : 'Lacak'}</span>
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {trackError && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #fecaca',
                  }}
                >
                  <Icon icon="solar:danger-triangle-bold" style={{ fontSize: '18px', flexShrink: 0 }} />
                  <span>{trackError}</span>
                </div>
              )}

              {/* Track Result Display */}
              {trackResult && trackResult.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Hasil Pencarian ({trackResult.length} Pesanan)
                  </div>
                  {trackResult.map((order: any) => (
                    <div
                      key={order.id}
                      style={{
                        border: '1.5px solid #f0f0f0',
                        borderRadius: '12px',
                        padding: '16px',
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: '#737373' }}>{fmtDate(order.created_at)}</span>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#000000' }}>#{order.order_number}</div>
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            backgroundColor:
                              order.status === 'completed'
                                ? '#ecfdf5'
                                : order.status === 'shipped'
                                ? '#eff6ff'
                                : order.status === 'paid'
                                ? '#f0fdf4'
                                : '#fff7ed',
                            color:
                              order.status === 'completed'
                                ? '#059669'
                                : order.status === 'shipped'
                                ? '#2563eb'
                                : order.status === 'paid'
                                ? '#16a34a'
                                : '#ea580c',
                          }}
                        >
                          {order.status === 'pending_payment'
                            ? 'Menunggu Bayar'
                            : order.status === 'paid'
                            ? 'Sudah Dibayar'
                            : order.status === 'processing'
                            ? 'Diproses'
                            : order.status === 'shipped'
                            ? 'Dikirim'
                            : order.status === 'completed'
                            ? 'Selesai'
                            : 'Dibatalkan'}
                        </span>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0' }}>
                        {order.order_items?.slice(0, 2).map((item: any) => (
                          <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e5e5e5', flexShrink: 0 }}>
                              <img src={item.image || '/logo-paperlisens.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.product_name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#737373' }}>
                                {item.quantity} pcs × {fmtRp(item.price)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e5e5e5' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#737373' }}>Total Pembayaran</div>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: '#ea580c' }}>{fmtRp(order.total)}</div>
                        </div>
                        {order.tracking_number && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', color: '#737373' }}>No. Resi ({order.courier_name || 'Kurir'})</div>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#000000' }}>{order.tracking_number}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Login Suggestion */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px',
                  backgroundColor: '#fafafa',
                  borderRadius: '12px',
                  border: '1px dashed #e5e5e5',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '12px', color: '#737373', marginBottom: '6px' }}>
                  Ingin melihat seluruh riwayat pesanan Anda?
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ea580c',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Masuk ke Akun Anda</span>
                  <Icon icon="solar:arrow-right-linear" style={{ fontSize: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: LOGIN / REGISTER */}
          {activeTab !== 'track' && (
            <div>
              {/* Error/Success Messages */}
              {error && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #fecaca',
                  }}
                >
                  <Icon icon="solar:danger-triangle-bold" style={{ fontSize: '18px', flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <Icon icon="solar:check-circle-bold" style={{ fontSize: '18px', flexShrink: 0 }} />
                  <span>{success}</span>
                </div>
              )}

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#171717',
                  transition: 'all 0.2s',
                  marginBottom: '18px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                  e.currentTarget.style.borderColor = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                }}
              >
                <Icon icon="flat-color-icons:google" style={{ fontSize: '20px' }} />
                <span>{activeTab === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google'}</span>
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e5e5' }} />
                <span style={{ fontSize: '12px', color: '#a3a3a3', fontWeight: '600' }}>atau email</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e5e5' }} />
              </div>

              {/* Form */}
              <form onSubmit={activeTab === 'login' ? handleCredentialLogin : handleRegister}>
                {activeTab === 'register' && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#171717', marginBottom: '6px' }}>
                      Nama Lengkap
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Icon icon="solar:user-bold" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', fontSize: '18px' }} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Nama lengkap Anda"
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 38px',
                          border: '1.5px solid #e5e5e5',
                          borderRadius: '10px',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#ea580c')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#171717', marginBottom: '6px' }}>
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Icon icon="solar:letter-bold" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', fontSize: '18px' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="contoh@email.com"
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        border: '1.5px solid #e5e5e5',
                        borderRadius: '10px',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#ea580c')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#171717', marginBottom: '6px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Icon icon="solar:lock-password-bold" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', fontSize: '18px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={activeTab === 'register' ? 'Minimal 6 karakter' : 'Masukkan password'}
                      minLength={activeTab === 'register' ? 6 : undefined}
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 38px',
                        border: '1.5px solid #e5e5e5',
                        borderRadius: '10px',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#ea580c')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#a3a3a3',
                        padding: '4px',
                      }}
                    >
                      <Icon icon={showPassword ? 'solar:eye-closed-bold' : 'solar:eye-bold'} style={{ fontSize: '18px' }} />
                    </button>
                  </div>
                </div>

                {activeTab === 'register' && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#171717', marginBottom: '6px' }}>
                      No. WhatsApp <span style={{ color: '#a3a3a3', fontWeight: '400' }}>(opsional)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Icon icon="solar:phone-calling-bold" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', fontSize: '18px' }} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 38px',
                          border: '1.5px solid #e5e5e5',
                          borderRadius: '10px',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#ea580c')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e5e5')}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '13px',
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                >
                  {isLoading && <Icon icon="solar:restart-circle-bold" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }} />}
                  <span>{activeTab === 'login' ? 'Masuk ke Akun' : 'Daftar Sekarang'}</span>
                </button>
              </form>

              {/* Switch Login/Register */}
              <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#737373' }}>
                {activeTab === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab(activeTab === 'login' ? 'register' : 'login');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ea580c',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '13px',
                  }}
                >
                  {activeTab === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
