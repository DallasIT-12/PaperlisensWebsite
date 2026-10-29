'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';

const FloatingMaps = () => {
  const pathname = usePathname();

  // Hide on Paperlisens section — it has its own floating cart button
  if (pathname?.includes('/paperlisens')) return null;

  return (
    <a
      href="https://www.google.com/maps/search/Percetakan+Dallas+Kediri"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '96px', // 24px + 56px (WhatsApp button height) + 16px gap
        right: '24px',
        backgroundColor: '#4285F4', // Google Map Blue
        color: 'white',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 999,
        transition: 'transform 0.2s',
        textDecoration: 'none'
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      title="Temukan Lokasi Kami di Google Maps"
      aria-label="Find us on Google Maps"
    >
      <Icon icon="mdi:google-maps" style={{ fontSize: '32px' }} />
    </a>
  );
};

export default FloatingMaps;
