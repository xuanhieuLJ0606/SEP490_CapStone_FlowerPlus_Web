import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Star,
  ChevronRight,
  Gift,
  Truck,
  Clock,
  Shield,
  ChevronLeft,
  ShoppingCart,
  Sparkles,
  Leaf,
  Package
} from 'lucide-react';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { useGetListProductToView } from '@/queries/product.query';
import { useGetPersonalizedRecommendations } from '@/queries/recommendation.query';
import __helpers from '@/helpers';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAddItemToCart } from '@/queries/cart.query';
import { toast } from '@/components/ui/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  discount?: number;
  categoryId?: number;
  categoryName?: string;
  stock?: number | null;
  compositions?: Array<{
    childId: number;
    childName: string;
    childType: string;
    quantity: number;
    childPrice: number;
    childImage: string;
  }>;
}

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number | null;
  productType: string;
  isActive: boolean;
  images: string;
  categories: Array<{
    id: number;
    name: string;
  }>;
  compositions: Array<{
    childId: number;
    childName: string;
    childType: string;
    quantity: number;
    childPrice: number;
    childImage: string;
  }>;
  createdAt: string | null;
  updatedAt: string | null;
}

interface CategoryGroup {
  id: number;
  name: string;
  products: Product[];
}

// Move bannerImages outside component to prevent re-creation
const BANNER_IMAGES = [
  'https://vuonhoatuoi.vn/wp-content/uploads/2024/09/banner-bo-hoa-sinh-nhat.png',
  'https://dienhoasaigon.com.vn/wp-content/uploads/2022/03/hoatuoi9x_banner-web-03-scaled.jpg',
  'https://shophoaquynhdao.com/thumbs/1366x560x1/upload/photo/banner-7789-26871.png'
];

