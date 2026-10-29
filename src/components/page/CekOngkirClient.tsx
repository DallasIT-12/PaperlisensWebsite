'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────
type ShippingCost = {
    code: string;
    name: string;
    service: string;
    type: string;
    price: string;
    estimated: string;
};

type ShippingResult = {
    status: number;
    message: string;
    data: {
        summary: {
            courier: string[];
            origin: string;
            destination: string;
            weight: string;
        };
        costs: ShippingCost[];
    };
};

type Region = {
    id: string;
    name: string;
    id_provinsi?: string;
    id_kabupaten?: string;
    id_kecamatan?: string;
};

type SortMode = 'cheapest' | 'fastest';

// ── Courier branding ──────────────────────────────────────────────────
const COURIER_INFO: Record<string, { name: string; icon: string; color: string }> = {
    jne: { name: 'JNE', icon: 'mdi:truck-fast', color: '#D71920' },
    sicepat: { name: 'SiCepat', icon: 'mdi:lightning-bolt', color: '#F5A623' },
    ide: { name: 'ID Express', icon: 'mdi:truck-delivery', color: '#00A650' },
    sap: { name: 'SAP', icon: 'mdi:package-variant-closed', color: '#0066B3' },
    jnt: { name: 'J&T', icon: 'mdi:package-variant-closed', color: '#FF0000' },
    ninja: { name: 'Ninja Xpress', icon: 'mdi:motorbike', color: '#C8102E' },
    tiki: { name: 'TIKI', icon: 'mdi:truck-check', color: '#00529B' },
    lion: { name: 'Lion Parcel', icon: 'mdi:airplane', color: '#E21A22' },
    anteraja: { name: 'AnterAja', icon: 'mdi:motorbike', color: '#00AA13' },
    pos: { name: 'POS Indonesia', icon: 'mdi:email-outline', color: '#FF6600' },
    ncs: { name: 'NCS', icon: 'mdi:truck-delivery', color: '#003399' },
    rex: { name: 'REX', icon: 'mdi:truck-fast', color: '#ED1C24' },
    rpx: { name: 'RPX', icon: 'mdi:package-variant', color: '#000000' },
    sentral: { name: 'Sentral Cargo', icon: 'mdi:truck-cargo-container', color: '#FBB03B' },
    star: { name: 'Star Cargo', icon: 'mdi:star', color: '#FFD700' },
    wahana: { name: 'Wahana', icon: 'mdi:truck-delivery', color: '#00539B' },
    dse: { name: 'DSE', icon: 'mdi:truck-fast', color: '#1B75BC' },
};

const ALL_COURIERS = Object.keys(COURIER_INFO);


