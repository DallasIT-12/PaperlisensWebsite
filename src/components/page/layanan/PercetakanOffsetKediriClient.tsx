'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const products = [
  { name: 'Kotak Hampers', slug: 'kotak-hampers', img: '/kotak%20hampers.webp', desc: 'Box hampers premium untuk parsel lebaran, natal & corporate gift' },
  { name: 'Kotak Bakery', slug: 'kotak-bakery', img: '/kotak%20cake.webp', desc: 'Box kue, cupcake & bakery berbahan food grade' },
  { name: 'Kotak Rokok', slug: 'rokok', img: '/custom%20rokok%203.webp', desc: 'Kemasan rokok presisi tinggi sesuai standar pabrik' },
  { name: 'Kotak Nasi', slug: 'kotak-nasi', img: '/kotak%20nasi%20(1).webp', desc: 'Box nasi food grade tahan panas & minyak untuk katering' },
  { name: 'Paperbag', slug: 'paperbag', img: '/paperbag.webp', desc: 'Paperbag custom logo untuk retail & event' },
  { name: 'Brosur', slug: 'brosur', img: '/foto%20brosur.webp', desc: 'Brosur & flyer promosi full color tajam' },
  { name: 'Kalender', slug: 'kalender', img: '/foto%20kalender.webp', desc: 'Kalender custom perusahaan & corporate' },
  { name: 'Buku', slug: 'buku', img: '/buku%20(6).webp', desc: 'Cetak buku, katalog & company profile' },
  { name: 'Map', slug: 'map', img: '/map.webp', desc: 'Map / folder dokumen perusahaan & instansi' },
];

const whyUs = [
  { icon: 'mdi:factory', title: 'Sejak 1983', desc: '40+ tahun pengalaman di industri percetakan offset Indonesia. Ribuan klien dari UMKM hingga perusahaan besar.' },
  { icon: 'mdi:printer-check', title: 'Mesin Offset Presisi', desc: 'Menggunakan mesin offset modern dengan akurasi cetak & cutting tinggi untuk hasil yang sempurna.' },
  { icon: 'mdi:truck-delivery', title: 'Kirim Seluruh Indonesia', desc: 'Tidak hanya melayani Kediri & Jawa Timur. Produk kami dikirim ke seluruh wilayah Indonesia via kargo terpercaya.' },
  { icon: 'mdi:currency-usd-off', title: 'Harga Kompetitif', desc: 'Harga langsung dari pabrik, tanpa perantara. Semakin banyak order, semakin murah harga per unit.' },
  { icon: 'mdi:palette', title: 'Tim Desainer Profesional', desc: 'Tidak punya desain? Tim kami siap membantu dari konsep hingga file siap cetak tanpa biaya tambahan.' },
  { icon: 'mdi:shield-check', title: 'Kualitas Terjamin', desc: 'Setiap produk melalui quality control ketat sebelum dikirim. Garansi cetak ulang jika ada cacat produksi.' },
];

const faqs = [
  { q: 'Apa itu percetakan offset dan apa bedanya dengan digital printing?', a: 'Percetakan offset menggunakan pelat cetak yang menghasilkan warna lebih akurat dan konsisten untuk jumlah besar (500+ pcs). Digital printing langsung dari file digital, cocok untuk jumlah kecil tapi harga per unit lebih mahal untuk order besar.' },
  { q: 'Produk apa saja yang bisa dicetak di Percetakan Dallas Kediri?', a: 'Kami melayani: kotak hampers custom, box makanan food grade, kemasan rokok, kotak bakery, paperbag, brosur & flyer, kalender, buku, map perusahaan, dan berbagai kemasan custom lainnya.' },
  { q: 'Apakah Percetakan Dallas melayani seluruh Indonesia?', a: 'Ya! Meskipun berlokasi di Kediri, Jawa Timur, kami melayani pengiriman ke seluruh Indonesia menggunakan ekspedisi kargo terpercaya.' },
  { q: 'Berapa lama pengerjaan order?', a: 'Standar 5-7 hari kerja setelah desain disetujui dan DP masuk. Tersedia layanan express 2-3 hari kerja untuk order mendesak.' },
  { q: 'Bagaimana cara memesan?', a: '1) Hubungi via WhatsApp, 2) Konsultasikan kebutuhan (produk, ukuran, jumlah, desain), 3) Terima penawaran harga, 4) ACC desain + bayar DP 50%, 5) Proses cetak, 6) Pelunasan saat barang selesai.' },
];