// Helper function để parse JSON string thành array
const parseImages = (imagesStr: string): string[] => {
  try {
    const parsed = JSON.parse(imagesStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getProductImage = (product: ApiProduct): string => {
  const productImages = parseImages(product.images);
  if (productImages.length > 0) {
    return productImages[0];
  }

  // if (product.compositions && product.compositions.length > 0) {
  //   const compositionImages = parseImages(product.compositions[0].childImage);
  //   if (compositionImages.length > 0) {
  //     return compositionImages[0];
  //   }
  // }

  return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixbrVNY9XIHQBZ1iehMIV0Z9AtHB9dp46lg&s';
};

// Helper function để tính tổng giá từ compositions
const calculateTotalPrice = (product: ApiProduct): number => {
  if (product.price > 0) return product.price;

  return 0;
};

// Helper function để format VND
function formatVND(n: number) {
  try {
    return n.toLocaleString('vi-VN');
  } catch {
    return `${n}`;
  }
}

const transformApiProduct = (
  apiProduct: ApiProduct,
  index: number
): Product => {
  const totalPrice = calculateTotalPrice(apiProduct);

  const discountMultiplier = 1 + (0.2 + Math.random() * 0.2);
  const originalPrice =
    Math.round((totalPrice * discountMultiplier) / 10000) * 10000;

  const rating = 4.5 + Math.random() * 0.5;
  const reviews = Math.floor(Math.random() * 50) + 3;

  let badge: string | undefined;
  if (index === 0) badge = 'Bán chạy';
  else if (index === 1) badge = 'Hot';
  else if (apiProduct.categories.some((cat) => cat.name.includes('đặc biệt')))
    badge = 'Premium';
  else if (Math.random() > 0.7) badge = 'Yêu thích';

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: totalPrice,
    originalPrice: originalPrice > totalPrice ? originalPrice : undefined,
    rating: Math.round(rating * 10) / 10,
    reviews,
    image: getProductImage(apiProduct),
    badge,
    discount:
      originalPrice > totalPrice
        ? Math.round((1 - totalPrice / originalPrice) * 100)
        : undefined,
    categoryId: apiProduct.categories[0]?.id,
    categoryName: apiProduct.categories[0]?.name,
    stock: apiProduct.stock,
    compositions: apiProduct.compositions
  };
};

// ProductCard component moved outside to prevent re-creation on re-render
const ProductCard = memo(
  ({
    product,
    onAddToCart
  }: {
    product: Product;
    index: number;
    onAddToCart: (
      e: React.MouseEvent,
      productId: number,
      productName: string,
      stock: number | null | undefined
    ) => void;
  }) => {
    const discountPercent = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        whileHover="hover"
        className="group relative transform overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-xl"
      >
        <a href={`/product/${product.id}`}>
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
            <motion.img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              onError={(e) => {
                e.currentTarget.src =
                  'https://i.pinimg.com/1200x/de/5f/ab/de5fab8cc3790f339ab755ba94241246.jpg';
              }}
            />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {product.badge && (
                <motion.span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  {product.badge}
                </motion.span>
              )}
              {discountPercent > 0 && (
                <motion.span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  -{discountPercent}%
                </motion.span>
              )}
            </div>

            {/* Favorite Button */}
            <div className="absolute right-3 top-3">
              <FavoriteButton
                productId={product.id}
                size="md"
                variant="default"
              />
            </div>

            {/* Quick Actions - appears on hover */}
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4"
              initial={{ y: 100, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={(e) =>
                  onAddToCart(e, product.id, product.name, product.stock)
                }
                disabled={
                  product.stock == null ||
                  product.stock == undefined ||
                  product.stock <= 0
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-rose-600 shadow-lg transition-all hover:bg-rose-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-rose-600"
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock == null ||
                product.stock == undefined ||
                product.stock <= 0
                  ? 'Hết hàng'
                  : 'Thêm vào giỏ hàng'}
              </motion.button>
            </motion.div>
          </div>
        </a>

        {/* Product Info */}
        <div className="p-4">
          <a href={`/product/${product.id}`}>
            <motion.h3 className="mb-2 line-clamp-2 min-h-[3rem] font-semibold text-gray-800 transition-colors hover:text-rose-600">
              {product.name}
            </motion.h3>
          </a>

          {/* Compositions Info */}
          {product.compositions && product.compositions.length > 0 && (
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
              <Package className="h-3.5 w-3.5" />
              <span>{product.compositions.length} thành phần</span>
            </div>
          )}

          {/* Stock Info */}
          {product.stock !== null && (
            <div className="mb-2">
              {(product.stock as any) > 0 ? (
                <Badge variant="secondary" className="text-xs">
                  <Leaf className="mr-1 h-3 w-3" />
                  Còn {product.stock} sản phẩm
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Hết hàng
                </Badge>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviews} đánh giá)
            </span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                {formatVND(product.price)}₫
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatVND(product.originalPrice)}₫
                </span>
              )}
            </div>
            <motion.button
              onClick={(e) =>
                onAddToCart(e, product.id, product.name, product.stock)
              }
              disabled={
                product.stock == null ||
                product.stock == undefined ||
                product.stock <= 0
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if product data actually changes
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.stock === nextProps.product.stock &&
      prevProps.product.price === nextProps.product.price
    );
  }
);

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const { data: resProducts, isLoading } = useGetListProductToView(1, 100);
  const { mutateAsync: addItemToCart } = useAddItemToCart();

  // Check if user is logged in
  const accessToken = __helpers.cookie_get('AT');

  // Get personalized recommendations if user is logged in (backend will get userId from token)
  const { data: recommendationsData, isLoading: isLoadingRecommendations } =
    useGetPersonalizedRecommendations(8, !!accessToken);

  const apiProducts = resProducts?.listObjects || [];

  const { categorizedProducts } = useMemo(() => {
    const activeProducts = apiProducts.filter((p: ApiProduct) => p.isActive);
    const transformed = activeProducts.map((p: ApiProduct, index: number) =>
      transformApiProduct(p, index)
    );

    // Tạo map để dễ dàng tìm product đã transform từ apiProduct id
    const productMap = new Map<number, Product>();
    transformed.forEach((product) => {
      productMap.set(product.id, product);
    });

    const categoryMap = new Map<number, CategoryGroup>();

    // Lặp qua từng product và thêm vào tất cả categories của nó
    activeProducts.forEach((apiProduct: ApiProduct) => {
      const product = productMap.get(apiProduct.id);
      if (!product) return;

      // Lặp qua tất cả categories của product
      apiProduct.categories.forEach((category) => {
        if (!categoryMap.has(category.id)) {
          categoryMap.set(category.id, {
            id: category.id,
            name: category.name,
            products: []
          });
        }
        // Thêm product vào category này
        const categoryGroup = categoryMap.get(category.id)!;
        // Kiểm tra để tránh thêm trùng lặp
        if (!categoryGroup.products.some((p) => p.id === product.id)) {
          categoryGroup.products.push(product);
        }
      });
    });

    return {
      allProducts: transformed,
      categorizedProducts: Array.from(categoryMap.values()).filter(
        (cat) => cat.products.length > 0
      )
    };
  }, [apiProducts]);

  // Transform recommendations to Product format
  const recommendedProducts = useMemo(() => {
    if (!recommendationsData?.recommendations) return [];

    return recommendationsData.recommendations.map((rec) => {
      const images = parseImages(rec.images);
      const image =
        images.length > 0
          ? images[0]
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixbrVNY9XIHQBZ1iehMIV0Z9AtHB9dp46lg&s';

      return {
        id: rec.product_id,
        name: rec.name,
        price: rec.price,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 50) + 3,
        image: image,
        badge: 'Gợi ý',
        stock: rec.stock,
        categoryId: undefined,
        categoryName: undefined,
        compositions: undefined
      } as Product;
    });
  }, [recommendationsData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleAddToCart = useCallback(
    async (
      e: React.MouseEvent,
      productId: number,
      productName: string,
      stock: number | null | undefined
    ) => {
      e.preventDefault();
      e.stopPropagation();

      // Check stock before adding to cart
      if (stock === null || stock === undefined || stock <= 0) {
        toast({
          title: 'Không thể thêm vào giỏ hàng',
          description: 'Sản phẩm đã hết hàng',
          variant: 'destructive'
        });
        return;
      }

      const payload = {
        productId: productId,
        quantity: 1
      };
      const [error] = await addItemToCart(payload);

      if (error) {
        toast({
          title: 'Thêm sản phẩm vào giỏ hàng thất bại',
          description:
            error.message || 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Thêm sản phẩm vào giỏ hàng thành công',
        description: `${productName} đã được thêm vào giỏ hàng`,
        variant: 'default'
      });
    },
    [addItemToCart]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
          <p className="text-sm text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30">
      {/* Top banner / trust badges */}

      {/* Hero Section */}
      <motion.section
        className="container mx-auto px-4 py-8"
        style={{ opacity, scale }}
      >
        <div className="grid h-auto grid-cols-1 gap-6 lg:h-[500px] lg:grid-cols-3">
          {/* Main Hero Carousel */}
          <div className="group relative h-[300px] overflow-hidden rounded-3xl shadow-2xl lg:col-span-2 lg:h-[500px]">
            <motion.div
              className="flex h-full"
              initial={{ x: 0 }}
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              {BANNER_IMAGES.map((image, index) => (
                <div key={index} className="h-full min-w-full">
                  <img
                    src={image}
                    alt={`Banner ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </motion.div>

            <motion.div
              className="pointer-events-none absolute right-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />

            <motion.button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
              aria-label="Previous slide"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
              aria-label="Next slide"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </motion.button>

            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {BANNER_IMAGES.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="h-2 rounded-full transition-all duration-300"
                  animate={{
                    width: index === currentSlide ? 32 : 8,
                    backgroundColor:
                      index === currentSlide
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(255, 255, 255, 0.5)'
                  }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Side Promos */}
          <div className="flex flex-col gap-6">
            <motion.div
              className="group relative flex-1 cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 to-purple-200/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 flex h-full flex-col justify-center p-8">
                <motion.div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Gift className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  Quà Tặng
                  <br />
                  <span className="text-pink-600">Sinh Nhật</span>
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Bộ sưu tập độc quyền
                </p>
                <motion.a
                  href="/products/8"
                  className="flex items-center gap-1 font-semibold text-rose-600"
                  whileHover={{ gap: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  Khám phá <ChevronRight className="h-4 w-4" />
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              className="group relative flex-1 cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/50 to-orange-200/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 flex h-full flex-col justify-center p-8">
                <motion.div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Truck className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="mb-2 text-2xl font-bold text-gray-800">
                  Miễn Phí
                  <br />
                  <span className="text-orange-600">Giao Hàng</span>
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Cho đơn từ 500.000₫
                </p>
                <motion.a
                  href="#"
                  className="flex items-center gap-1 font-semibold text-orange-600"
                  whileHover={{ gap: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  Mua sắm ngay <ChevronRight className="h-4 w-4" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <section className="mt-14 border-y border-purple-100 bg-white py-8">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              {
                icon: Truck,
                title: 'Giao Hàng Nhanh',
                desc: '2-4 giờ trong nội thành'
              },
              {
                icon: Shield,
                title: 'Đảm Bảo Chất Lượng',
                desc: 'Hoa tươi 100%'
              },
              {
                icon: Clock,
                title: 'Hỗ Trợ 24/7',
                desc: 'Luôn sẵn sàng phục vụ'
              },
              {
                icon: Gift,
                title: 'Quà Tặng Độc Quyền',
                desc: 'Thiết kế riêng biệt'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group flex flex-col items-center text-center"
              >
                <motion.div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </motion.div>
                <h4 className="mb-1 font-bold text-gray-800">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Personalized Recommendations - Only show when user is logged in */}
      {accessToken && recommendationsData && recommendedProducts.length > 0 && (
        <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-8 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="mb-2 text-4xl font-bold text-gray-800">
                  Hoa gợi ý cho bạn
                </h2>
                <p className="text-gray-600">
                  {recommendedProducts.length} sản phẩm được đề xuất dành riêng
                  cho bạn
                </p>
              </div>
            </motion.div>

            {isLoadingRecommendations ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-600 border-t-transparent"></div>
                  <p className="text-sm text-gray-600">Đang tải gợi ý...</p>
                </div>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
              >
                {recommendedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Products by Category */}
      {categorizedProducts.map((category, catIndex) => (
        <section
          key={category.id}
          className={`py-16 ${catIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-8 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="mb-2 text-4xl font-bold text-gray-800">
                  {category.name}
                </h2>
                <p className="text-gray-600">
                  {category.products.length} sản phẩm trong danh mục này
                </p>
              </div>
              <motion.a
                href={`/products/${category.id}`}
                className="group hidden items-center gap-2 font-semibold text-purple-600 md:flex"
                whileHover={{ gap: 12 }}
                transition={{ duration: 0.3 }}
              >
                Xem tất cả
                <ChevronRight className="h-5 w-5" />
              </motion.a>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {category.products.slice(0, 8).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </motion.div>

            {category.products.length > 8 && (
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Button variant="outline" size="lg" className="gap-2" asChild>
                  <a href={`/products/${category.id}`}>
                    Xem thêm {category.products.length - 8} sản phẩm
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      ))}

      {/* No products fallback */}
      {categorizedProducts.length === 0 && !isLoading && (
        <section className="container mx-auto px-4 py-16">
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <Leaf className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-700">
              Chưa có sản phẩm nào
            </h3>
            <p className="mt-2 text-gray-500">
              Các sản phẩm mới sẽ sớm được cập nhật
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
