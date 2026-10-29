import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Skip internal assets and API
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|webm|mp4|pdf|css|js|txt|xml)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Admin Authentication Guard
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    const adminSession = request.cookies.get('admin_session')?.value;
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // 3. SEO 301 Permanent Redirects (Migrate legacy multi-locale & /paperlisens paths to clean URLs)
  
  // Legacy /id/paperlisens/product/:slug or /paperlisens/product/:slug -> /product/:slug
  const productMatch = pathname.match(/^(?:\/(?:id|en|zh))?\/paperlisens\/product\/(.+)$/);
  if (productMatch) {
    const slug = productMatch[1];
    return NextResponse.redirect(new URL(`/product/${slug}${search}`, request.url), 301);
  }

  // Alias /produk/:slug -> /product/:slug (Harmonize Indonesian 'produk' to canonical 'product')
  const produkAliasMatch = pathname.match(/^\/produk\/(.+)$/);
  if (produkAliasMatch) {
    const slug = produkAliasMatch[1];
    return NextResponse.redirect(new URL(`/product/${slug}${search}`, request.url), 301);
  }

  // Legacy /id/paperlisens/category/:slug or /paperlisens/category/:slug -> /category/:slug
  const categoryMatch = pathname.match(/^(?:\/(?:id|en|zh))?\/paperlisens\/category\/(.+)$/);
  if (categoryMatch) {
    const slug = categoryMatch[1];
    return NextResponse.redirect(new URL(`/category/${slug}${search}`, request.url), 301);
  }

  // Legacy /id/paperlisens/checkout or /paperlisens/checkout -> /checkout
  if (pathname.match(/^(?:\/(?:id|en|zh))?\/paperlisens\/checkout(?:\/success)?$/)) {
    const isSuccess = pathname.includes('/success');
    return NextResponse.redirect(new URL(isSuccess ? `/checkout/success${search}` : `/checkout${search}`, request.url), 301);
  }

  // Legacy /id/paperlisens/orders or /paperlisens/orders -> /orders
  if (pathname.match(/^(?:\/(?:id|en|zh))?\/paperlisens\/orders$/)) {
    return NextResponse.redirect(new URL(`/orders${search}`, request.url), 301);
  }

  // Legacy /id/paperlisens, /en/paperlisens, /zh/paperlisens, /paperlisens, /id, /en, /zh -> /
  if (pathname.match(/^(?:\/(?:id|en|zh))(?:\/paperlisens)?\/?$/) || pathname === '/paperlisens' || pathname === '/paperlisens/') {
    return NextResponse.redirect(new URL(`/${search}`, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};