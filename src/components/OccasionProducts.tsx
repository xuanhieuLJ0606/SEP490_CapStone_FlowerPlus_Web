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
      { id: 1, name: 'Bó hồng đỏ tình yêu', price: '399,000', image: 'https://giaohoasieutoc.com/upload/product/950000-3846.webp' },
      { id: 2, name: 'Bó hồng pastel', price: '459,000', image: 'https://hoahanoi.com.vn/wp-content/uploads/2020/09/bo-hong-pastel-e1598947025944.jpg' },
      { id: 3, name: 'Bó tulip hồng', price: '549,000', image: 'https://product.hstatic.net/200000732679/product/13_c39b0b0004cc422d8e35f5cb83f4a2d1.png' },
    ],
    vases: [
      { id: 4, name: 'Lọ hồng đỏ', price: '499,000', image: 'https://flexdecor.vn/wp-content/uploads/2022/11/Hoa-hong-do-vai-lua-nhung-de-ban-HNT0432-1.jpg' },
      { id: 5, name: 'Lọ tulip trắng', price: '569,000', image: 'https://ironstyle.vn/uploads/images/20231/l%E1%BB%8D%20hoa%20tulip%20tr%E1%BA%AFng.jpg' },
      { id: 6, name: 'Lọ mix pastel', price: '629,000', image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0oie6cgptvz22' },
    ],
  },
  womensDay: {
    bouquets: [
      { id: 7, name: 'Bó hướng dương', price: '359,000', image: 'https://flowertalk.vn/wp-content/uploads/2020/11/bo-hoa-0108.jpg' },
      { id: 8, name: 'Bó cẩm tú cầu', price: '489,000', image: 'https://hoatheomua.net/wp-content/uploads/2024/11/tu-cau-xanh-duong-bo-kieu-size-l-hoa-theo-mua-e1710163184717.jpg.webp' },
      { id: 9, name: 'Bó mix rực rỡ', price: '429,000', image: 'https://hoatheomua.net/wp-content/uploads/2024/11/hoa-hong-do-bo-kieu-3.png.webp' },
    ],
    vases: [
      { id: 10, name: 'Lọ lan hồ điệp', price: '799,000', image: 'https://ironstyle.vn/uploads/images/2024/b%C3%ACnh%20ti%E1%BB%83u%20lan%20h%E1%BB%93%20%C4%91i%E1%BB%87p%20h%E1%BB%93ng%201.jpg' },
      { id: 11, name: 'Lọ hồng pastel', price: '599,000', image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0oie6cgptvz22' },
      { id: 12, name: 'Lọ mix thanh lịch', price: '649,000', image: 'https://lh7-us.googleusercontent.com/myrG6gKvENHVHrD7qaKYFL-fjXMAUurv-6J9COURp8Bql2trYoGuxFTb17mVD4yCg2ymnTkSEq4uY9cHDX1XT2P9RJs9Eboo8VKxZLfVr8juV2_4ifMoDA5pyTsf2_uARQgGSSN-HnxVk2YwhoHKRDQ' },
    ],
  },
  funeral: {
    bouquets: [
      { id: 13, name: 'Bó cúc trắng', price: '299,000', image: 'https://img.pikbest.com/backgrounds/20241230/vibrant-bouquet-of-white-daisies-with-dark-green-stems-on-gray_11319806.jpg!w700wp' },
      { id: 14, name: 'Bó ly trắng', price: '369,000', image: 'https://bizweb.dktcdn.net/100/375/978/products/photo-28-06-2021-16-37-14.jpg?v=1682499153923' },
      { id: 15, name: 'Bó lan trắng', price: '459,000', image: 'https://bizweb.dktcdn.net/100/347/446/files/bo-hoa-lan-tuong-trang-dep.jpg?v=1689406225917' },
    ],
    vases: [
      { id: 16, name: 'Lọ cúc trắng', price: '399,000', image: 'https://ironstyle.vn/uploads/images/20241/b%C3%ACnh%20hoa%20c%C3%BAc%20tr%E1%BA%AFng.jpg' },
      { id: 17, name: 'Lọ ly trắng', price: '499,000', image: 'https://ironstyle.vn/uploads/product/wWDw_b%C3%ACnh%20hoa%20ly%20tr%E1%BA%AFng%203.jpg' },
      { id: 18, name: 'Lọ sen trắng', price: '529,000', image: 'https://hoavaidep.info/storage/2015/11/621HN-sen-trang-dat.jpg' },
    ],
  },
  congrats: {
    bouquets: [
      { id: 19, name: 'Bó hồng vàng', price: '339,000', image: 'https://shophoahong.com/wp-content/uploads/2022/06/hv1-e1655096457165.jpg' },
      { id: 20, name: 'Bó mix tươi sáng', price: '389,000', image: 'https://4tfloral.vn/wp-content/uploads/2024/08/bo-hoa-huong-duong-mix-hoa-hong.jpg' },
      { id: 21, name: 'Bó tulip đa sắc', price: '569,000', image: 'https://storage.googleapis.com/cdn_dlhf_vn/public/products/WTHP/WTHPA0045/z4098522035098_cb625d59cc77650414ed388c2166aff3_800x800.jpg' },
    ],
    vases: [
      { id: 22, name: 'Lọ mix rực rỡ', price: '649,000', image: 'https://storage.googleapis.com/cdn_dlhf_vn/public/products/AFFM/AFFMIXV485/IMG_9907_800x800.jpg' },
      { id: 23, name: 'Lọ hồng vàng', price: '559,000', image: 'https://flowershanoi.com/wp-content/uploads/2018/10/DSC2702.jpg' },
      { id: 24, name: 'Lọ tulip', price: '599,000', image: 'https://ironstyle.vn/uploads/images/20231/l%E1%BB%8D%20hoa%20tulip%20tr%E1%BA%AFng.jpg' },
    ],
  },
  birthday: {
    bouquets: [
      { id: 25, name: 'Bó hồng pastel', price: '429,000', image: 'https://hoahanoi.com.vn/wp-content/uploads/2020/09/bo-hong-pastel-e1598947025944.jpg' },
      { id: 26, name: 'Bó cẩm chướng', price: '319,000', image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/487/411/products/z5674624093899-0c6bdc72a3a0907bc0d8cbfdd1a31409.jpg?v=1722099795807' },
      { id: 27, name: 'Bó hướng dương', price: '369,000', image: 'https://flowertalk.vn/wp-content/uploads/2020/11/bo-hoa-0108.jpg' },
    ],
    vases: [
      { id: 28, name: 'Lọ mix pastel', price: '579,000', image: 'https://lovearts.vn/wp-content/uploads/2020/08/Gi%E1%BB%8F-hoa-500k-1.jpg' },
      { id: 29, name: 'Lọ lan hồ điệp', price: '799,000', image: 'https://ironstyle.vn/uploads/images/2024/b%C3%ACnh%20ti%E1%BB%83u%20lan%20h%E1%BB%93%20%C4%91i%E1%BB%87p%20h%E1%BB%93ng%201.jpg' },
      { id: 30, name: 'Lọ hồng trắng', price: '569,000', image: 'https://hoatuoi360.vn/uploads/file/hoa-hong-trang-mon-qua-dac-bi%E1%BA%B9t.jpg' },
    ],
  },
  anniversary: {
    bouquets: [
      { id: 31, name: 'Bó hồng đỏ', price: '459,000', image: 'https://hoatuoidatviet.vn/thumb/600x667/1/upload/sanpham/bo-hoa-hong-do-cuc-xinh-tinh-1347.jpg' },
      { id: 32, name: 'Bó tulip đỏ', price: '579,000', image: 'https://product.hstatic.net/200000732679/product/3_6d125a7715d84f03894c52ada4a517b3.png' },
      { id: 33, name: 'Bó lan sang trọng', price: '689,000', image: 'https://lanhodiep.vn/wp-content/uploads/2021/10/Lanhodiep-vn-la-dia-chi-cung-cap-lan-ho-diep-cat-canh-uy-tin-nhat-tai-Ha-Noi.jpg' },
    ],
    vases: [
      { id: 34, name: 'Lọ hồng đỏ', price: '629,000', image: 'https://flexdecor.vn/wp-content/uploads/2022/11/Hoa-hong-do-vai-lua-nhung-de-ban-HNT0432-1.jpg' },
      { id: 35, name: 'Lọ lan tím', price: '859,000', image: 'https://ironstyle.vn/uploads/images/2024/b%C3%ACnh%20ti%E1%BB%83u%20lan%20h%E1%BB%93%20%C4%91i%E1%BB%87p%20h%E1%BB%93ng%201.jpg' },
      { id: 36, name: 'Lọ mix sang trọng', price: '799,000', image: 'https://hoatuoihoamy.com/wp-content/uploads/2024/10/Thiet-ke-chua-co-ten-17.jpg' },
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
              <img src={p.image} alt={p.name} className="w-full h-80 object-cover" />
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


