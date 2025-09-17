import React from 'react';
import { motion } from 'framer-motion';

type OccasionKey = 'valentine' | 'womensDay' | 'funeral' | 'congrats' | 'birthday' | 'anniversary';

type ProductItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

const OCCASION_LABELS: Record<OccasionKey, string> = {
  valentine: 'Valentine',
  womensDay: 'Ngày phụ nữ',
  funeral: 'Hoa viếng thăm',
  congrats: 'Chúc mừng',
  birthday: 'Sinh nhật',
  anniversary: 'Kỷ niệm',
};

const MOCK_DATA: Record<OccasionKey, { bouquets: ProductItem[]; vases: ProductItem[] }> = {
  valentine: {
    bouquets: [
      { id: 1, name: 'Bó hồng đỏ tình yêu', price: '399,000', image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=480&fit=crop&auto=format' },
      { id: 2, name: 'Bó hồng pastel', price: '459,000', image: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=600&h=480&fit=crop&auto=format' },
      { id: 3, name: 'Bó tulip hồng', price: '549,000', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&h=480&fit=crop&auto=format' },
    ],
    vases: [
      { id: 4, name: 'Lọ hồng đỏ', price: '499,000', image: 'https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=600&h=480&fit=crop&auto=format' },
      { id: 5, name: 'Lọ tulip trắng', price: '569,000', image: 'https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=600&h=480&fit=crop&auto=format' },
      { id: 6, name: 'Lọ mix pastel', price: '629,000', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=480&fit=crop&auto=format' },
    ],
  },
  womensDay: {
    bouquets: [
      { id: 7, name: 'Bó hướng dương', price: '359,000', image: 'https://images.unsplash.com/photo-1437419764061-2473afe69fc2?w=600&h=480&fit=crop&auto=format' },
      { id: 8, name: 'Bó cẩm tú cầu', price: '489,000', image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=600&h=480&fit=crop&auto=format' },
      { id: 9, name: 'Bó mix rực rỡ', price: '429,000', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=480&fit=crop&auto=format' },
    ],
    vases: [
      { id: 10, name: 'Lọ lan hồ điệp', price: '799,000', image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&h=480&fit=crop&auto=format' },
      { id: 11, name: 'Lọ hồng pastel', price: '599,000', image: 'https://images.unsplash.com/photo-1519689680058-c382f3270e52?w=600&h=480&fit=crop&auto=format' },
      { id: 12, name: 'Lọ mix thanh lịch', price: '649,000', image: 'https://images.unsplash.com/photo-1509043759401-136742328bb3?w=600&h=480&fit=crop&auto=format' },
    ],
  },
  funeral: {
    bouquets: [
      { id: 13, name: 'Bó cúc trắng', price: '299,000', image: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=600&h=480&fit=crop&auto=format' },
      { id: 14, name: 'Bó ly trắng', price: '369,000', image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&h=480&fit=crop&auto=format' },
      { id: 15, name: 'Bó lan trắng', price: '459,000', image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&h=480&fit=crop&auto=format' },
    ],
    vases: [
      { id: 16, name: 'Lọ cúc trắng', price: '399,000', image: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=600&h=480&fit=crop&auto=format' },
      { id: 17, name: 'Lọ ly trắng', price: '499,000', image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=600&h=480&fit=crop&auto=format' },
      { id: 18, name: 'Lọ sen trắng', price: '529,000', image: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=600&h=480&fit=crop&auto=format' },
    ],
  },
  congrats: {
    bouquets: [
      { id: 19, name: 'Bó hồng vàng', price: '339,000', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&h=480&fit=crop&auto=format' },
      { id: 20, name: 'Bó mix tươi sáng', price: '389,000', image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?w=600&h=480&fit=crop&auto=format' },
      { id: 21, name: 'Bó tulip đa sắc', price: '569,000', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&h=480&fit=crop&auto=format' },
    ],
    vases: [
      { id: 22, name: 'Lọ mix rực rỡ', price: '649,000', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=480&fit=crop&auto=format' },
      { id: 23, name: 'Lọ hồng vàng', price: '559,000', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&h=480&fit=crop&auto=format' },
      { id: 24, name: 'Lọ tulip', price: '599,000', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&h=480&fit=crop&auto=format' },
    ],
  },
  birthday: {
    bouquets: [
      { id: 25, name: 'Bó hồng pastel', price: '429,000', image: 'https://images.unsplash.com/photo-1519689680058-c382f3270e52?w=600&h=480&fit=crop&auto=format' },
      { id: 26, name: 'Bó cẩm chướng', price: '319,000', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=480&fit=crop&auto=format' },
      { id: 27, name: 'Bó hướng dương', price: '369,000', image: 'https://images.unsplash.com/photo-1437419764061-2473afe69fc2?w=600&h=480&fit=crop&auto=format' },
    ],
    vases: [
      { id: 28, name: 'Lọ mix pastel', price: '579,000', image: 'https://images.unsplash.com/photo-1519689680058-c382f3270e52?w=600&h=480&fit=crop&auto=format' },
      { id: 29, name: 'Lọ lan hồ điệp', price: '799,000', image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&h=480&fit=crop&auto=format' },
      { id: 30, name: 'Lọ hồng trắng', price: '569,000', image: 'https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=600&h=480&fit=crop&auto=format' },
    ],
  },
  anniversary: {
    bouquets: [
      { id: 31, name: 'Bó hồng đỏ', price: '459,000', image: 'https://images.unsplash.com/photo-1509043759401-136742328bb3?w=600&h=480&fit=crop&auto=format' },
      { id: 32, name: 'Bó tulip đỏ', price: '579,000', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&h=480&fit=crop&auto=format' },
      { id: 33, name: 'Bó lan sang trọng', price: '689,000', image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&h=480&fit=crop&auto=format' },
    ],
    vases: [
      { id: 34, name: 'Lọ hồng đỏ', price: '629,000', image: 'https://images.unsplash.com/photo-1519689680058-c382f3270e52?w=600&h=480&fit=crop&auto=format' },
      { id: 35, name: 'Lọ lan tím', price: '859,000', image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&h=480&fit=crop&auto=format' },
      { id: 36, name: 'Lọ mix sang trọng', price: '799,000', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=480&fit=crop&auto=format' },
    ],
  },
};

type OccasionProductsProps = {
  activeOccasion?: OccasionKey;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const OccasionProducts: React.FC<OccasionProductsProps> = ({ activeOccasion = 'valentine' }) => {
  const [tab, setTab] = React.useState<'bouquets' | 'vases'>('bouquets');
  const [occasion, setOccasion] = React.useState<OccasionKey>(activeOccasion);

  const sections: OccasionKey[] = ['valentine', 'womensDay', 'funeral', 'congrats', 'birthday', 'anniversary'];

  const products = MOCK_DATA[occasion][tab];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Sản phẩm theo dịp
          </h2>
          <div className="flex flex-wrap gap-2">
            {sections.map((key) => (
              <button
                key={key}
                onClick={() => setOccasion(key)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  occasion === key ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                }`}
              >
                {OCCASION_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setTab('bouquets')}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
              tab === 'bouquets' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
            }`}
          >
            Bó hoa
          </button>
          <button
            onClick={() => setTab('vases')}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
              tab === 'vases' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
            }`}
          >
            Lọ hoa
          </button>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        >
          {products.map((p) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">{p.price}đ</span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OccasionProducts;


