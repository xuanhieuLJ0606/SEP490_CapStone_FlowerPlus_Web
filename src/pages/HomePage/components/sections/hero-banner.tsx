import { Heart, Truck, Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const features = [
  { icon: Heart, text: 'Miễn Phí Thiệp Xinh' },
  { icon: Star, text: 'Hoa Đẹp Chỉ Từ 300k' },
  { icon: Truck, text: 'Giao Hoa Tận Nơi Tphcm' }
];

const flowerImages = [
  'https://flowermoxie.com/cdn/shop/files/glow_up_home_page_3.jpg?format=webp&v=1754412369&width=1296',
  'https://hoahongsi.com/Upload/product/shimmer-5294.jpg',
  'https://flowersight.com/wp-content/uploads/2024/07/bo-hoa-tulip-10-bong-2.jpg'
];

export default function HeroBanner() {
  // For hydration safety, trigger animation on mount
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="relative">
      <Carousel className="w-full" opts={{ loop: true, align: 'start' }}>
        <CarouselContent>
          {flowerImages.map((img) => (
            <CarouselItem key={img} className="basis-full">
              <div className="relative h-[60vh] min-h-[420px] w-full md:h-[70vh]">
                <img
                  src={img}
                  alt="Flower banner"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Features with animation */}
                <div className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 flex-row gap-4 md:gap-8">
                  <AnimatePresence>
                    {show &&
                      features.map((feature, i) => (
                        <motion.div
                          key={feature.text}
                          custom={i}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="backdrop-blur-xs flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-md"
                        >
                          <feature.icon className="h-5 w-5 text-rose-500" />
                          <span className="text-sm font-medium text-gray-700 md:text-base">
                            {feature.text}
                          </span>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white" />
      </Carousel>
    </div>
  );
}