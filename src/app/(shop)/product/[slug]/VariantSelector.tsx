'use client';

import { useState, useMemo, memo, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useTranslations, useLocale } from 'next-intl';
import { getSmartTranslation } from '@/utils/productTranslations';

interface VariantSelectorProps {
  initialProduct: any;
  onVariantChange: (variant: any | null) => void;
  onQuantityChange: (qty: number) => void;
  onOrderNow: (selectedVariant: any | null, quantity: number) => void;
  onAddToCart: (selectedVariant: any | null, quantity: number) => void;
  pt: any;
}

const VariantSelector = memo(function VariantSelector({
  initialProduct,
  onVariantChange,
  onQuantityChange,
  onOrderNow,
  onAddToCart,
  pt,
}: VariantSelectorProps) {
  const locale = useLocale();
  const [selectedAttr1, setSelectedAttr1] = useState<string | null>(null);
  const [selectedAttr2, setSelectedAttr2] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);

  const getLocalized = useCallback((item: any, field: string) => {
    const specificTranslation = item[`${field}_${locale}`];
    if (specificTranslation) return specificTranslation;
    return getSmartTranslation(item[field], locale);
  }, [locale]);

  const variations = useMemo(() => {
    if (initialProduct.variants && initialProduct.variants.length > 0) {
      return initialProduct.variants;
    }
    return [initialProduct];
  }, [initialProduct]);

  const attributes = useMemo(() => {
    const list1 = new Set<string>();
    const list2 = new Set<string>();
    variations.forEach((v: any) => {
      const n1 = v.variant_name || getLocalized(v, 'variant') || 'Standard';
      const n2 = v.variant_name_2 || null;
      if (n1) list1.add(n1);
      if (n2) list2.add(n2);
    });
    return { attr1: Array.from(list1), attr2: Array.from(list2) };
  }, [variations, getLocalized]);

  const variantLookup = useMemo(() => {
    const map1 = new Map<string, any>();
    const map2 = new Map<string, any>();
    variations.forEach((v: any) => {
      const n1 = v.variant_name || getLocalized(v, 'variant') || 'Standard';
      const n2 = v.variant_name_2 || null;
      if (!map1.has(n1)) map1.set(n1, v);
      if (n2) map2.set(`${n1}||${n2}`, v);
    });
    return { map1, map2 };
  }, [variations, getLocalized]);

  const [validationError, setValidationError] = useState<string | null>(null);

  const setVariant = useCallback((v: any | null) => {
    setSelectedVariant(v);
    onVariantChange(v);
    if (v) setValidationError(null);
  }, [onVariantChange]);

  const handleAttr1Click = useCallback((val: string) => {
    setValidationError(null);
    if (selectedAttr1 === val && attributes.attr2.length === 0) {
      setSelectedAttr1(null);
      setVariant(null);
      return;
    }
    setSelectedAttr1(val);
    if (attributes.attr2.length === 0) {
      const match = variantLookup.map1.get(val);
      setVariant(match || null);
    } else {
      // Smart pairing: use existing attr2 or auto-fallback to first available attr2
      const targetAttr2 = selectedAttr2 || attributes.attr2[0];
      if (!selectedAttr2 && targetAttr2) {
        setSelectedAttr2(targetAttr2);
      }
      const match = variantLookup.map2.get(`${val}||${targetAttr2}`) || variantLookup.map1.get(val);
      setVariant(match || null);
    }
  }, [selectedAttr1, selectedAttr2, attributes.attr2, variantLookup, setVariant]);

  const handleAttr2Click = useCallback((val: string) => {
    setValidationError(null);
    setSelectedAttr2(val);
    const targetAttr1 = selectedAttr1 || attributes.attr1[0];
    if (!selectedAttr1 && targetAttr1) {
      setSelectedAttr1(targetAttr1);
    }
    const match = variantLookup.map2.get(`${targetAttr1}||${val}`) || variantLookup.map1.get(targetAttr1);
    setVariant(match || null);
  }, [selectedAttr2, selectedAttr1, attributes.attr1, variantLookup, setVariant]);

  const handleQtyChange = useCallback((delta: number) => {
    setQuantity(prev => {
      const next = Math.max(1, prev + delta);
      onQuantityChange(next);
      return next;
    });
  }, [onQuantityChange]);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '9px 18px',
    border: '2px solid',
    borderColor: active ? '#ea580c' : '#e5e5e5',
    backgroundColor: active ? '#fff7ed' : '#ffffff',
    color: active ? '#ea580c' : '#171717',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700',
    transition: 'background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease',
  });

  const hasVariants = attributes.attr1.length > 1 || (attributes.attr1.length === 1 && attributes.attr1[0] !== 'Standard');

  return (
    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* VARIASI 1 */}
      {hasVariants && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#525252', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {initialProduct.attr_label_1 || pt('selectVariant')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {attributes.attr1.map((val: string) => (
              <button
                key={val}
                onClick={() => handleAttr1Click(val)}
                style={btnStyle(selectedAttr1 === val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VARIASI 2 */}
      {attributes.attr2.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#525252', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {initialProduct.attr_label_2 || 'Pilihan Tambahan'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {attributes.attr2.map((val: string) => (
              <button
                key={val}
                onClick={() => handleAttr2Click(val)}
                style={btnStyle(selectedAttr2 === val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUANTITY */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: '#525252', fontSize: '14px', fontWeight: '700' }}>{pt('quantity')}:</span>
        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
          <button 
            onClick={() => handleQtyChange(-1)} 
            style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fafafa', border: 'none', borderRight: '1px solid #e5e5e5', fontSize: '18px', fontWeight: 'bold', color: '#171717' }}
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <input 
            type="text" 
            value={quantity} 
            readOnly 
            style={{ width: '48px', height: '38px', textAlign: 'center', border: 'none', outline: 'none', fontSize: '15px', fontWeight: '800', color: '#000000', backgroundColor: '#ffffff' }} 
          />
          <button 
            onClick={() => handleQtyChange(1)} 
            style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fafafa', border: 'none', borderLeft: '1px solid #e5e5e5', fontSize: '18px', fontWeight: 'bold', color: '#171717' }}
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
        <span style={{ fontSize: '12px', color: '#737373', fontWeight: '500' }}>
          Stok tersedia & siap kirim
        </span>
      </div>

      {/* Validation Message if User Tries to Buy Without Selecting Variant */}
      {validationError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#ea580c',
          backgroundColor: '#fff7ed',
          border: '1.5px solid #fed7aa',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '700',
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <Icon icon="solar:info-circle-bold" style={{ fontSize: '18px', color: '#ea580c', flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        <button
          onClick={() => {
            if (hasVariants && !selectedVariant) {
              setValidationError('Silakan pilih salah satu variasi di atas terlebih dahulu');
              return;
            }
            setValidationError(null);
            onAddToCart(selectedVariant, quantity);
          }}
          style={{
            flex: 1,
            padding: '14px 20px',
            backgroundColor: '#ffffff',
            color: '#ea580c',
            border: '2px solid #ea580c',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff7ed'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
        >
          <Icon icon="solar:cart-plus-bold" style={{ fontSize: '20px' }} />
          <span>{pt('addToCart')}</span>
        </button>

        <button
          onClick={() => {
            if (hasVariants && !selectedVariant) {
              setValidationError('Silakan pilih salah satu variasi di atas terlebih dahulu');
              return;
            }
            setValidationError(null);
            onOrderNow(selectedVariant, quantity);
          }}
          style={{
            flex: 1.2,
            padding: '14px 20px',
            backgroundColor: '#ea580c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#c2410c'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ea580c'; }}
        >
          <Icon icon="solar:bag-check-bold" style={{ fontSize: '20px' }} />
          <span>{pt('orderNow')}</span>
        </button>
      </div>
    </div>
  );
});

export default VariantSelector;
