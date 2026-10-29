'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';

const FloatingWhatsApp = () => {
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith('/product/');

  return (
    <>
      <style>{`
        .floating-wa-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background-color: #25D366;
          color: white;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4);
          z-index: 998;
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .floating-wa-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.5);
        }
        @media (max-width: 768px) {
          .floating-wa-btn {
            bottom: calc(${isProductPage ? '80px' : '18px'} + env(safe-area-inset-bottom, 0px));
            right: 16px;
            width: 50px;
            height: 50px;
            display: ${isProductPage ? 'none !important' : 'flex'};
          }
        }
      `}</style>
      <a
        href="https://wa.me/6281260001487?text=Halo%20CS%20Paperlisens,%20saya%20ingin%20tanya%20produk%20kemasan"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-wa-btn"
        aria-label="Chat via WhatsApp"
      >
        <Icon icon="ri:whatsapp-fill" style={{ fontSize: '30px' }} />
      </a>
    </>
  );
};

export default FloatingWhatsApp;
