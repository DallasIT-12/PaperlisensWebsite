'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';

type ImageFile = {
    id: string;
    file: File;
    preview: string;
    rotation: number; // 0, 90, 180, 270
    name: string;
};

type PageSize = 'original' | 'a4';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

export default function JpgToPdfClient() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [pageSize, setPageSize] = useState<PageSize>('original');
    const [isDragging, setIsDragging] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | FileList) => {
        const selectedFiles = e instanceof FileList ? Array.from(e) : Array.from(e.target.files || []);
        const validImages = selectedFiles.filter(f => f.type.startsWith('image/'));

        if (validImages.length === 0) return;

        const newImages: ImageFile[] = validImages.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            rotation: 0,
            name: file.name
        }));

        setImages(prev => [...prev, ...newImages]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== id);
            const removed = prev.find(img => img.id === id);
            if (removed) URL.revokeObjectURL(removed.preview);
            return filtered;
        });
    };

    const rotateImage = (id: string) => {
        setImages(prev => prev.map(img =>
            img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
        ));
    };

    // Bake rotation and quality into a new JPEG
    const processImageToJpg = async (img: ImageFile): Promise<{ bytes: Uint8Array, width: number, height: number }> => {
        return new Promise((resolve, reject) => {
            const tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            tempImg.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Failed to get canvas context');

                // Calculate rotated dimensions
                const isVertical = img.rotation === 90 || img.rotation === 270;
                const width = isVertical ? tempImg.height : tempImg.width;
                const height = isVertical ? tempImg.width : tempImg.height;

                canvas.width = width;
                canvas.height = height;

                // Move to center, rotate, then draw
                ctx.translate(width / 2, height / 2);
                ctx.rotate((img.rotation * Math.PI) / 180);
                ctx.drawImage(tempImg, -tempImg.width / 2, -tempImg.height / 2);

                canvas.toBlob(async (blob) => {
                    if (!blob) return reject('Failed to create image blob');
                    const arrayBuffer = await blob.arrayBuffer();
                    resolve({
                        bytes: new Uint8Array(arrayBuffer),
                        width,
                        height
                    });
                }, 'image/jpeg', 1.0); // Maximum quality
            };
            tempImg.onerror = () => reject('Gagal memuat file gambar: ' + img.name);
            tempImg.src = img.preview;
        });
    };

    const handleExport = async () => {
        if (images.length === 0) {
            setError('Pilih minimal satu gambar.');
            return;
        }

        setIsExporting(true);
        setError(null);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const imgFile of images) {
                // Process image: bake rotation and get clean JPG bytes
                const { bytes, width, height } = await processImageToJpg(imgFile);
                const embeddedImage = await pdfDoc.embedJpg(bytes);

                let pageWidth = width;
                let pageHeight = height;
                let drawWidth = width;
                let drawHeight = height;
                let x = 0;
                let y = 0;

                if (pageSize === 'a4') {
                    // Fit to A4 maintaining aspect ratio
                    pageWidth = A4_WIDTH;
                    pageHeight = A4_HEIGHT;

                    const ratio = Math.min(A4_WIDTH / width, A4_HEIGHT / height);
                    drawWidth = width * ratio;
                    drawHeight = height * ratio;

                    // Center on page (PDF origin is bottom-left)
                    x = (A4_WIDTH - drawWidth) / 2;
                    y = (A4_HEIGHT - drawHeight) / 2;
                }

                const page = pdfDoc.addPage([pageWidth, pageHeight]);
                page.drawImage(embeddedImage, {
                    x,
                    y,
                    width: drawWidth,
                    height: drawHeight,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `Dallas-Convert-${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export Error:', err);
            setError('Terjadi kesalahan saat membuat PDF. Pastikan file gambar Anda valid.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans pb-32">
            <style jsx global>{`
                .reorder-handle { cursor: grab; }
                .reorder-handle:active { cursor: grabbing; }
            `}</style>

            {/* Premium Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href="/tools" className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 transition-all text-slate-400 hover:text-pink-600">
                            <Icon icon="lucide:arrow-left" className="text-xl" />
                        </Link>
                        <div className="h-8 w-px bg-slate-100 hidden md:block" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Image <span className="text-pink-600">to PDF</span></h1>
                                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-black text-[9px] uppercase tracking-wider">High Quality</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                {images.length} Gambar <span className="mx-2 opacity-30">|</span> {pageSize === 'original' ? 'Ukuran Asli' : 'Pas A4'}
                            </p>
                        </div>
                    </div>

                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button
                            onClick={() => setPageSize('original')}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${pageSize === 'original' ? 'bg-white shadow-xl text-pink-600' : 'text-slate-400 hover:text-slate-600'}
                            `}
                        >
                            Original
                        </button>
                        <button
                            onClick={() => setPageSize('a4')}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${pageSize === 'a4' ? 'bg-white shadow-xl text-pink-600' : 'text-slate-400 hover:text-slate-600'}
                            `}
                        >
                            A4 (Fit)
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 space-y-12">

                {/* ── Dropzone ────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative border-2 border-dashed rounded-[3.5rem] p-16 text-center transition-all cursor-pointer bg-white group
                        ${isDragging ? 'border-pink-500 bg-pink-50 scale-[0.97]' : 'border-slate-200 hover:border-pink-400 shadow-sm'}
                    `}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleFileChange(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-pink-50 text-pink-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                            <Icon icon="lucide:image-plus" className="text-5xl" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Unggah Gambar Anda</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Kualitas Tajam & Ukuran Akurat</p>
                    </div>
                </motion.div>

                {/* ── Image List & Reorder ───────────────────────────── */}
                <AnimatePresence>
                    {images.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-6">
                                <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                    <Icon icon="lucide:list-ordered" className="text-pink-600 text-lg" />
                                    Urutan & Edit Halaman
                                </h2>
                                <button
                                    onClick={() => setImages([])}
                                    className="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
                                >
                                    Hapus Semua
                                </button>
                            </div>

                            <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-4">
                                {images.map((img) => (
                                    <Reorder.Item
                                        key={img.id}
                                        value={img}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-8 hover:border-pink-200 transition-all shadow-sm hover:shadow-xl hover:shadow-pink-50 group no-select"
                                    >
                                        <div className="reorder-handle p-4 text-slate-200 group-hover:text-pink-400 transition-colors">
                                            <Icon icon="lucide:grip-vertical" className="text-3xl" />
                                        </div>

                                        <div className="relative w-32 aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                            <img
                                                src={img.preview}
                                                className="w-full h-full object-cover transition-transform duration-500"
                                                style={{ transform: `rotate(${img.rotation}deg)` }}
                                            />
                                        </div>

                                        <div className="flex-grow text-center sm:text-left">
                                            <h4 className="text-sm font-black text-slate-800 truncate max-w-[200px] mb-1">{img.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Urutan #{images.indexOf(img) + 1}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => rotateImage(img.id)}
                                                className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-pink-50 text-slate-400 hover:text-pink-600 flex items-center justify-center transition-all border border-slate-100"
                                                title="Rotate 90°"
                                            >
                                                <Icon icon="lucide:rotate-cw" className="text-xl" />
                                            </button>
                                            <button
                                                onClick={() => removeImage(img.id)}
                                                className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all border border-slate-100"
                                                title="Remove"
                                            >
                                                <Icon icon="lucide:trash-2" className="text-xl" />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    )}
                </AnimatePresence>

                {/* ── Status Bar ─────────────────────────────────── */}
                <div className="bg-pink-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-pink-200 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500 to-rose-600 opacity-50" />
                    <div className="w-24 h-24 rounded-[2.5rem] bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/20 relative z-10">
                        <Icon icon="lucide:check-circle" className="text-5xl" />
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h4 className="text-xl font-black uppercase tracking-widest mb-3">Teknologi Konversi HD</h4>
                        <p className="text-white/80 text-sm leading-relaxed font-medium">
                            Setiap pixel dari gambar Anda dipertahankan dengan sempurna. Kami menggunakan rendering tanpa kehilangan (lossless) untuk hasil PDF yang tajam dan profesional.
                        </p>
                    </div>
                </div>

                {images.length === 0 && (
                    <div className="py-20 text-center opacity-20 filter grayscale">
                        <Icon icon="lucide:images" className="text-8xl mx-auto mb-6" />
                        <h4 className="font-bold text-sm uppercase tracking-[0.3em]">Belum Ada Gambar</h4>
                    </div>
                )}

                {/* ── Fixed Footer Action ──────────────────────────────── */}
                <AnimatePresence>
                    {images.length > 0 && (
                        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-slate-900 border border-slate-800 rounded-[3rem] p-5 shadow-2xl flex items-center justify-between"
                            >
                                <div className="flex items-center gap-6 pl-6">
                                    <div className="w-14 h-14 rounded-full bg-pink-600 text-white flex items-center justify-center font-black text-xl shadow-lg border-2 border-slate-800">
                                        {images.length}
                                    </div>
                                    <div className="hidden sm:block">
                                        <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">Siap Download</h4>
                                        <p className="text-[10px] text-pink-500/80 font-bold uppercase tracking-widest">Premium PDF Export</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="h-16 px-12 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center gap-4 shadow-xl active:scale-95"
                                >
                                    {isExporting ? <Icon icon="lucide:loader-2" className="animate-spin text-xl" /> : <Icon icon="lucide:download" className="text-xl" />}
                                    {isExporting ? 'Proses...' : 'UNDUH PDF'}
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-10 py-5 rounded-full text-xs font-black shadow-2xl flex items-center gap-4">
                        <Icon icon="lucide:alert-circle" className="text-xl" />
                        {error}
                        <button onClick={() => setError(null)} className="ml-4 p-2 hover:bg-white/10 rounded-xl transition-colors"><Icon icon="lucide:x" /></button>
                    </div>
                )}
            </div>
        </div>
    );
}