// ── Component ─────────────────────────────────────────────────────────
// ── Component ─────────────────────────────────────────────────────────
export default function CekOngkirClient() {
    const [originCity, setOriginCity] = useState<Region | null>(null);
    const [destCity, setDestCity] = useState<Region | null>(null);

    const [weight, setWeight] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ShippingResult | null>(null);
    const [error, setError] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('cheapest');
    const [selectedCouriers, setSelectedCouriers] = useState<string[]>(ALL_COURIERS);


    // Search functionality
    const [originSearch, setOriginSearch] = useState('');
    const [destSearch, setDestSearch] = useState('');
    const [originResults, setOriginResults] = useState<Region[]>([]);
    const [destResults, setDestResults] = useState<Region[]>([]);
    const [searchingOrigin, setSearchingOrigin] = useState(false);
    const [searchingDest, setSearchingDest] = useState(false);
    const [showOriginResults, setShowOriginResults] = useState(false);
    const [showDestResults, setShowDestResults] = useState(false);

    const searchRefOrigin = useRef<HTMLDivElement>(null);
    const searchRefDest = useRef<HTMLDivElement>(null);

    // Click outside to close results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRefOrigin.current && !searchRefOrigin.current.contains(event.target as Node)) {
                setShowOriginResults(false);
            }
            if (searchRefDest.current && !searchRefDest.current.contains(event.target as Node)) {
                setShowDestResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSearchResults = async (query: string, setResults: (list: Region[]) => void, setLoading: (b: boolean) => void) => {
        if (query.length < 3) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/wilayah?type=search&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.value) setResults(data.value);
        } catch (e) {
            console.error('Gagal fetch search results', e);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (originSearch && !originCity) {
                fetchSearchResults(originSearch, setOriginResults, setSearchingOrigin);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [originSearch, originCity]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (destSearch && !destCity) {
                fetchSearchResults(destSearch, setDestResults, setSearchingDest);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [destSearch, destCity]);

    const formatPrice = (price: string) => {
        const num = parseInt(price);
        if (isNaN(num) || num === 0) return '-';
        return 'Rp ' + num.toLocaleString('id-ID');
    };

    const parseDays = (est: string): number => {
        if (!est || est.trim() === '-' || est.trim() === '') return 999;
        const match = est.match(/(\d+)/);
        return match ? parseInt(match[1]) : 999;
    };

    const handleCheck = useCallback(async () => {
        if (!originCity || !destCity) {
            setError('Silakan pilih kota asal dan tujuan');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const weightGrams = Math.round(weight * 1000);
            const courierParam = selectedCouriers.join(',');

            // RajaOngkir uses region IDs for calculation
            const originId = originCity.id;
            const destId = destCity.id;

            const res = await fetch(
                `/api/shipping?origin=${originId}&destination=${destId}&weight=${weightGrams}&courier=${courierParam}`
            );
            const data = await res.json();
            if (!res.ok || data.status !== 200) {
                throw new Error(data.error || 'Gagal mendapatkan data ongkir');
            }
            setResult(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    }, [originCity, destCity, weight, selectedCouriers]);

    // Group and sort results
    const getGroupedCosts = () => {
        if (!result?.data?.costs) return {};
        const grouped: Record<string, ShippingCost[]> = {};
        for (const cost of result.data.costs) {
            if (!grouped[cost.code]) grouped[cost.code] = [];
            grouped[cost.code].push(cost);
        }
        // Sort within each group
        for (const code of Object.keys(grouped)) {
            grouped[code].sort((a, b) => {
                if (sortMode === 'cheapest') {
                    return parseInt(a.price || '0') - parseInt(b.price || '0');
                }
                return parseDays(a.estimated) - parseDays(b.estimated);
            });
        }
        return grouped;
    };

    const getCheapestOverall = () => {
        if (!result?.data?.costs) return null;
        const valid = result.data.costs.filter(c => parseInt(c.price) > 0);
        if (valid.length === 0) return null;
        return valid.reduce((min, c) => parseInt(c.price) < parseInt(min.price) ? c : min);
    };

    const getFastestOverall = () => {
        if (!result?.data?.costs) return null;
        const valid = result.data.costs.filter(c => parseInt(c.price) > 0 && parseDays(c.estimated) < 999);
        if (valid.length === 0) return null;
        return valid.reduce((fast, c) => parseDays(c.estimated) < parseDays(fast.estimated) ? c : fast);
    };

    const grouped = getGroupedCosts();
    const cheapest = getCheapestOverall();
    const fastest = getFastestOverall();

    const toggleCourier = (code: string) => {
        setSelectedCouriers(prev =>
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12">
                    {/* Back Link */}
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#D4A017] transition-colors mb-8">
                        <Icon icon="lucide:arrow-left" className="text-lg" />
                        Kembali ke Beranda
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200"
                            >
                                <Icon icon="lucide:truck" className="text-3xl text-white" />
                            </motion.div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
                            Cek <span className="text-emerald-600">Ongkos Kirim</span>
                        </h1>
                        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
                            Bandingkan ongkir dari <span className="text-emerald-600 font-semibold">RajaOngkir (Komerce)</span>.
                            Akurat, cepat, dan terpercaya untuk seluruh Indonesia.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 pb-16 space-y-6">
                {/* ── Form Card ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Origin Section */}
                        <div className="space-y-4 relative" ref={searchRefOrigin}>
                            <h3 className="text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Icon icon="lucide:map-pin" className="text-lg" />
                                Lokasi Asal
                            </h3>

                            <div className="relative">
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1.5 ml-1">Cari Kota / Kecamatan</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Ketik minimal 3 huruf (cth: Surabaya)"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 transition-all pr-10"
                                        value={originSearch}
                                        onChange={(e) => {
                                            setOriginSearch(e.target.value);
                                            setOriginCity(null);
                                            setShowOriginResults(true);
                                        }}
                                        onFocus={() => setShowOriginResults(true)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        {searchingOrigin ? (
                                            <Icon icon="lucide:loader-2" className="animate-spin" />
                                        ) : originCity ? (
                                            <Icon icon="lucide:check-circle" className="text-emerald-500" />
                                        ) : (
                                            <Icon icon="lucide:search" />
                                        )}
                                    </div>
                                </div>

                                {/* Results Dropdown */}
                                <AnimatePresence>
                                    {showOriginResults && (originResults.length > 0 || searchingOrigin) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                                        >
                                            {searchingOrigin ? (
                                                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                                                    <Icon icon="lucide:loader-2" className="animate-spin" />
                                                    Mencari...
                                                </div>
                                            ) : (
                                                originResults.map((res) => (
                                                    <button
                                                        key={res.id}
                                                        onClick={() => {
                                                            setOriginCity(res);
                                                            setOriginSearch(res.name);
                                                            setShowOriginResults(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-xs hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors group"
                                                    >
                                                        <div className="font-bold text-slate-700 group-hover:text-emerald-600 truncate">{res.name}</div>
                                                    </button>
                                                ))
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Destination Section */}
                        <div className="space-y-4 relative" ref={searchRefDest}>
                            <h3 className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Icon icon="lucide:map-pin" className="text-lg" />
                                Lokasi Tujuan
                            </h3>

                            <div className="relative">
                                <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1.5 ml-1">Cari Kota / Kecamatan</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Ketik minimal 3 huruf (cth: Jakarta)"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-all pr-10"
                                        value={destSearch}
                                        onChange={(e) => {
                                            setDestSearch(e.target.value);
                                            setDestCity(null);
                                            setShowDestResults(true);
                                        }}
                                        onFocus={() => setShowDestResults(true)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        {searchingDest ? (
                                            <Icon icon="lucide:loader-2" className="animate-spin" />
                                        ) : destCity ? (
                                            <Icon icon="lucide:check-circle" className="text-blue-500" />
                                        ) : (
                                            <Icon icon="lucide:search" />
                                        )}
                                    </div>
                                </div>

                                {/* Results Dropdown */}
                                <AnimatePresence>
                                    {showDestResults && (destResults.length > 0 || searchingDest) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                                        >
                                            {searchingDest ? (
                                                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                                                    <Icon icon="lucide:loader-2" className="animate-spin" />
                                                    Mencari...
                                                </div>
                                            ) : (
                                                destResults.map((res) => (
                                                    <button
                                                        key={res.id}
                                                        onClick={() => {
                                                            setDestCity(res);
                                                            setDestSearch(res.name);
                                                            setShowDestResults(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-xs hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors group"
                                                    >
                                                        <div className="font-bold text-slate-700 group-hover:text-blue-600 truncate">{res.name}</div>
                                                    </button>
                                                ))
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mb-8">
                        {/* Weight */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Icon icon="lucide:weight" className="text-emerald-600" />
                                    Berat Paket
                                </label>
                                <span className="text-sm font-bold text-emerald-600">{weight} kg</span>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <input
                                    type="range"
                                    min="0.5"
                                    max="30"
                                    step="0.5"
                                    value={weight}
                                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <div className="flex gap-1.5">
                                    {[1, 2, 5].map(w => (
                                        <button
                                            key={w}
                                            onClick={() => setWeight(w)}
                                            className={`w-10 h-10 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center ${weight === w
                                                ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                                                : 'border-slate-200 text-slate-400 hover:border-slate-300'
                                                }`}
                                        >
                                            {w}k
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Check Button */}
                        <button
                            onClick={handleCheck}
                            disabled={loading || !originCity || !destCity}
                            className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Icon icon="lucide:loader-2" className="text-2xl animate-spin" />
                                    Mengecek...
                                </>
                            ) : (
                                <>
                                    <Icon icon="lucide:search" className="text-2xl" />
                                    Cek Tarif Pengiriman
                                </>
                            )}
                        </button>
                    </div>

                    {/* Courier Selection */}
                    <div className="pt-6 border-t border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Filter Ekspedisi</label>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setSelectedCouriers(selectedCouriers.length === ALL_COURIERS.length ? [] : [...ALL_COURIERS])}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${selectedCouriers.length === ALL_COURIERS.length
                                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                            >
                                Semua
                            </button>
                            {ALL_COURIERS.map(code => {
                                const info = COURIER_INFO[code];
                                const isSelected = selectedCouriers.includes(code);
                                return (
                                    <button
                                        key={code}
                                        onClick={() => toggleCourier(code)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${isSelected
                                            ? 'border-emerald-200 text-slate-900 bg-emerald-50/50'
                                            : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                            }`}
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                                        {info.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* ── Error ─────────────────────────────────────────────── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                <Icon icon="mdi:alert-circle" className="text-xl text-rose-400" />
                            </div>
                            <p className="text-sm text-rose-300 font-medium leading-relaxed">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Results ───────────────────────────────────────────── */}
                <AnimatePresence>
                    {result?.data?.costs && result.data.costs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Summary header */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <Icon icon="lucide:check-circle" className="text-2xl text-emerald-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                                Hasil Perbandingan Tarif
                                            </h2>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                                <span className="text-emerald-600 font-bold">{originCity?.name}</span>
                                                <Icon icon="lucide:arrow-right" className="text-slate-300" />
                                                <span className="text-blue-600 font-bold">{destCity?.name}</span>
                                                <span className="mx-2 text-slate-200">|</span>
                                                <span>{result.data.summary.weight}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Sort toggle */}
                                    <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
                                        <button
                                            onClick={() => setSortMode('cheapest')}
                                            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${sortMode === 'cheapest'
                                                ? 'bg-white text-emerald-600 shadow-md border border-slate-100'
                                                : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            <Icon icon="lucide:banknote" className="text-lg" />
                                            Termurah
                                        </button>
                                        <button
                                            onClick={() => setSortMode('fastest')}
                                            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${sortMode === 'fastest'
                                                ? 'bg-white text-blue-600 shadow-md border border-slate-100'
                                                : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            <Icon icon="lucide:zap" className="text-lg" />
                                            Tercepat
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Best options highlights */}
                            {(cheapest || fastest) && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {cheapest && (
                                        <div className="bg-white border border-emerald-100 rounded-3xl p-6 relative overflow-hidden group shadow-lg shadow-emerald-50">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-100 transition-all" />
                                            <div className="flex items-center gap-2 mb-4">
                                                <Icon icon="lucide:award" className="text-emerald-500 text-xl" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Opsi Termurah</span>
                                            </div>
                                            <p className="text-3xl font-black text-slate-900 mb-1.5 tracking-tight">{formatPrice(cheapest.price)}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-50">
                                                    <Icon icon={COURIER_INFO[cheapest.code]?.icon || 'lucide:truck'} style={{ color: COURIER_INFO[cheapest.code]?.color }} className="text-sm" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-600">
                                                    {COURIER_INFO[cheapest.code]?.name || cheapest.name} <span className="text-slate-200 mx-1">·</span> {cheapest.service}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {fastest && (
                                        <div className="bg-white border border-blue-100 rounded-3xl p-6 relative overflow-hidden group shadow-lg shadow-blue-50">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-100 transition-all" />
                                            <div className="flex items-center gap-2 mb-4">
                                                <Icon icon="lucide:zap" className="text-blue-500 text-xl" />
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Opsi Tercepat</span>
                                            </div>
                                            <p className="text-3xl font-black text-slate-900 mb-1.5 tracking-tight">{formatPrice(fastest.price)}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-50">
                                                    <Icon icon={COURIER_INFO[fastest.code]?.icon || 'lucide:truck'} style={{ color: COURIER_INFO[fastest.code]?.color }} className="text-sm" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-600">
                                                    {COURIER_INFO[fastest.code]?.name || fastest.name} <span className="text-slate-200 mx-1">·</span> {fastest.service}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Courier service list */}
                            {Object.entries(grouped).map(([code, costs], groupIdx) => {
                                const info = COURIER_INFO[code] || { name: code.toUpperCase(), icon: 'lucide:truck', color: '#888' };
                                return (
                                    <motion.div
                                        key={code}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + groupIdx * 0.05 }}
                                        className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-lg shadow-slate-100/50"
                                    >
                                        <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                                    <Icon icon={info.icon} className="text-2xl" style={{ color: info.color }} />
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-slate-900 text-base tracking-tight">{info.name}</h3>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{costs.length} Layanan Tersedia</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-[10px] text-slate-400 uppercase font-black tracking-[0.1em] border-b border-slate-50">
                                                        <th className="text-left px-7 py-4">Nama Layanan</th>
                                                        <th className="text-left px-7 py-4 hidden sm:table-cell">Tipe</th>
                                                        <th className="text-right px-7 py-4">Tarif</th>
                                                        <th className="text-right px-7 py-4">Estimasi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {costs.map((cost, i) => {
                                                        const isCheapest = cheapest && cost.code === cheapest.code && cost.service === cheapest.service && cost.price === cheapest.price;
                                                        const isFastest = fastest && cost.code === fastest.code && cost.service === fastest.service && cost.price === fastest.price;

                                                        return (
                                                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-7 py-5">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="font-bold text-slate-700 text-sm">{cost.service}</span>
                                                                        {isCheapest && <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Murah</span>}
                                                                        {isFastest && <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Cepat</span>}
                                                                    </div>
                                                                    <div className="sm:hidden text-[10px] text-slate-400 mt-1 font-bold">{cost.type}</div>
                                                                </td>
                                                                <td className="px-7 py-5 text-slate-400 text-xs font-bold hidden sm:table-cell">{cost.type}</td>
                                                                <td className="px-7 py-5 text-right">
                                                                    <span className={`text-sm font-black tracking-tight ${parseInt(cost.price) > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                                        {formatPrice(cost.price)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-7 py-5 text-right text-xs font-bold text-slate-500">
                                                                    {cost.estimated || '-'}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty state */}
                <AnimatePresence>
                    {result && result.data?.costs?.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 border border-slate-200">
                                <Icon icon="lucide:truck" className="text-4xl text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Layanan Tidak Ditemukan</h3>
                            <p className="text-sm text-slate-400 max-w-xs mx-auto">
                                Maaf, saat ini tidak ada opsi pengiriman tersedia untuk rute terpilih. Silakan coba kombinasi lokasi lain.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Disclaimer */}
                <div className="text-center pt-8 border-t border-slate-200">
                    <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed uppercase tracking-widest font-bold">
                        Data ongkir dikelola secara eksternal melalui RajaOngkir (Komerce) API. Estimasi dan tarif bersifat referensi dan dapat berbeda dengan tarif resmi di gerai ekspedisi.
                    </p>
                </div>
            </div>
        </div>
    );
}
