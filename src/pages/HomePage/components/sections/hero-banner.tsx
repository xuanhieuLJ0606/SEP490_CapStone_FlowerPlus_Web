import { Heart, Truck, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

const features = [
  { icon: Heart, text: 'Miễn Phí Thiệp Xinh' },
  { icon: Star, text: 'Hoa Đẹp Chỉ Từ 300k' },
  { icon: Truck, text: 'Giao Hoa Tận Nơi Tphcm' }
];

const flowerImages = [
  'https://flowersight.com/wp-content/uploads/2023/10/lang-hoa-hong-dep-tai-flowersight-min.jpg',
  'https://hoahongsi.com/Upload/product/shimmer-5294.jpg',
  'https://flowersight.com/wp-content/uploads/2024/07/bo-hoa-tulip-10-bong-2.jpg'
];

const flowerImagesMobile = [
  'https://flowersight.com/wp-content/uploads/2023/10/lang-hoa-hong-dep-tai-flowersight-min.jpg',
  'https://hoahongsi.com/Upload/product/shimmer-5294.jpg',
  'https://flowersight.com/wp-content/uploads/2024/07/bo-hoa-tulip-10-bong-2.jpg',
  'https://flowersight.com/wp-content/uploads/2024/07/bo-hoa-tulip-10-bong-2.jpg'
];

function MobileMockup() {
  return (
    <div className="relative mx-auto w-72">
      <motion.div
        className="relative rounded-[2.5rem] border-[6px] border-gray-300 bg-gradient-to-br from-gray-900 to-gray-700 p-3 shadow-2xl"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow:
            '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 0 0 #fff inset'
        }}
      >
        <div className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 flex-row items-center gap-2">
          <div className="h-1 w-16 rounded-full bg-gray-400/60" />
          <div className="h-2 w-2 rounded-full bg-gray-400/60" />
        </div>
        {/* Screen */}
        <div className="relative h-96 overflow-hidden rounded-[2rem] bg-white shadow-inner">
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 text-xs">
            <span>19:20</span>
            <span className="font-semibold tracking-wide">flowerplus.vn</span>
            <div className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-green-400"></span>
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="inline-block h-3 w-3 rounded-full bg-red-400"></span>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-4 py-3">
            <motion.div
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-200 via-green-100 to-green-50 p-2 text-xs shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="rounded bg-green-500 px-2 py-1 text-xs text-white shadow">
                Mới
              </span>
              <p className="text-xs font-medium text-green-900">
                Đặt hoa mới hôm nay
              </p>
            </motion.div>
            {/* Search bar */}
            <motion.div
              className="mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            ></motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="scrollbar-thin scrollbar-thumb-green-200 flex gap-2 overflow-x-auto pb-1">
                {flowerImagesMobile.map((img, idx) => (
                  <div
                    key={img}
                    className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-green-100 bg-gray-100 shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`Hoa ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                    <span className="absolute left-1 top-1 rounded bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-green-700 shadow">
                      {idx === 0
                        ? 'Hot'
                        : idx === 1
                          ? 'Ưu đãi'
                          : idx === 2
                            ? 'Mới'
                            : ''}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Quick actions */}
            <motion.div
              className="mt-2 flex items-center justify-between gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="flex-1 rounded-lg bg-gradient-to-r from-pink-300 to-pink-400 px-3 py-2 text-xs font-bold text-white shadow transition hover:from-pink-400 hover:to-pink-500">
                Xem ưu đãi
              </button>
            </motion.div>
          </div>
        </div>
        {/* Home button */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <div className="h-2 w-16 rounded-full bg-gray-300/70" />
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroBanner() {
  return (
    <div className="relative min-h-[600px] overflow-hidden bg-gradient-to-r from-green-800 to-green-700">
      {/* Decorative Elements - Simplified */}
      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-pink-200 opacity-20"></div>
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-blue-200 opacity-20"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
          {/* Left Side - Mobile Mockup */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <MobileMockup />
          </motion.div>

          <motion.div
            className=" text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="mb-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl xl:text-5xl">
              <span
                className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_1px_8px_rgba(255,215,0,0.6)]"
                style={{
                  WebkitTextStroke: '1px #facc15',
                  filter: 'drop-shadow(0 0 3px #fde68a)'
                }}
              >
                FLOWERPLUS.VN
              </span>
            </h1>

            <motion.div
              className="mb-6 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-center text-lg font-semibold text-white sm:text-left sm:text-xl lg:text-2xl xl:text-3xl">
                ĐẶT HOA ONLINE GIÁ RẺ TẠI TPHCM
              </h2>
            </motion.div>
            <div className="my-4 w-full">
              <Input
                placeholder="Nhập tên hoa cần tìm"
                className="w-full text-white placeholder:text-white"
              />
            </div>
            {/* Features */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center text-white lg:justify-start"
                >
                  <feature.icon className="mr-2 h-5 w-5 text-yellow-300 sm:h-6 sm:w-6" />
                  <span className="text-xs font-medium sm:text-sm">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hidden pl-12 lg:block">
            <div className="grid grid-cols-1 gap-4">
              <div
                className="h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-pink-200 to-blue-200 bg-cover bg-center shadow-lg"
                style={{ backgroundImage: `url(${flowerImages[0]})` }}
              ></div>
              <div
                className="h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-pink-200 to-blue-200 bg-cover bg-center shadow-lg"
                style={{ backgroundImage: `url(${flowerImages[1]})` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
