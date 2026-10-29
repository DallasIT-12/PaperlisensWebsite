import type { Metadata } from 'next';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingCategories from '@/components/landing/LandingCategories';
import LandingFeaturedProducts from '@/components/landing/LandingFeaturedProducts';
import LandingCustomPackaging from '@/components/landing/LandingCustomPackaging';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import LandingFaq from '@/components/landing/LandingFaq';
import LandingCta from '@/components/landing/LandingCta';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Paperlisens - Produsen Kemasan Makanan & Paper Tray Food Grade Terpercaya',
  description: 'Pabrik & supplier kemasan makanan food grade berkualitas: box cupcake, paper tray, box takeaway, dan custom sablon logo untuk bisnis kuliner di seluruh Indonesia.',
  keywords: [
    'paperlisens',
    'kemasan makanan food grade',
    'paper tray',
    'box cupcake',
    'lunch box takeaway',
    'produsen kemasan kediri',
    'supplier kemasan surabaya',
    'custom packaging umkm',
    'kemasan ramah lingkungan',
    'box nasi catering'
  ],
  alternates: {
    canonical: '/',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <LandingNavbar />
      <main className="flex-grow">
        <LandingHero />
        <LandingFeatures />
        <LandingCategories />
        <LandingFeaturedProducts />
        <LandingCustomPackaging />
        <LandingTestimonials />
        <LandingFaq />
        <LandingCta />
      </main>
      <Footer />
    </div>
  );
}
