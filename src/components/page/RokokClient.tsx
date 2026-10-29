'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { Link } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
// CigaretteBoxThree and FoldingBoxThree removed — using iframe-based CigaretteBoxViewer instead
import CigaretteBoxViewer from '@/components/page/CigaretteBoxViewer';
import { Product, customBoxProducts } from '@/data/customBoxProducts';

// 3D Floating Box Component (Enhanced for Preview)
const FloatingCigaretteBox = ({
    product,
    customImage,
    delay = 0,
    scale = 1,
    isStatic = false,
    rotation = { x: 10, y: -20 },
    onDrag = null,
    openAmount = 0, // 0 to 1
    zoom = 1
}: {
    product?: Product,
    customImage?: string | null,
    delay?: number,
    scale?: number,
    isStatic?: boolean,
    rotation?: { x: number, y: number },
    onDrag?: ((x: number, y: number) => void) | null,
    openAmount?: number,
    zoom?: number
}) => {
    const imageUrl = customImage || product?.image || '/kotak rokok 1.webp';
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleStart = (clientX: number, clientY: number) => {
        if (!onDrag) return;
        setIsDragging(true);
        setStartPos({ x: clientX, y: clientY });
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging || !onDrag) return;
        const deltaX = clientX - startPos.x;
        const deltaY = clientY - startPos.y;
        onDrag(deltaY * 0.5, deltaX * 0.5);
        setStartPos({ x: clientX, y: clientY });
    };

    const handleEnd = () => setIsDragging(false);

    // Hinge height at 75% of box height (180px * 0.75 = 135px)
    const hingeY = 135 * scale;
    const lidRotation = openAmount * -110; // Rotate back up to 110 degrees

    return (
        <div
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
            style={{
                position: 'relative',
                width: '100%',
                height: isStatic ? '300px' : '200px',
                perspective: '1200px',
                animation: isStatic || isDragging ? 'none' : `float ${3 + delay * 0.5}s ease-in-out infinite`,
                animationDelay: `${delay * 0.3}s`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: onDrag ? (isDragging ? 'grabbing' : 'grab') : 'default',
                touchAction: 'none'
            }}
        >
            <div
                style={{
                    width: `${140 * scale * zoom}px`,
                    height: `${180 * scale * zoom}px`,
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
            >
                {/* 1. BASE GROUP (Non-moving part) */}
                <div style={{ transformStyle: 'preserve-3d', position: 'absolute', inset: 0 }}>
                    {/* Front-Base */}
                    <div style={{
                        position: 'absolute', width: '100%', height: '75%', bottom: 0,
                        transform: `translateZ(${35 * scale * zoom}px)`,
                        borderRadius: '0 0 2px 2px', overflow: 'hidden', backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', backfaceVisibility: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-25%', width: '100%', height: '133%' }}>
                            <Image src={imageUrl} alt="Base Front" width={420} height={540} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                    {/* Back-Base (Full back for hinge support) */}
                    <div style={{
                        position: 'absolute', width: '100%', height: '100%',
                        transform: `rotateY(180deg) translateZ(${35 * scale * zoom}px)`,
                        borderRadius: '2px', overflow: 'hidden', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.05)', backfaceVisibility: 'hidden'
                    }}>
                        <Image src={imageUrl} alt="Back" width={420} height={540} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                    </div>
                    {/* Sides-Base */}
                    <div style={{ // Right
                        position: 'absolute', width: `${70 * scale * zoom}px`, height: '75%', bottom: 0, right: `${-35 * scale * zoom}px`,
                        background: '#1a1a1a', transform: 'rotateY(90deg)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', backfaceVisibility: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-25%', width: '100%', height: '133%' }}>
                            <Image src={imageUrl} alt="Side" width={420} height={540} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'brightness(0.5)' }} />
                        </div>
                    </div>
                    <div style={{ // Left
                        position: 'absolute', width: `${70 * scale * zoom}px`, height: '75%', bottom: 0, left: `${-35 * scale * zoom}px`,
                        background: '#1a1a1a', transform: 'rotateY(-90deg)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', backfaceVisibility: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-25%', width: '100%', height: '133%' }}>
                            <Image src={imageUrl} alt="Side" width={420} height={540} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'brightness(0.5)' }} />
                        </div>
                    </div>
                    {/* Bottom Face */}
                    <div style={{
                        position: 'absolute', width: '100%', height: `${70 * scale * zoom}px`, bottom: `${-35 * scale * zoom}px`,
                        background: '#050505', transform: 'rotateX(-90deg)', border: '1px solid rgba(255,255,255,0.05)', backfaceVisibility: 'hidden'
                    }}>
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }} />
                    </div>

                    {/* Inner Content (Cigarettes visual) */}
                    <div style={{
                        position: 'absolute', width: '90%', height: '80%', top: '5%', left: '5%',
                        background: 'linear-gradient(to bottom, #d4d4d4, #888)',
                        transform: `translateZ(0px)`,
                        borderRadius: '2px', overflow: 'hidden', border: '1px solid #999',
                        display: openAmount > 0.1 ? 'flex' : 'none',
                        flexDirection: 'row', justifyContent: 'space-around', padding: '5px'
                    }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ width: '10%', height: '100%', background: 'white', borderRadius: '10px 10px 0 0', boxShadow: 'inset 0 10px 10px rgba(0,0,0,0.1)' }} />
                        ))}
                    </div>
                </div>

                {/* 2. LID GROUP (Rotating part) */}
                <div style={{
                    transformStyle: 'preserve-3d', position: 'absolute', width: '100%', height: '25%', top: 0,
                    transformOrigin: `center ${45 * scale * zoom}px -${35 * scale * zoom}px`, // hinge at the top back edge
                    transform: `rotateX(${lidRotation}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    {/* Front-Lid */}
                    <div style={{
                        position: 'absolute', width: '100%', height: '100%', top: 0,
                        transform: `translateZ(${35 * scale * zoom}px)`,
                        borderRadius: '2px 2px 0 0', overflow: 'hidden', backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', backfaceVisibility: 'hidden'
                    }}>
                        <Image src={imageUrl} alt="Lid Front" width={420} height={540} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {/* Sides-Lid */}
                    <div style={{ // Right
                        position: 'absolute', width: `${70 * scale * zoom}px`, height: '100%', top: 0, right: `${-35 * scale * zoom}px`,
                        background: '#1a1a1a', transform: 'rotateY(90deg)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', backfaceVisibility: 'hidden'
                    }}>
                        <Image src={imageUrl} alt="Side" width={420} height={540} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'brightness(0.5)' }} />
                    </div>
                    <div style={{ // Left
                        position: 'absolute', width: `${70 * scale * zoom}px`, height: '100%', top: 0, left: `${-35 * scale * zoom}px`,
                        background: '#1a1a1a', transform: 'rotateY(-90deg)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', backfaceVisibility: 'hidden'
                    }}>
                        <Image src={imageUrl} alt="Side" width={420} height={540} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'brightness(0.5)' }} />
                    </div>
                    {/* Top Face */}
                    <div style={{
                        position: 'absolute', width: '100%', height: `${70 * scale * zoom}px`, top: `${-35 * scale * zoom}px`,
                        background: '#222', transform: 'rotateX(90deg)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', backfaceVisibility: 'hidden'
                    }}>
                        <Image src={imageUrl} alt="Top" width={420} height={540} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2, filter: 'brightness(1.2)' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function RokokClient() {
    const router = useRouter();
    const t = useTranslations();
    const tCat = useTranslations('Categories');
    const tMaterials = useTranslations('Materials');
    const tCommon = useTranslations('Common');
    const tProducts = useTranslations('CustomBoxProducts');

    const [isSmallMobile, setIsSmallMobile] = useState(false);
    const [isMediumMobile, setIsMediumMobile] = useState(false);
    const [isLargeMobile, setIsLargeMobile] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Catalog States
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [filteredProducts, setFilteredProducts] = useState(customBoxProducts);

    // 3D Viewer variant state
    const [selectedVariant, setSelectedVariant] = useState<'red' | 'gold' | 'white'>('red');
    const variantNames: Record<string, string> = { red: 'Red', gold: 'Gold', white: 'White' };

    // Controlled quantity for WhatsApp message
    const [quantity, setQuantity] = useState(1000);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallMobile(window.innerWidth < 480);
            setIsMediumMobile(window.innerWidth < 640);
            setIsLargeMobile(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Set up animations
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotateY(0deg) rotateX(0deg); }
        50% { transform: translateY(-10px) rotateY(0deg) rotateX(0deg); }
      }
      
      .cigarette-box-3d:hover {
        transform: rotateY(15deg) rotateX(10deg) scale(1.05) !important;
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.3); }
        50% { box-shadow: 0 0 40px rgba(217, 119, 6, 0.6), 0 0 60px rgba(217, 119, 6, 0.3); }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
        document.head.appendChild(style);
        return () => { if (document.head.contains(style)) document.head.removeChild(style); };
    }, []);

    // Category Data (for rokok specific)
    const rokokCategory = useMemo(() => ({
        title: tCat('rokok.title'),
        slug: "rokok",
        img: "/foto_rokok_1.webp",
        desc: tCat('rokok.desc'),
        tags: [tCat('rokok.tags.tag1'), tCat('rokok.tags.tag2')],
        gallery: [
            "/foto_rokok_1.webp", "/foto_rokok_2.webp", "/foto_rokok_3.webp", "/foto_rokok_4.webp",
            "/foto_rokok_5.webp", "/foto_rokok_6.webp", "/foto_rokok_7.webp", "/foto_rokok_8.webp",
            "/custom%20rokok%20(1).webp", "/custom%20rokok%20(10).webp", "/custom%20rokok%20(11).webp",
            "/custom%20rokok%20(12).webp", "/custom%20rokok%20(13).webp", "/custom%20rokok%20(14).webp",
            "/custom%20rokok%20(15).webp", "/custom%20rokok%20(16).webp", "/custom%20rokok%20(17).webp",
            "/custom%20rokok%20(18).webp", "/custom%20rokok%20(19).webp", "/custom%20rokok%20(2).webp",
            "/custom%20rokok%20(20).webp", "/custom%20rokok%20(21).webp", "/custom%20rokok%20(22).webp",
            "/custom%20rokok%20(23).webp", "/custom%20rokok%20(24).webp", "/custom%20rokok%20(3).webp",
            "/custom%20rokok%20(4).webp", "/custom%20rokok%20(5).webp", "/custom%20rokok%20(6).webp",
            "/custom%20rokok%20(7).webp", "/custom%20rokok%20(8).webp", "/custom%20rokok%20(9).webp",
            "/custom%20rokok%201.webp", "/custom%20rokok%202.webp", "/custom%20rokok%203.webp",
            "/custom%20rokok%204.webp", "/custom%20rokok.webp", "/foto%20rokok%201.webp",
            "/foto%20rokok.webp", "/kotak%20rokok%201.webp"
        ],
        explanation: "Secara umum, kotak rokok adalah wadah atau kemasan fungsional yang dirancang khusus untuk menyimpan, melindungi, dan menjaga kualitas produk tembakau (rokok) di dalamnya selama proses distribusi hingga sampai ke tangan konsumen. fungsi spesifik dari kotak rokok adalah untuk menjaga agar batang rokok tidak patah, tidak hancur, dan terlindungi dari Udara yang dapat merusak rasa/aroma. selain itu sebagai identitas visual dan sebuah branding Utama untuk membedakan dengan merek lain. menjadi media untuk menampilkan informasi legal yang telah ditetapkan oleh pemerintah seperti peringatan Kesehatan bergambar, informasi kandungan tar/nikotin, dan tempat peletakan pita cukai. kotak rokok dibuat untuk menampung rokok dalam jumlah tertentu umumnya 12,16 dan 20 batang agar mudah dibawa dalam saku. Didalam dunia rokok, kotak rokok menjadi satu standar tertinggi dalam kualitas cetak karena membutuhkan presisi ukuran dan detail kecil yang sangat rumit. Di dallas telah mencetak jutaan kotak rokok dengan berbagai desain dari yang mudah hingga rumit, semua telah melewati proses standar pabrik guna memberikan hasil yang memuaskan",
        applications: ["Kemasan rokok kretek", "Kemasan rokok filter", "Kemasan cigarillo & cerutu", "Box rokok edisi terbatas / limited edition", "Packaging rokok elektrik (pod)"],
        commonMaterials: ["Ivory Paper", "Tipping Paper", "SBS (Solid Bleached Sulfate) Board", "Inner Frame Board"]
    }), [tCat]);

    // Catalog Logic
    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredProducts(customBoxProducts);
        } else {
            setFilteredProducts(customBoxProducts.filter(product => product.category === selectedCategory));
        }
        setCurrentSlide(0);
    }, [selectedCategory]);

    const productsPerSlide = isLargeMobile ? 1 : 4;
    const totalSlides = Math.ceil(filteredProducts.length / productsPerSlide);

    const getCurrentSlideProducts = () => {
        const start = currentSlide * productsPerSlide;
        return filteredProducts.slice(start, start + productsPerSlide);
    };




    const categories = [
        { value: 'All', label: tProducts('filterAll') },
        { value: 'Premium', label: tProducts('filterPremium') },
        { value: 'Standard', label: tProducts('filterStandard') },
        { value: 'General', label: tProducts('filterGeneral') }
    ];

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b', overflowX: 'hidden' }}>
            <Navbar />

            {/* 1. Hero / Educational Section (White Background) */}
            <main style={{ padding: isLargeMobile ? '2rem 1.5rem' : '4rem 2rem', maxWidth: '1200px', margin: '120px auto 0' }}>
                <div style={{ marginBottom: '32px' }}>
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0A4174', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '1rem' }}>
                        <Icon icon="mdi:arrow-left" />
                        {tCommon('back')}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isLargeMobile ? '1fr' : '1fr 1fr', gap: isLargeMobile ? '2rem' : '4rem', alignItems: 'start', marginBottom: '4rem' }}>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'relative' }}>
                        <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
                            <Image src={rokokCategory.img} alt={rokokCategory.title} width={600} height={600} style={{ borderRadius: '24px', width: '100%', height: 'auto', display: 'block' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, rgba(0,29,57,0.7), transparent)', borderRadius: '0 0 24px 24px', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'linear-gradient(135deg, #0A4174, #001D39)', color: '#fff', padding: '8px 18px', borderRadius: '24px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(10, 65, 116, 0.4)' }}>
                                Produk Unggulan
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 style={{ fontSize: isLargeMobile ? '2rem' : '2.75rem', fontWeight: '800', color: '#001D39', marginBottom: '8px', lineHeight: '1.1' }}>
                            {rokokCategory.title}
                        </h2>
                        <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #D4A017, #B8860B)', borderRadius: '2px', marginBottom: '16px' }} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                            {rokokCategory.tags?.map((tag) => (
                                <span key={tag} style={{ backgroundColor: 'rgba(10, 65, 116, 0.08)', border: '1px solid rgba(10, 65, 116, 0.15)', color: '#0A4174', fontSize: '0.8rem', padding: '6px 14px', borderRadius: '10px', fontWeight: '600' }}>{tag}</span>
                            ))}
                        </div>
                        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#4b5563', marginBottom: '32px' }}>
                            {rokokCategory.explanation}
                        </p>

                        <div style={{ background: 'linear-gradient(145deg, #001D39 0%, #0a2744 100%)', padding: '28px', borderRadius: '20px', border: '1px solid rgba(212, 160, 23, 0.2)', marginBottom: '20px' }}>
                            <h3 style={{ fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#D4A017', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                <Icon icon="mdi:lightbulb-on-outline" /> Kegunaan Umum
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {rokokCategory.applications.map((app, i) => (
                                    <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#e5e7eb', padding: '8px 16px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '500' }}>{app}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(145deg, #001D39 0%, #0a2744 100%)', padding: '28px', borderRadius: '20px', border: '1px solid rgba(212, 160, 23, 0.2)' }}>
                            <h3 style={{ fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#D4A017', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                <Icon icon="mdi:layers-outline" /> Material yang Digunakan
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {rokokCategory.commonMaterials.map((m, i) => (
                                    <span key={i} style={{ background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.15), rgba(184, 134, 11, 0.1))', border: '1px solid rgba(212, 160, 23, 0.3)', color: '#D4A017', padding: '8px 16px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600' }}>{m}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>


            {/* 2.5 — 3D Product Detail Section (Dark with product info) */}
            <section style={{
                background: 'linear-gradient(180deg, #0e0e0e 0%, #001D39 100%)',
                padding: isLargeMobile ? '60px 16px' : '80px 40px',
                color: '#ffffff'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '48px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ width: '30px', height: '1px', background: '#c9a84c' }} />
                            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#c9a84c' }}>3D PRODUCT VIEWER</span>
                            <span style={{ width: '30px', height: '1px', background: '#c9a84c' }} />
                        </div>
                        <h2 style={{ fontSize: isLargeMobile ? '1.5rem' : '2rem', fontWeight: '300', fontFamily: "'Cormorant Garamond', serif" }}>
                            Contoh Kotak Rokok
                        </h2>
                    </motion.div>

                    {/* Product Grid: 50/50 */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isLargeMobile ? '1fr' : '1fr 1fr',
                        gap: isLargeMobile ? '32px' : '48px',
                        alignItems: 'start',
                    }}>
                        {/* LEFT — 3D Viewer */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <CigaretteBoxViewer
                                desktopHeight="560px"
                                mobileHeight="400px"
                                borderRadius={20}
                                variant={selectedVariant}
                            />
                            <p style={{ textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', marginTop: '12px', textTransform: 'uppercase' }}>
                                Drag · Scroll zoom · Klik untuk interaksi
                            </p>
                        </motion.div>

                        {/* RIGHT — Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            {/* Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <span key={i} style={{ color: i <= 4 ? '#D4A017' : 'rgba(255,255,255,0.2)', fontSize: '18px' }}>★</span>
                                ))}
                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginLeft: '4px' }}>4.8 (127 ulasan)</span>
                            </div>

                            {/* Product Name */}
                            <h3 style={{ fontSize: isLargeMobile ? '1.8rem' : '2.2rem', fontWeight: '700', lineHeight: '1.2', margin: 0 }}>
                                Dallas
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                                Varian: <strong style={{ color: '#D4A017' }}>{variantNames[selectedVariant]}</strong>
                            </p>

                            {/* SKU & Category */}
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>SKU: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>DLS-RKK-001</strong></span>
                                <span style={{ fontSize: '0.8rem', background: 'rgba(212,160,23,0.15)', color: '#D4A017', padding: '3px 12px', borderRadius: '10px', fontWeight: '600' }}>Premium</span>
                            </div>

                            {/* Specs Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px',
                            }}>
                                {[
                                    { label: 'Dimensi', value: '85 × 57 × 22 mm' },
                                    { label: 'Material', value: 'Ivory 230gsm' },
                                    { label: 'Finishing', value: 'Emboss + Hotprint' },
                                    { label: 'Min. Order', value: '1.000 pcs' },
                                ].map((spec, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        padding: '14px 16px',
                                        borderRadius: '12px',
                                    }}>
                                        <div style={{ fontSize: '0.65rem', color: '#D4A017', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>{spec.label}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>{spec.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Variant Selector */}
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Pilih Varian Warna</div>
                                {/* BUG 5 FIX: paddingBottom so active label doesn't clip */}
                                <div style={{ display: 'flex', gap: '12px', paddingBottom: '28px' }}>
                                    {[
                                        { key: 'red' as const, name: 'Red', color: '#c41e1e' },
                                        { key: 'gold' as const, name: 'Gold', color: '#b8860b' },
                                        { key: 'white' as const, name: 'White', color: '#d8d0c0' },
                                    ].map((v) => {
                                        const isActive = selectedVariant === v.key;
                                        return (
                                            <button
                                                key={v.key}
                                                onClick={() => setSelectedVariant(v.key)}
                                                style={{
                                                    width: '52px',
                                                    height: '52px',
                                                    borderRadius: '14px',
                                                    background: v.color,
                                                    border: isActive ? '3px solid #c9a84c' : '2px solid rgba(255,255,255,0.15)',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    transition: 'all 0.25s ease',
                                                    boxShadow: isActive ? '0 0 0 2px rgba(201,168,76,0.25), 0 4px 16px rgba(201,168,76,0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
                                                    transform: isActive ? 'translateY(-2px)' : 'none',
                                                }}
                                                title={v.name}
                                            >
                                                {isActive && <span style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: '#c9a84c', whiteSpace: 'nowrap', fontWeight: '700', letterSpacing: '0.5px' }}>{v.name}</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div style={{ marginTop: '8px' }}>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Jumlah (pcs)</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1000, parseInt(e.target.value) || 1000))}
                                        min={1000}
                                        step={500}
                                        style={{
                                            width: '140px',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: '#ffffff',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Min. 1.000 pcs</span>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                <a
                                    href={`https://wa.me/6281260001487?text=${encodeURIComponent(`Halo Dallas, saya tertarik dengan Kotak Rokok ${variantNames[selectedVariant]} (DLS-RKK-001), jumlah ${quantity.toLocaleString('id-ID')} pcs. Bisa minta info harga?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        padding: '16px 32px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                        color: '#ffffff',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        textDecoration: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <Icon icon="mdi:whatsapp" fontSize="22" />
                                    Pesan Sekarang
                                </a>

                                <button
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        padding: '14px 32px',
                                        borderRadius: '14px',
                                        background: 'transparent',
                                        border: '1px solid rgba(212,160,23,0.4)',
                                        color: '#D4A017',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'inherit',
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; e.currentTarget.style.borderColor = '#D4A017'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,160,23,0.4)'; }}
                                >
                                    <Icon icon="mdi:download-outline" fontSize="20" />
                                    Download Spesifikasi
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Specialized 3D Catalog Section (Dark Navy) */}
            <section style={{
                backgroundColor: '#001D39',
                padding: isLargeMobile ? '80px 16px' : '100px 24px',
                color: '#ffffff'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '16px' }}>Katalog Produk Khusus</h2>
                        <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>Pilih berbagai tingkat finishing untuk box rokok Anda, dari Standard hingga Ultra-Premium.</p>
                    </div>

                    {/* Filter */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
                        {categories.map((cat) => {
                            const isActive = selectedCategory === cat.value;
                            return (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    style={{
                                        padding: '10px 24px',
                                        borderRadius: '25px',
                                        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)',
                                        background: isActive ? '#D4A017' : 'transparent',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        fontWeight: isActive ? '700' : '500',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Carousel / Grid */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {!isLargeMobile && (
                            <button
                                onClick={() => setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides)}
                                style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer' }}
                            >←</button>
                        )}

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isLargeMobile ? '1fr' : 'repeat(4, 1fr)',
                            gap: '24px',
                            width: '100%'
                        }}>
                            {getCurrentSlideProducts().map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={() => setSelectedProduct(product)}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '20px',
                                        padding: '24px',
                                        cursor: 'pointer',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        textAlign: 'left'
                                    }}
                                    whileHover={{ y: -10, background: 'rgba(255, 255, 255, 0.08)' }}
                                >
                                    <FloatingCigaretteBox product={product} />
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '20px', marginBottom: '8px' }}>
                                        {tProducts(`products.${product.translationKey}.name`)}
                                    </h4>
                                    <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.5', height: '40px', overflow: 'hidden' }}>
                                        {tProducts(`products.${product.translationKey}.description`)}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                                        <span style={{ fontSize: '10px', color: '#D4A017', fontWeight: '800', textTransform: 'uppercase' }}>{product.category}</span>
                                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>Min. {product.packSize}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {!isLargeMobile && (
                            <button
                                onClick={() => setCurrentSlide(prev => (prev + 1) % totalSlides)}
                                style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer' }}
                            >→</button>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. Gallery Section (White/Light Grey Background) */}
            <section style={{ padding: '80px 24px', backgroundColor: '#f9fafb' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ width: '30px', height: '1px', background: '#D4A017' }} />
                            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#D4A017' }}>GALLERY</span>
                            <span style={{ width: '30px', height: '1px', background: '#D4A017' }} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#001D39' }}>Portofolio Hasil Produksi</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isLargeMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: isLargeMobile ? '12px' : '24px'
                    }}>
                        {rokokCategory.gallery.map((imageSrc, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedImage(imageSrc)}
                                style={{
                                    position: 'relative',
                                    paddingTop: '100%',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                }}
                            >
                                <Image src={imageSrc} alt={`Gallery ${index}`} fill sizes="300px" style={{ objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,29,57,0.3)', opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={(e) => e.currentTarget.style.opacity = '1'} onMouseOut={(e) => e.currentTarget.style.opacity = '0'}>
                                    <Icon icon="mdi:magnify-plus" fontSize="32" color="#D4A017" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                        onClick={() => setSelectedProduct(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{ background: '#13161b', borderRadius: '24px', maxWidth: '500px', width: '100%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ background: '#D4A017', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                                <span style={{ fontWeight: '800', letterSpacing: '1px' }}>{selectedProduct.category}</span>
                                <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
                            </div>
                            <div style={{ height: '250px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FloatingCigaretteBox product={selectedProduct} scale={1.5} isStatic={true} />
                            </div>
                            <div style={{ padding: '24px', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>{tProducts(`products.${selectedProduct.translationKey}.name`)}</h3>
                                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>{tProducts(`products.${selectedProduct.translationKey}.description`)}</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                                        <span style={{ fontSize: '10px', color: '#D4A017', display: 'block' }}>FINISHING</span>
                                        <span style={{ color: '#fff', fontSize: '13px' }}>{selectedProduct.finishing}</span>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                                        <span style={{ fontSize: '10px', color: '#D4A017', display: 'block' }}>ORDER MINIMAL</span>
                                        <span style={{ color: '#fff', fontSize: '13px' }}>{selectedProduct.packSize}</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://wa.me/6281260001487?text=${encodeURIComponent(tProducts('whatsappMessage', { productName: tProducts(`products.${selectedProduct.translationKey}.name`) }))}`}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: '#fff', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}
                                >
                                    <Icon icon="mdi:whatsapp" fontSize="24" /> {tProducts('chatWhatsApp')}
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Zoom Modal */}
            {selectedImage && (
                <div onClick={() => setSelectedImage(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
                    <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', color: '#fff', padding: '10px' }}><Icon icon="mdi:close" fontSize="24" /></button>
                    <img src={selectedImage} alt="Zoom" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '12px' }} />
                </div>
            )}

            {/* 5. Footer CTA (Alternating Theme) */}
            <div style={{
                marginTop: '80px',
                textAlign: 'center',
                background: 'linear-gradient(145deg, #001D39 0%, #0a2744 50%, #001D39 100%)',
                padding: isLargeMobile ? '40px 24px' : '80px 40px',
                borderRadius: '40px',
                color: 'white',
                maxWidth: '1200px',
                margin: '0 auto 80px',
                border: '1px solid rgba(212, 160, 23, 0.2)'
            }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Mulai Kembangkan Brand Anda</h2>
                <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto 40px' }}>Konsultasi gratis dengan tim Dallas untuk mendapatkan spesifikasi dan harga terbaik untuk produk Anda.</p>
                <a href="https://wa.me/6281260001487" style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', color: 'white', padding: '20px 48px', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)' }}>
                    <Icon icon="mdi:whatsapp" fontSize="28" /> Hubungi Kami Sekarang
                </a>
            </div>

            <Footer />
        </div>
    );
}
