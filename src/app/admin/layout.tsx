import '@/app/globals.css';
import Link from 'next/link';
import AdminNavbar from './_components/AdminNavbar';

export const metadata = {
  title: 'Admin Panel - Paperlisens',
  description: 'Control center for Paperlisens e-commerce management',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-[#0f172a] text-slate-200 min-h-screen font-sans selection:bg-orange-500 selection:text-white">
        <AdminNavbar />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {children}
        </main>

        {/* Footer info */}
        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; 2026 Paperlisens &bull; Internal Administration
          </p>
        </footer>
      </body>
    </html>
  )
}
