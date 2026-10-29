'use client';

import React from 'react';
import { Icon } from '@iconify/react';

const GoogleMapEmbed = ({ backgroundColor = '#f8fafc' }: { backgroundColor?: string }) => {
  return (
    <section style={{ padding: '80px 24px', backgroundColor, display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '1200px', width: '100%', backgroundColor: '#ffffff', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <Icon icon="solar:map-point-bold-duotone" style={{ color: '#f97316' }} />
            Temukan Lokasi Kami
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <p style={{ color: '#475569', fontSize: '1.1rem', flex: 1, minWidth: '280px', margin: 0, lineHeight: '1.6' }}>
              <strong style={{ color: '#1e293b' }}>Percetakan Offset Dallas Kediri</strong><br/>
              Jl. Kilisuci No.71, Singonegaran, Kec. Pesantren, Kabupaten Kediri, Jawa Timur 64129
            </p>
            <a 
              href="https://www.google.com/maps/search/Percetakan+Dallas+Kediri" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#0A4174',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(10, 65, 116, 0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0c508f';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(10, 65, 116, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0A4174';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 65, 116, 0.2)';
              }}
            >
              <Icon icon="mdi:google-maps" style={{ fontSize: '22px' }} />
              Dapatkan Petunjuk Arah
            </a>
          </div>
        </div>
        <div style={{ width: '100%', height: '450px', backgroundColor: '#e2e8f0', position: 'relative' }}>
          <iframe 
            src="https://maps.google.com/maps?q=Percetakan+Dallas+Kediri&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Percetakan Dallas Kediri"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default GoogleMapEmbed;
