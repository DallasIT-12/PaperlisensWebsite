'use client';

import { useState, useMemo, useTransition, memo, useCallback } from 'react';
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
  const [, startTransition] = useTransition();

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

  const setVariant = useCallback((v: any | null) => {
    // Local state updates instantly (button highlight is synchronous)
    setSelectedVariant(v);
    // Parent update (price/image) is deferred — won't block button highlight
    startTransition(() => onVariantChange(v));
  }, [onVariantChange]);

  const handleAttr1Click = useCallback((val: string) => {
    if (selectedAttr1 === val) {
      setSelectedAttr1(null);
      setVariant(null);
      return;
    }
    setSelectedAttr1(val);
    if (attributes.attr2.length === 0) {
      const match = variantLookup.map1.get(val);
      setVariant(match || null);
    } else if (selectedAttr2) {
      const match = variantLookup.map2.get(`${val}||${selectedAttr2}`);
      setVariant(match || null);
    }
  }, [selectedAttr1, selectedAttr2, attributes.attr2.length, variantLookup, setVariant]);

  const handleAttr2Click = useCallback((val: string) => {
    if (selectedAttr2 === val) {
      setSelectedAttr2(null);
      return;
    }
    setSelectedAttr2(val);
    if (selectedAttr1) {
      const match = variantLookup.map2.get(`${selectedAttr1}||${val}`);
      setVariant(match || null);
    }
  }, [selectedAttr2, selectedAttr1, variantLookup, setVariant]);

  const handleQtyChange = useCallback((delta: number) => {
    setQuantity(prev => {
      const next = Math.max(1, prev + delta);
      onQuantityChange(next);
      return next;
    });
  }, [onQuantityChange]);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    border: active ? '2px solid #40534c' : '1px solid #e5e7eb',
    backgroundColor: active ? '#40534c' : 'white',
    color: active ? '#d6bd98' : '#1a3636',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    // No transition — snap instantly on click
  });

  if (variations.length <= 1) return null;

  return (
    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* VARIASI 1 */}
      <div>
        <div style={{ fontSize: '14px', color: '#677d6a', marginBottom: '8px' }}>
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

      {/* VARIASI 2 */}
      {attributes.attr2.length > 0 && (
        <div>
          <div style={{ fontSize: '14px', color: '#677d6a', marginBottom: '8px' }}>
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
        <span style={{ color: '#677d6a', fontSize: '14px' }}>{pt('quantity')}</span>
        <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
          <button onClick={() => handleQtyChange(-1)} style={{ padding: '4px 12px', borderRight: '1px solid #e5e7eb', cursor: 'pointer', background: 'none', border: 'none' }}>-</button>
          <input type="text" value={quantity} readOnly style={{ width: '40px', textAlign: 'center', border: 'none', outline: 'none' }} />
          <button onClick={() => handleQtyChange(1)} style={{ padding: '4px 12px', cursor: 'pointer', background: 'none', border: 'none', borderLeft: '1px solid #e5e7eb' }}>+</button>
        </div>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{pt('available', { count: 150 })}</span>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => onAddToCart(selectedVariant, quantity)}
          style={{ flex: 1, padding: '12px', backgroundColor: 'rgba(64, 83, 76, 0.1)', color: '#40534c', border: '1px solid #40534c', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Icon icon="material-symbols:add-shopping-cart" /> {pt('addToCart')}
        </button>
        <button
          onClick={() => onOrderNow(selectedVariant, quantity)}
          style={{ flex: 1, padding: '12px', backgroundColor: '#40534c', color: '#d6bd98', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {pt('orderNow')}
        </button>
      </div>
    </div>
  );
});

export default VariantSelector;