export default function PercetakanOffsetKediriClient() {
  const [isLargeMobile, setIsLargeMobile] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const check = () => setIsLargeMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', color: '#1e293b', fontFamily: 'var(--font-plus-jakarta-sans)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #001D39 0%, #0a2744 50%, #001D39 100%)',
        paddingTop: isLargeMobile ? '140px' : '180px',
        paddingBottom: isLargeMobile ? '60px' : '100px',
        paddingLeft: '24px', paddingRight: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,65,116,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: '50px', padding: '8px 20px', marginBottom: '24px' }}>
              <Icon icon="mdi:map-marker" style={{ color: '#D4A017', fontSize: '16px' }} />
              <span style={{ color: '#D4A017', fontSize: '14px', fontWeight: '600' }}>Kediri, Jawa Timur • Sejak 1983</span>
            </div>
            <h1 style={{ fontSize: isLargeMobile ? '2rem' : '3.5rem', fontWeight: '800', color: '#fff', lineHeight: 1.2, marginBottom: '20px' }}>
              Percetakan Offset Kediri<br />
              <span style={{ color: '#D4A017' }}>Terpercaya & Berkualitas</span>
            </h1>
            <p style={{ fontSize: isLargeMobile ? '1rem' : '1.2rem', color: 'rgba(255,255,255,0.75)', maxWidth: '680px', margin: '0 auto 36px', lineHeight: 1.7 }}>
              Spesialis cetak box kemasan custom, offset printing, dan produk komersial untuk UMKM hingga perusahaan besar. Harga kompetitif, kualitas presisi, kirim ke seluruh Indonesia.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20ingin%20konsultasi%20cetak" target="_blank" rel="noopener noreferrer"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon="mdi:whatsapp" fontSize="20" /> Konsultasi Gratis
              </a>
              <Link href="/id"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon="mdi:view-grid" fontSize="18" /> Lihat Semua Produk
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section style={{ background: '#D4A017', padding: '24px', display: 'flex', justifyContent: 'center', gap: isLargeMobile ? '24px' : '60px', flexWrap: 'wrap' }}>
        {[
          { num: '40+', label: 'Tahun Pengalaman' },
          { num: '10.000+', label: 'Klien Puas' },
          { num: '9', label: 'Kategori Produk' },
          { num: '100%', label: 'Kirim Seluruh Indonesia' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '800', color: '#001D39' }}>{s.num}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'rgba(0,29,57,0.8)' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Products Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: isLargeMobile ? '60px 24px' : '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ width: '40px', height: '2px', background: '#D4A017' }} />
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '2px', color: '#D4A017', textTransform: 'uppercase' }}>Produk Unggulan</span>
            <span style={{ width: '40px', height: '2px', background: '#D4A017' }} />
          </div>
          <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.5rem', fontWeight: '800', color: '#001D39' }}>Layanan Cetak Offset Dallas</h2>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '16px auto 0', lineHeight: 1.7 }}>Dari kemasan makanan food grade hingga produk komersial — semua dikerjakan dengan presisi mesin offset dan pengalaman 40+ tahun.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
          {products.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/id/produk/${p.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', transition: 'all 0.3s', cursor: 'pointer', background: '#fff' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,29,57,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                  <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                    <img src={p.img} alt={`${p.name} Custom - Percetakan Dallas Kediri`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontWeight: '700', fontSize: '1rem', color: '#001D39', marginBottom: '6px' }}>{p.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{p.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', color: '#D4A017', fontSize: '0.85rem', fontWeight: '600' }}>
                      Lihat Detail <Icon icon="mdi:arrow-right" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section style={{ background: '#f8fafc', padding: isLargeMobile ? '60px 24px' : '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.5rem', fontWeight: '800', color: '#001D39' }}>Mengapa Pilih Percetakan Dallas?</h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '16px auto 0' }}>Bukan sekadar percetakan biasa — kami adalah mitra bisnis jangka panjang yang memahami kebutuhan Anda.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
            {whyUs.map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #001D39, #0a2744)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon icon={w.icon} style={{ color: '#D4A017', fontSize: '24px' }} />
                </div>
                <h3 style={{ fontWeight: '700', color: '#001D39', marginBottom: '8px' }}>{w.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: isLargeMobile ? '60px 24px' : '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#001D39' }}>Pertanyaan Umum</h2>
          <p style={{ color: '#64748b', marginTop: '12px' }}>Jawaban dari pertanyaan yang sering kami terima</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                <span style={{ fontWeight: '600', color: '#001D39', fontSize: '1rem', lineHeight: 1.4 }}>{faq.q}</span>
                <Icon icon={openFaq === i ? 'mdi:chevron-up' : 'mdi:chevron-down'} style={{ color: '#D4A017', fontSize: '24px', flexShrink: 0 }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 20px', color: '#64748b', lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #001D39, #0a2744)', padding: isLargeMobile ? '60px 24px' : '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isLargeMobile ? '1.75rem' : '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>Siap Mulai Cetak?</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.7 }}>Konsultasikan kebutuhan cetak Anda sekarang. Tim ahli kami siap membantu 24/7.</p>
        <a href="https://wa.me/6281260001487?text=Halo%20kak%2C%20saya%20ingin%20konsultasi%20cetak%20di%20Percetakan%20Dallas" target="_blank" rel="noopener noreferrer"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', padding: '16px 40px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Icon icon="mdi:whatsapp" fontSize="24" /> Hubungi Kami Sekarang
        </a>
      </section>

      <Footer />
    </div>
  );
}
