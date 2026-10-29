'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('paperlisens_cookie_consent');
    if (!consent) {
      // Delay slightly so it animates in smoothly without jarring the initial page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('paperlisens_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('paperlisens_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9998,
        maxWidth: '440px',
        width: 'calc(100% - 48px)',
        backgroundColor: '#121212',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(16px)',
        animation: 'cookieSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fontFamily: 'inherit',
      }}
    >
      <style>{`
        @keyframes cookieSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 640px) {
          .cookie-consent-actions {
            flex-direction: column-reverse !important;
          }
          .cookie-consent-actions button {
            width: 100% !important;
          }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(234, 88, 12, 0.15)',
            color: '#ea580c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '22px',
          }}
        >
          <Icon icon="solar:shield-check-bold" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
            Privasi & Cookies
          </div>
          <p style={{ fontSize: '13px', color: '#a3a3a3', lineHeight: '1.5', margin: 0 }}>
            Kami menggunakan cookies untuk meningkatkan pengalaman belanja Anda, mengingat preferensi pesanan, dan memastikan transaksi aman.
          </p>
        </div>
        <button
          onClick={handleDecline}
          aria-label="Tutup"
          style={{
            background: 'none',
            border: 'none',
            color: '#737373',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#737373')}
        >
          <Icon icon="solar:close-circle-linear" />
        </button>
      </div>

      <div className="cookie-consent-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={handleDecline}
          style={{
            padding: '9px 16px',
            backgroundColor: 'transparent',
            color: '#d4d4d4',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d4d4d4';
          }}
        >
          Hanya Esensial
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: '9px 20px',
            backgroundColor: '#ea580c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(234, 88, 12, 0.4)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
        >
          <Icon icon="solar:check-read-bold" style={{ fontSize: '16px' }} />
          <span>Saya Setuju</span>
        </button>
      </div>
    </div>
  );
}
