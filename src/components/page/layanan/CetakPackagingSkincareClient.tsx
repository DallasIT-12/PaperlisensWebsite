'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const packagingItems = [
  { name: 'Box Serum & Toner', icon: 'mdi:bottle-tonic', desc: 'Box custom untuk serum, toner, dan essence dengan desain elegan dan finishing premium.' },
  { name: 'Box Krim & Moisturizer', icon: 'mdi:hand-wave', desc: 'Kemasan krim wajah dan pelembab dengan material Ivory 310gsm yang kokoh.' },
  { name: 'Paperbag Skincare', icon: 'mdi:shopping', desc: 'Paperbag custom untuk brand skincare dengan full color printing dan tali premium.' },
  { name: 'Box Lip Product', icon: 'mdi:lipstick', desc: 'Kemasan lipstik, lip balm, dan lip gloss yang presisi dan eksklusif.' },
  { name: 'Box Alat Kecantikan', icon: 'mdi:scissors-cutting', desc: 'Box packaging untuk alat kecantikan: sisir, kuas makeup, dan peralatan lainnya.' },
  { name: 'Hampers Kecantikan', icon: 'mdi:gift', desc: 'Box hampers premium untuk gift set skincare dan paket kecantikan.' },
];

const finishings = [
  { name: 'Laminasi Doff', icon: 'mdi:layers', desc: 'Tampilan matte elegan yang terasa premium saat dipegang. Pilihan paling populer untuk brand skincare minimalis.' },
  { name: 'Laminasi Glossy', icon: 'mdi:brightness-5', desc: 'Kilap premium yang membuat warna terlihat lebih vibrant. Cocok untuk brand dengan desain berwarna cerah.' },
  { name: 'Spot UV', icon: 'mdi:spotlight', desc: 'Efek kilap parsial pada elemen tertentu (logo, teks). Menciptakan tampilan kontras matte-glossy yang eksklusif.' },
  { name: 'Emboss / Deboss', icon: 'mdi:texture-box', desc: 'Logo atau teks yang timbul (emboss) atau tertekan (deboss) ke dalam material — kesan luxury tanpa warna.' },
  { name: 'Hotprint Foil', icon: 'mdi:star-four-points', desc: 'Foil emas atau perak yang ditempel panas — memberikan kesan mewah dan premium seperti produk luxury di toko.' },
  { name: 'Soft Touch', icon: 'mdi:hand-okay', desc: 'Laminasi khusus yang terasa lembut dan beludru saat disentuh. Meningkatkan persepsi kualitas produk secara signifikan.' },
];

const whyMatters = [
  { icon: 'mdi:trending-up', title: 'Meningkatkan Nilai Jual', desc: 'Penelitian menunjukkan 72% konsumen memutuskan pembelian berdasarkan tampilan kemasan. Kemasan premium = harga jual lebih tinggi.' },
  { icon: 'mdi:account-heart', title: 'Membangun Brand Trust', desc: 'Kemasan yang konsisten dan profesional membangun kepercayaan konsumen terhadap kualitas produk skincare Anda.' },
  { icon: 'mdi:share-variant', title: 'Viral di Social Media', desc: 'Kemasan estetik mendorong unboxing video dan posting organik di Instagram & TikTok — promosi gratis untuk brand Anda.' },
];

const faqs = [
  { q: 'Material apa yang direkomendasikan untuk kemasan skincare?', a: 'Kami merekomendasikan Ivory Paper 310gsm untuk kemasan skincare. Material ini memiliki satu sisi white glossy untuk cetak full color tajam dan aman untuk produk kosmetik.' },
  { q: 'Finishing apa saja yang tersedia untuk kemasan skincare premium?', a: 'Tersedia: laminasi doff (matte elegan), laminasi glossy, spot UV, emboss/deboss, hotprint foil emas/perak, dan soft touch coating.' },
  { q: 'Berapa minimal order cetak kemasan skincare?', a: 'Minimal order 500 pcs untuk offset printing. Untuk brand baru yang ingin trial, tersedia digital printing mulai 100 pcs.' },
  { q: 'Apakah bisa konsultasi ukuran kemasan yang tepat untuk produk saya?', a: 'Tentu! Tim kami akan membantu mengukur dimensi produk Anda dan merekomendasikan ukuran box yang paling pas, estetis, dan efisien dari sisi biaya produksi.' },
];

