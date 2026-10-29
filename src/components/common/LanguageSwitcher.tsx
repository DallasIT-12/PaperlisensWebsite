'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

const LanguageSwitcher = ({ light = false }: { light?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif';

  const languages = [
    { code: 'id', label: 'ID', fullLabel: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'EN', fullLabel: 'English', flag: '🇺🇸' },
    { code: 'zh', label: 'ZH', fullLabel: '中文 (Mandarin)', flag: '🇨🇳' },
  ];

  const segments = pathname.split('/');
  const currentLocaleCode = ['en', 'id', 'zh'].includes(segments[1]) ? segments[1] : 'id';
  const currentLocale = languages.find(l => l.code === currentLocaleCode) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ fontFamily: fontStack }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: light ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #e5e5e5',
            backgroundColor: light ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
            color: light ? '#ffffff' : '#171717',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '13px',
            fontWeight: '600'
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.color = '#ea580c';
            e.currentTarget.style.borderColor = '#ea580c';
        }}
        onMouseOut={(e) => {
            if (!isOpen) {
                e.currentTarget.style.color = light ? '#ffffff' : '#171717';
                e.currentTarget.style.borderColor = light ? 'rgba(255, 255, 255, 0.2)' : '#e5e5e5';
            }
        }}
      >
        <span>{currentLocale.flag}</span>
        <span style={{ letterSpacing: '0.025em' }}>{currentLocale.label}</span>
        <Icon 
          icon="solar:alt-arrow-down-linear" 
          style={{ 
            fontSize: '14px',
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} 
        />
      </button>

      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            right: 0,
            marginTop: '8px',
            width: '180px',
            backgroundColor: light ? '#0a0a0a' : '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
            border: light ? '1px solid #262626' : '1px solid #e5e5e5',
            padding: '8px 0',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                color: light ? (currentLocaleCode === lang.code ? '#ea580c' : '#a3a3a3') : (currentLocaleCode === lang.code ? '#ea580c' : '#404040'),
                fontWeight: currentLocaleCode === lang.code ? '700' : '500',
                fontSize: '13px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = light ? '#171717' : '#fff7ed';
                e.currentTarget.style.color = '#ea580c';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = light ? (currentLocaleCode === lang.code ? '#ea580c' : '#a3a3a3') : (currentLocaleCode === lang.code ? '#ea580c' : '#404040');
              }}
            >
              <span style={{ fontSize: '18px' }}>{lang.flag}</span>
              <span style={{ flexGrow: 1 }}>{lang.fullLabel}</span>
              {currentLocaleCode === lang.code && (
                <Icon icon="solar:check-circle-bold" style={{ fontSize: '16px', color: '#ea580c' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;