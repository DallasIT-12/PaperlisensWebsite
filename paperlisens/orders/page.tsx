import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import OrdersPageClient from './orders-page-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Riwayat Pesanan - Paperlisens',
  description: 'Pantau status dan riwayat pesanan Anda di Paperlisens.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale = 'id' } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <OrdersPageClient />
    </NextIntlClientProvider>
  );
}
