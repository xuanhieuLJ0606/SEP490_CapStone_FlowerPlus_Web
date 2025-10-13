import HeroBanner from './components/sections/hero-banner';
import ProductSection from './components/sections/product-section';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      <ProductSection />
    </div>
  );
}
