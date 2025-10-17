import HeroBanner from './components/sections/hero-banner';
import ProductSection from './components/sections/product-section';
import HowItWorksSection from './components/sections/how-it-works-section';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      <HowItWorksSection />
      <ProductSection />
    </div>
  );
}