export default function CetakPackagingSkincareClient() {
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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        paddingTop: isLargeMobile ? '140px' : '180px',
        paddingBottom: isLargeMobile ? '60px' : '100px',
        paddingLeft: '24px', paddingRight: '24px',
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,100,150,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '50px', padding: '8px 20px', marginBottom: '24px' }}>
            <Icon icon="mdi:bottle-tonic-plus" style={{ color: '#D4A017', fontSize: '16px' }} />
            <span style={{ color: '#D4A017', fontSize: '14px', fontWeight: '600' }}>Kemasan Skincare & Kosmetik Premium</span>
          </div>
          <h1 style={{ fontSize: isLargeMobile ? '2rem' : '3.5rem', fontWeight: '800', color: '#fff', lineHeight: 1.2, marginBottom: '20px' }}>
            Cetak Kemasan Skincare<br />
            <span style={{ color: '#D4A017' }}>Yang Menjual & Memikat</span>
          </h1>
          <p style={{ fontSize: isLargeMobile ? '1rem' : '1.15rem', color: 'rgba(255,255,255,0.72)', maxWidth: '620px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Kemasan adalah wajah brand skincare Anda. Kami cetak kemasan kosmetik custom dengan material Ivory premium, finishing eksklusif (spot UV, emboss, hotprint), dan hasil cetak full color yang tajam.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/6281260001487?text=Halo%2C%20saya%20ingin%20konsultasi%20cetak%20kemasan%20skincare" target="_blank" rel="noopener noreferrer"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Icon icon="mdi:whatsapp" fontSize="20" /> Konsultasi Kemasan Gratis
            </a>
          </div>
        </motion.div>
      </section>

      {/* Why Packaging Matters */}
      <section style={{ background: '#f8fafc', padding: isLargeMobile ? '60px 24px' : '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#001D39' }}>Mengapa Kemasan Skincare Itu Penting?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
            {whyMatters.map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4A017, #B8860B)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon icon={w.icon} style={{ color: '#fff', fontSize: '26px' }} />
                </div>
                <h3 style={{ fontWeight: '700', color: '#001D39', marginBottom: '10px' }}>{w.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Types */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: isLargeMobile ? '60px 24px' : '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#001D39' }}>Jenis Kemasan Skincare yang Kami Cetak</h2>
          <p style={{ color: '#64748b', marginTop: '12px' }}>Custom ukuran, material, dan desain sesuai brand Anda</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
          {packagingItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: '#fff', transition: 'all 0.3s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,29,57,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.3)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}>
              <Icon icon={item.icon} style={{ color: '#D4A017', fontSize: '32px', marginBottom: '12px' }} />
              <h3 style={{ fontWeight: '700', color: '#001D39', marginBottom: '8px', fontSize: '0.95rem' }}>{item.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Finishing Options */}
      <section style={{ background: '#001D39', padding: isLargeMobile ? '60px 24px' : '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#fff' }}>Pilihan Finishing Premium</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '12px' }}>Finishing yang tepat mengubah kemasan biasa menjadi pengalaman unboxing yang tak terlupakan</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
            {finishings.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: '16px', padding: '24px' }}>
                <Icon icon={f.icon} style={{ color: '#D4A017', fontSize: '28px', marginBottom: '12px' }} />
                <h3 style={{ fontWeight: '700', color: '#fff', marginBottom: '8px', fontSize: '0.95rem' }}>{f.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: isLargeMobile ? '60px 24px' : '90px 24px' }}>
        <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2rem', fontWeight: '800', color: '#001D39', textAlign: 'center', marginBottom: '40px' }}>Pertanyaan Seputar Kemasan Skincare</h2>
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
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: isLargeMobile ? '60px 24px' : '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>Wujudkan Kemasan Skincare Impian Anda</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.7 }}>Konsultasi gratis dengan tim ahli kami. Dapatkan penawaran terbaik sesuai kebutuhan brand Anda.</p>
        <a href="https://wa.me/6281260001487?text=Halo%2C%20saya%20ingin%20konsultasi%20cetak%20kemasan%20skincare%20custom" target="_blank" rel="noopener noreferrer"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', padding: '16px 40px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Icon icon="mdi:whatsapp" fontSize="24" /> Konsultasi Skincare Packaging
        </a>
      </section>

      <Footer />
    </div>
  );
}
