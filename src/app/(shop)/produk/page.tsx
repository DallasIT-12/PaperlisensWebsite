import PaperlisensPageClient from '../paperlisens-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog Produk Kemasan Food Grade & Paper Tray | Paperlisens',
  description: 'Jelajahi ratusan koleksi kemasan makanan, paper tray, box cupcake, dan lunch box food grade berkualitas dengan harga grosir langsung dari pabrik Paperlisens.',
  keywords: ['katalog paperlisens', 'beli kemasan makanan', 'paper tray food grade', 'box cupcake', 'kemasan UMKM', 'box takeaway', 'kemasan kediri', 'kemasan surabaya'],
  alternates: {
    canonical: '/produk',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ProdukCatalogPage() {
  return <PaperlisensPageClient />;
}
