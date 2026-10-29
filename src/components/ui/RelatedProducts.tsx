'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Category } from '@/data/categories';
import { useTranslations } from 'next-intl';

interface RelatedProductsProps {
  currentSlug: string;
  categories: Category[];
}

export default function RelatedProducts({ currentSlug, categories }: RelatedProductsProps) {
  const t = useTranslations('Common');
  const [related, setRelated] = useState<Category[]>([]);

  useEffect(() => {
    // Filter out current product and pick 3 random ones
    const filtered = categories.filter(cat => cat.slug !== currentSlug);
    const randomized = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 3);
    setRelated(randomized);
  }, [currentSlug, categories]);

  if (related.length === 0) return null;

  return (
    <section style={{ marginTop: '5rem', borderTop: '1px solid #e2e8f0', paddingTop: '4rem' }}>
      <h2 style={{ 
        fontSize: '1.875rem', 
        fontWeight: '700', 
        color: '#1e293b', 
        marginBottom: '2.5rem',
        textAlign: 'center' 
      }}>
        {t('relatedProducts') || 'Produk Cetak Lainnya'}
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem' 
      }}>
        {related.map((item, idx) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              href={`/produk/${item.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                height: '100%'
              }}
              className="related-product-card"
              >
                <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.desc}
                  </p>
                  <span style={{ 
                    display: 'inline-block', 
                    marginTop: '1rem', 
                    color: '#0A4174', 
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    Lihat Detail &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .related-product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }
      `}</style>
    </section>
  );
}
