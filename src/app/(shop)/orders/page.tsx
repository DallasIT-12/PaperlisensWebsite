import OrdersPageClient from './orders-page-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Riwayat Pesanan - Paperlisens',
  description: 'Pantau status dan riwayat pesanan Anda di Paperlisens.',
  alternates: {
    canonical: '/orders',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function OrdersPage() {
  return <OrdersPageClient />;
}
