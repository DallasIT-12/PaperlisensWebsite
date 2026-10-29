'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const packagingTypes = [
  { name: 'Box Hampers Custom', slug: 'kotak-hampers', img: '/kotak%20hampers.webp', tags: ['Lebaran', 'Natal', 'Corporate'], material: 'Art Carton / Ivory' },
  { name: 'Box Makanan Food Grade', slug: 'kotak-nasi', img: '/kotak%20nasi%20(1).webp', tags: ['Katering', 'UMKM'], material: 'Food Grade Paper' },
  { name: 'Box Bakery & Kue', slug: 'kotak-bakery', img: '/kotak%20cake.webp', tags: ['Bakery', 'F&B'], material: 'Ivory Food Grade' },
  { name: 'Paperbag Custom', slug: 'paperbag', img: '/paperbag.webp', tags: ['Retail', 'Fashion', 'Event'], material: 'Ivory / Kraft' },
  { name: 'Kemasan Rokok', slug: 'rokok', img: '/custom%20rokok%203.webp', tags: ['Industri Rokok'], material: 'Ivory / Duplex' },
  { name: 'Kemasan Skincare', slug: 'kotak-hampers', img: '/BAHAN-IVORY.webp', tags: ['Beauty', 'Kosmetik'], material: 'Ivory 310gsm' },
];

const materials = [
  { name: 'Art Carton', icon: 'mdi:image-filter-hdr', desc: 'Glossy premium, tajam, cocok untuk hampers & retail', gsm: '230–350gsm' },
  { name: 'Ivory Paper', icon: 'mdi:food-apple', desc: 'Food safe, satu sisi glossy, ideal untuk makanan & kosmetik', gsm: '210–350gsm' },
  { name: 'Duplex Board', icon: 'mdi:package-variant', desc: 'Ekonomis & kokoh, populer untuk box nasi & rokok', gsm: '250–400gsm' },
  { name: 'Kraft Paper', icon: 'mdi:leaf', desc: 'Natural & eco-friendly, sempurna untuk paperbag & hampers', gsm: '120–200gsm' },
];

const process = [
  { step: '01', icon: 'mdi:message-text', title: 'Konsultasi', desc: 'Hubungi tim kami via WhatsApp. Ceritakan kebutuhan: produk, ukuran, jumlah, dan desain yang diinginkan.' },
  { step: '02', icon: 'mdi:pencil-ruler', title: 'Desain & Mockup', desc: 'Tim desainer kami buat mockup sesuai brief. Revisi hingga Anda puas tanpa biaya tambahan.' },
  { step: '03', icon: 'mdi:printer', title: 'Proses Cetak', desc: 'Setelah desain ACC dan DP masuk, proses cetak dimulai dengan mesin offset presisi tinggi.' },
  { step: '04', icon: 'mdi:truck-delivery', title: 'Pengiriman', desc: 'Dikemas aman dan dikirim ke seluruh Indonesia via ekspedisi kargo terpercaya.' },
];

const faqs = [
  { q: 'Apa saja jenis kemasan custom yang bisa dicetak?', a: 'Kami mencetak: box hampers, kotak nasi food grade, box bakery (cupcake, tart, roti), kotak rokok, paperbag custom, dan kemasan skincare/kosmetik. Semua bisa dikustomisasi ukuran, material, dan finishing.' },
  { q: 'Material apa yang tersedia untuk cetak kemasan custom?', a: 'Tersedia: Art Carton (glossy premium), Ivory Paper (food grade), Duplex (ekonomis untuk box nasi & rokok), Kraft Paper (natural eco-friendly). Ketebalan 210-400gsm.' },
  { q: 'Berapa minimal order cetak kemasan custom?', a: 'Minimal order berbeda per produk. Kemasan food grade & paperbag: mulai 500 pcs. Kotak rokok: mulai 1.000 pcs. Tersedia digital printing untuk jumlah lebih kecil.' },
  { q: 'Apakah termasuk jasa desain kemasan?', a: 'Ya! Tim desainer kami siap membantu dari konsultasi ukuran, pembuatan mockup 3D, hingga file siap cetak. Anda cukup sediakan logo dan konsep.' },
];

