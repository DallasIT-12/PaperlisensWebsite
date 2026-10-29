import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import CategoryPageClient from './category-page-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale = 'id' } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <CategoryPageClient params={Promise.resolve({ slug })} />
    </NextIntlClientProvider>
  );
}
