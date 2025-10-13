import Header from '@/components/layout/header';
import HeroBanner from './components/sections/hero-banner';
import ProductSection from './components/sections/product-section';
import Footer from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroBanner />
      <ProductSection />
      <Footer />
    </div>
  );
}