export default function CetakKemasanCustomClient() {
  const [isLargeMobile, setIsLargeMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const check = () => setIsLargeMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', color: '#1e293b' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #001D39 0%, #0a2744 60%, #001D39 100%)',
        paddingTop: isLargeMobile ? '140px' : '180px',
        paddingBottom: isLargeMobile ? '60px' : '100px',
        paddingLeft: '24px', paddingRight: '24px',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,23,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: '850px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '50px', padding: '8px 20px', marginBottom: '24px' }}>
            <Icon icon="mdi:package-variant-closed" style={{ color: '#D4A017', fontSize: '16px' }} />
            <span style={{ color: '#D4A017', fontSize: '14px', fontWeight: '600' }}>Custom Packaging Indonesia</span>
          </div>
          <h1 style={{ fontSize: isLargeMobile ? '2rem' : '3.5rem', fontWeight: '800', color: '#fff', lineHeight: 1.2, marginBottom: '20px' }}>
            Cetak Kemasan Custom<br />
            <span style={{ color: '#D4A017' }}>Semua Kebutuhan Bisnis Anda</span>
          </h1>
          <p style={{ fontSize: isLargeMobile ? '1rem' : '1.2rem', color: 'rgba(255,255,255,0.75)', maxWidth: '640px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Dari box makanan food grade, hampers premium, paperbag custom, hingga kemasan skincare — semua dikerjakan dengan mesin offset berkualitas tinggi dan pengalaman 40+ tahun.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/6281260001487?text=Halo%2C%20saya%20ingin%20konsultasi%20cetak%20kemasan%20custom" target="_blank" rel="noopener noreferrer"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Icon icon="mdi:whatsapp" fontSize="20" /> Konsultasi Gratis
            </a>
            <a href="https://dallas-printingid.com/KATALOG%20DALLAS.pdf" target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Icon icon="mdi:file-download" fontSize="18" /> Download Katalog
            </a>
          </div>
        </motion.div>
      </section>

      {/* Product Types */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: isLargeMobile ? '60px 24px' : '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.5rem', fontWeight: '800', color: '#001D39' }}>Jenis Kemasan yang Kami Cetak</h2>
          <p style={{ color: '#64748b', marginTop: '16px', maxWidth: '600px', margin: '16px auto 0' }}>Tersedia dalam ratusan varian ukuran, material, dan finishing untuk memenuhi semua kebutuhan kemasan bisnis Anda.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
          {packagingTypes.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link href={`/id/produk/${p.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', transition: 'all 0.3s', cursor: 'pointer' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,29,57,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                  <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                    <img src={p.img} alt={`${p.name} - Percetakan Dallas`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontWeight: '700', color: '#001D39', fontSize: '0.95rem', marginBottom: '8px' }}>{p.name}</h3>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {p.tags.map((t, ti) => (
                        <span key={ti} style={{ fontSize: '11px', background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)', color: '#D4A017', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>{t}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Material: {p.material}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Materials */}
      <section style={{ background: '#001D39', padding: isLargeMobile ? '60px 24px' : '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#fff' }}>Material Kemasan Tersedia</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '12px' }}>Setiap material memiliki karakteristik unik — kami bantu pilih yang terbaik untuk produk Anda</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '16px' }}>
            {materials.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                <Icon icon={m.icon} style={{ color: '#D4A017', fontSize: '32px', marginBottom: '12px' }} />
                <h3 style={{ fontWeight: '700', color: '#fff', marginBottom: '8px', fontSize: '0.95rem' }}>{m.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '8px' }}>{m.desc}</p>
                <span style={{ fontSize: '11px', color: '#D4A017', fontWeight: '600' }}>{m.gsm}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: isLargeMobile ? '60px 24px' : '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#001D39' }}>Proses Pemesanan</h2>
          <p style={{ color: '#64748b', marginTop: '12px' }}>Mudah, cepat, dan transparan dari awal hingga barang sampai di tangan Anda</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '24px' }}>
          {process.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #001D39, #0a2744)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon icon={p.icon} style={{ color: '#D4A017', fontSize: '28px' }} />
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#D4A017', letterSpacing: '1px', marginBottom: '8px' }}>STEP {p.step}</div>
              <h3 style={{ fontWeight: '700', color: '#001D39', marginBottom: '8px' }}>{p.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f8fafc', padding: isLargeMobile ? '60px 24px' : '80px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2rem', fontWeight: '800', color: '#001D39', textAlign: 'center', marginBottom: '40px' }}>Pertanyaan Umum</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                  <span style={{ fontWeight: '600', color: '#001D39', fontSize: '0.95rem' }}>{faq.q}</span>
                  <Icon icon={openFaq === i ? 'mdi:chevron-up' : 'mdi:chevron-down'} style={{ color: '#D4A017', fontSize: '22px', flexShrink: 0 }} />
                </button>
                {openFaq === i && <div style={{ padding: '0 20px 18px', color: '#64748b', lineHeight: 1.7, fontSize: '0.9rem' }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #001D39, #0a2744)', padding: isLargeMobile ? '60px 24px' : '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>Mulai Desain Kemasan Anda Sekarang</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.7 }}>Tim kami siap konsultasi gratis dan membantu Anda mendapatkan kemasan yang sempurna.</p>
        <a href="https://wa.me/6281260001487?text=Halo%2C%20saya%20ingin%20cetak%20kemasan%20custom" target="_blank" rel="noopener noreferrer"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', padding: '16px 40px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Icon icon="mdi:whatsapp" fontSize="24" /> Hubungi Kami Sekarang
        </a>
      </section>

      <Footer />
    </div>
  );
}
