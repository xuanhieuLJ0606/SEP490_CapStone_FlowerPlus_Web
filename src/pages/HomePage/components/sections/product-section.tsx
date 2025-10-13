import ProductGrid from './product-grid';

const products = [
  {
    id: 1,
    name: 'Bó hoa cẩm tú cầu Nàng Thơ',
    originalPrice: 350000,
    discountedPrice: 300000,
    discount: 14,
    label: 'HOT',
    labelColor: 'bg-red-500',
    image: '/src/assets/logo1.jpg'
  },
  {
    id: 2,
    name: 'Bó Hoa Hồng Sinh Nhật Giá Rẻ Đẹp',
    originalPrice: 350000,
    discountedPrice: 300000,
    discount: 14,
    label: null,
    labelColor: '',
    image: '/src/assets/logo2.png'
  },
  {
    id: 3,
    name: 'Bó Hoa Tú Cầu Kem Dâu',
    originalPrice: 350000,
    discountedPrice: 300000,
    discount: 14,
    label: 'New',
    labelColor: 'bg-green-500',
    image: '/src/assets/logo3.jpg'
  },
  {
    id: 4,
    name: 'Bó Hoa The Ivory Dream',
    originalPrice: 400000,
    discountedPrice: 330000,
    discount: 18,
    label: null,
    labelColor: '',
    image: '/src/assets/logo4.png'
  },
  {
    id: 5,
    name: 'Shimmer iZi',
    originalPrice: 350000,
    discountedPrice: 320000,
    discount: 9,
    label: null,
    labelColor: '',
    image: '/src/assets/logo5.png'
  },
  {
    id: 6,
    name: 'Bó Hoa Sinh Nhật Cẩm Tú Cầu Moomi',
    originalPrice: 300000,
    discountedPrice: 235000,
    discount: 22,
    label: null,
    labelColor: '',
    image: '/src/assets/logo6.jpg'
  },
  {
    id: 7,
    name: 'Bó Hoa Hồng Đỏ Tình Yêu',
    originalPrice: 450000,
    discountedPrice: 380000,
    discount: 16,
    label: 'HOT',
    labelColor: 'bg-red-500',
    image: '/src/assets/logo1.jpg'
  },
  {
    id: 8,
    name: 'Bó Hoa Tulip Vàng Tươi',
    originalPrice: 320000,
    discountedPrice: 280000,
    discount: 13,
    label: 'New',
    labelColor: 'bg-green-500',
    image: '/src/assets/logo2.png'
  },
  {
    id: 9,
    name: 'Bó Hoa Cẩm Chướng Hồng',
    originalPrice: 280000,
    discountedPrice: 240000,
    discount: 14,
    label: null,
    labelColor: '',
    image: '/src/assets/logo3.jpg'
  },
  {
    id: 10,
    name: 'Bó Hoa Ly Trắng Tinh Khôi',
    originalPrice: 500000,
    discountedPrice: 420000,
    discount: 16,
    label: 'HOT',
    labelColor: 'bg-red-500',
    image: '/src/assets/logo4.png'
  },
  {
    id: 11,
    name: 'Bó Hoa Cúc Trắng Thanh Lịch',
    originalPrice: 250000,
    discountedPrice: 210000,
    discount: 16,
    label: null,
    labelColor: '',
    image: '/src/assets/logo5.png'
  },
  {
    id: 12,
    name: 'Bó Hoa Hướng Dương Rực Rỡ',
    originalPrice: 380000,
    discountedPrice: 320000,
    discount: 16,
    label: 'New',
    labelColor: 'bg-green-500',
    image: '/src/assets/logo6.jpg'
  }
];

export default function ProductSection() {
  return (
    <div>
      <ProductGrid
        products={products}
        maxShowProduct={5}
        title="BÓ HOA RẺ HÔM NAY"
      />
      <ProductGrid products={products} maxShowProduct={5} title="HOA HỒNG" />
      <ProductGrid products={products} maxShowProduct={5} title="HOA LY" />
      <ProductGrid products={products} maxShowProduct={5} title="HOA CÚC" />
    </div>
  );
}
