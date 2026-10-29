import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-2xl font-bold mb-6">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-sm"
      >
        Kembali ke Belanja
      </Link>
    </div>
  );
}
