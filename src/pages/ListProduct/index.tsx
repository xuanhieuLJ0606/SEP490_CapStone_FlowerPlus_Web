'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Eye,
  Heart,
  Sparkles,
  Star,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetListProductByPaging } from '@/queries/product.query';
import { PRODUCT_TYPE } from '@/constants/data';
import { useParams, useSearchParams } from 'react-router-dom';
import __helpers from '@/helpers';
import { useAddItemToCart } from '@/queries/cart.query';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from '@/routes/hooks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ITEMS_PER_PAGE = 9;
const FETCH_SIZE = 50;

type PriceOption =
  | 'ALL'
  | 'UNDER_100'
  | '100_300'
  | '300_500'
  | 'OVER_500'
  | 'CUSTOM';

interface CustomPriceRange {
  min: string;
  max: string;
}

interface FilterSidebarProps {
  isMobile?: boolean;
  searchKeyword: string;
  onSearchChange: (value: string) => void;

  priceOption: PriceOption;
  onPriceOptionChange: (value: PriceOption) => void;

  customPriceRange: CustomPriceRange;
  onCustomPriceRangeChange: (value: CustomPriceRange) => void;

  filteredCount: number;
  totalCount: number;

  onReset: () => void;
  onCloseMobile: () => void;
}

function parseImages(imagesStr: string): string[] {
  if (!imagesStr) return [];
  try {
    const arr = JSON.parse(imagesStr);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

// ------------------ FILTER SIDEBAR ------------------

const FilterSidebar = ({
  isMobile = false,
  searchKeyword,
  onSearchChange,
  priceOption,
  onPriceOptionChange,
  customPriceRange,
  onCustomPriceRangeChange,
  filteredCount,
  totalCount,
  onReset,
  onCloseMobile
}: FilterSidebarProps) => {
  const priceOptions: { key: PriceOption; label: string }[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'UNDER_100', label: 'Dưới 100.000đ' },
    { key: '100_300', label: '100.000đ - 300.000đ' },
    { key: '300_500', label: '300.000đ - 500.000đ' },
    { key: 'OVER_500', label: 'Trên 500.000đ' },
    { key: 'CUSTOM', label: 'Tùy chọn khoảng (tự nhập)' }
  ];

  const handleCustomChange = (field: 'min' | 'max', value: string) => {
    onCustomPriceRangeChange({
      ...customPriceRange,
      [field]: value
    });
  };

  return (
    <div
      className={`${
        isMobile
          ? 'fixed inset-0 z-50 bg-white'
          : 'sticky top-4 h-fit rounded-3xl bg-white/80 shadow-xl backdrop-blur-lg'
      } overflow-hidden`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-pink-500" />
            <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
          </div>
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search by name */}
        <div className="mb-6">
          <Label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Search className="h-4 w-4 text-pink-500" />
            Tìm kiếm sản phẩm
          </Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              className="rounded-xl border-gray-200 pl-10 focus:border-pink-500 focus:ring-pink-500"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Price Options */}
        <div className="mb-6">
          <Label className="mb-3 text-sm font-semibold text-gray-700">
            Khoảng giá
          </Label>
          <div className="space-y-2">
            {priceOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onPriceOptionChange(opt.key)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-all ${
                  priceOption === opt.key
                    ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {priceOption === 'CUSTOM' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-xs text-gray-500">
                  Giá từ (vnđ)
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={customPriceRange.min}
                  onChange={(e) => handleCustomChange('min', e.target.value)}
                  className="rounded-lg border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs text-gray-500">
                  Giá đến (vnđ)
                </Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={customPriceRange.max}
                  onChange={(e) => handleCustomChange('max', e.target.value)}
                  className="rounded-lg border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  placeholder="1.000.000"
                />
              </div>
            </div>
          )}
        </div>

        {/* Filter summary */}
        <div className="mb-4 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-700">
            Kết quả lọc
          </p>
          <p className="text-2xl font-bold text-pink-600">{filteredCount}</p>
          <p className="text-xs text-gray-600">
            trong tổng số {totalCount} sản phẩm
          </p>
        </div>

        {/* Reset button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="w-full rounded-xl border-2 border-pink-200 bg-white px-4 py-3 font-semibold text-pink-600 transition-all hover:bg-pink-50"
        >
          Đặt lại bộ lọc
        </motion.button>

        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCloseMobile}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg"
          >
            Áp dụng bộ lọc
          </motion.button>
        )}
      </div>
    </div>
  );
};

// ------------------ MAIN COMPONENT ------------------

export default function ListProduct() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const [searchKeyword, setSearchKeyword] = useState(() => {
    // Get search query from URL params if exists
    return searchParams.get('q') || '';
  });
  const [priceOption, setPriceOption] = useState<PriceOption>('ALL');
  const [customPriceRange, setCustomPriceRange] = useState<CustomPriceRange>({
    min: '',
    max: ''
  });

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();

  // Update search keyword when URL params change
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchKeyword(queryParam);
    }
  }, [searchParams]);
  const { data: resProducts } = useGetListProductByPaging(
    1,
    FETCH_SIZE,
    '',
    PRODUCT_TYPE.PRODUCT,
    categoryId ? Number(categoryId) : undefined
  );
  const { mutateAsync: addToCart } = useAddItemToCart();
  const router = useRouter();

  const allProducts = resProducts?.listObjects || [];

  // Filter products based on search & price
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product: any) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase());

      const price = product.price ?? 0;
      let matchesPrice = true;

      switch (priceOption) {
        case 'UNDER_100':
          matchesPrice = price < 100_000;
          break;
        case '100_300':
          matchesPrice = price >= 100_000 && price <= 300_000;
          break;
        case '300_500':
          matchesPrice = price >= 300_000 && price <= 500_000;
          break;
        case 'OVER_500':
          matchesPrice = price > 500_000;
          break;
        case 'CUSTOM': {
          let min = 0;
          let max = Number.MAX_SAFE_INTEGER;

          if (customPriceRange.min.trim() !== '') {
            const val = Number(customPriceRange.min.replace(/\D/g, ''));
            if (!Number.isNaN(val)) min = val;
          }

          if (customPriceRange.max.trim() !== '') {
            const val = Number(customPriceRange.max.replace(/\D/g, ''));
            if (!Number.isNaN(val)) max = val;
          }

          matchesPrice = price >= min && price <= max;
          break;
        }
        case 'ALL':
        default:
          matchesPrice = true;
      }

      return matchesSearch && matchesPrice;
    });
  }, [allProducts, searchKeyword, priceOption, customPriceRange]);

  // Pagination for filtered products
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleLike = useCallback((productId: number) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const handleResetFilters = () => {
    setSearchKeyword('');
    setPriceOption('ALL');
    setCustomPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [] as any;
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <motion.button
          key={i}
          onClick={() => handlePageChange(i)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: currentPage === i ? 1.1 : 1
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className={`rounded-xl px-4 py-2 font-semibold ${
            currentPage === i
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50'
              : 'bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-white hover:shadow-md'
          }`}
        >
          {i}
        </motion.button>
      );
    }

    return pages;
  };

  const handleAddToCart = async (productId: number) => {
    const payload = {
      productId: productId,
      quantity: 1
    };
    const [error] = await addToCart(payload);

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
      description: 'Sản phẩm đã được thêm vào giỏ hàng',
      variant: 'success'
    });
  };

  if (allProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="mx-auto mb-4 h-16 w-16 text-pink-400" />
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Chưa có sản phẩm
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Floating decoration elements */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute left-10 top-20 h-72 w-72 rounded-full bg-pink-300 opacity-20 mix-blend-multiply blur-xl filter"
      ></motion.div>
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
        className="absolute right-10 top-40 h-72 w-72 rounded-full bg-purple-300 opacity-20 mix-blend-multiply blur-xl filter"
      ></motion.div>
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4
        }}
        className="absolute -bottom-8 left-1/2 h-72 w-72 rounded-full bg-blue-300 opacity-20 mix-blend-multiply blur-xl filter"
      ></motion.div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm"
          >
            <Sparkles className="h-5 w-5 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-sm font-semibold text-transparent">
              Hoa là biểu tượng của cái đẹp
            </span>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent"
          >
            {searchParams.get('q')
              ? `Kết quả tìm kiếm: "${searchParams.get('q')}"`
              : 'Danh sách sản phẩm'}
          </motion.h1>
        </motion.div>

        {/* Mobile filter button */}
        <div className="mb-6 lg:hidden">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMobileFilter(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/80 px-4 py-3 font-semibold text-gray-900 shadow-lg backdrop-blur-sm"
          >
            <SlidersHorizontal className="h-5 w-5 text-pink-500" />
            Bộ lọc & Tìm kiếm
          </motion.button>
        </div>

        {/* Mobile filter overlay */}
        <AnimatePresence>
          {showMobileFilter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden"
            >
              <FilterSidebar
                isMobile
                searchKeyword={searchKeyword}
                onSearchChange={(value) => {
                  setSearchKeyword(value);
                  setCurrentPage(1);
                }}
                priceOption={priceOption}
                onPriceOptionChange={(value) => {
                  setPriceOption(value);
                  setCurrentPage(1);
                }}
                customPriceRange={customPriceRange}
                onCustomPriceRangeChange={(value) => {
                  setCustomPriceRange(value);
                  setCurrentPage(1);
                }}
                filteredCount={filteredProducts.length}
                totalCount={allProducts.length}
                onReset={handleResetFilters}
                onCloseMobile={() => setShowMobileFilter(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid: 3-7 layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
          {/* Sidebar Filter - 3 columns */}
          <div className="hidden lg:col-span-3 lg:block">
            <FilterSidebar
              searchKeyword={searchKeyword}
              onSearchChange={(value) => {
                setSearchKeyword(value);
                setCurrentPage(1);
              }}
              priceOption={priceOption}
              onPriceOptionChange={(value) => {
                setPriceOption(value);
                setCurrentPage(1);
              }}
              customPriceRange={customPriceRange}
              onCustomPriceRangeChange={(value) => {
                setCustomPriceRange(value);
                setCurrentPage(1);
              }}
              filteredCount={filteredProducts.length}
              totalCount={allProducts.length}
              onReset={handleResetFilters}
              onCloseMobile={() => {}}
            />
          </div>

          {/* Products Grid - 7 columns */}
          <div className="lg:col-span-7">
            {currentProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl bg-white/60 p-12 text-center backdrop-blur-lg"
              >
                <Sparkles className="mb-4 h-16 w-16 text-pink-400" />
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="mb-6 text-gray-600">
                  Thử điều chỉnh bộ lọc để xem thêm sản phẩm
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetFilters}
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg"
                >
                  Đặt lại bộ lọc
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* Products Grid */}
                <motion.div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {currentProducts.map((product: any) => {
                      const imageList: string[] = parseImages(product.images);
                      const firstImage =
                        imageList.length > 0 ? imageList[0] : '';
                      return (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          onMouseEnter={() => setHoveredCard(product.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          className="group relative flex"
                        >
                          <motion.div
                            animate={{
                              y: hoveredCard === product.id ? -8 : 0,
                              scale: hoveredCard === product.id ? 1.03 : 1
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 20
                            }}
                            className="flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg"
                            style={{
                              boxShadow:
                                hoveredCard === product.id
                                  ? '0 25px 50px -12px rgba(236, 72, 153, 0.3)'
                                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {/* Product Image */}
                            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                              <motion.img
                                src={firstImage}
                                alt={product.name}
                                animate={{
                                  scale: hoveredCard === product.id ? 1.1 : 1
                                }}
                                transition={{ duration: 0.6 }}
                                className="h-full w-full object-cover"
                              />

                              <motion.div
                                animate={{
                                  opacity: hoveredCard === product.id ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                              ></motion.div>

                              {/* Badges */}
                              <div className="absolute left-3 top-3 flex flex-col gap-2">
                                {product.stock < 10 && (
                                  <span className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                                    🔥 Sắp hết
                                  </span>
                                )}
                                {product.price > 200_000 && (
                                  <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                                    <Star className="h-3 w-3 fill-white" />
                                    Premium
                                  </span>
                                )}
                              </div>

                              {/* Like button */}
                              <motion.button
                                onClick={() => toggleLike(product.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                  backgroundColor: likedProducts.has(product.id)
                                    ? 'rgb(236, 72, 153)'
                                    : 'rgba(255, 255, 255, 0.8)'
                                }}
                                className="absolute right-3 top-3 rounded-full p-2 backdrop-blur-md"
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    likedProducts.has(product.id)
                                      ? 'fill-white text-white'
                                      : 'text-pink-500'
                                  }`}
                                />
                              </motion.button>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-1 flex-col p-5">
                              {/* Categories */}
                              <div className="mb-2 flex flex-wrap gap-1.5">
                                {product.categories
                                  ?.slice(0, 2)
                                  .map((cat: any) => (
                                    <span
                                      key={cat.id}
                                      className="rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-2.5 py-1 text-xs font-semibold text-pink-700"
                                    >
                                      {cat.name}
                                    </span>
                                  ))}
                              </div>

                              {/* Name */}
                              <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-pink-600">
                                {product.name}
                              </h3>

                              {/* Description */}
                              <p className="mb-3 line-clamp-2 text-xs text-gray-600">
                                {product.description}
                              </p>

                              {/* Compositions */}
                              {product.compositions?.length > 0 && (
                                <div className="mb-3 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 p-2.5">
                                  <p className="mb-1.5 text-xs font-semibold text-gray-700">
                                    Bao gồm:
                                  </p>
                                  <ul className="space-y-1 text-xs text-gray-600">
                                    {product.compositions
                                      .slice(0, 2)
                                      .map((comp: any, idx: number) => (
                                        <li
                                          key={idx}
                                          className="flex items-center gap-1.5"
                                        >
                                          <span className="h-1 w-1 rounded-full bg-pink-400"></span>
                                          {comp.childName}{' '}
                                          <span className="font-semibold text-pink-600">
                                            x{comp.quantity}
                                          </span>
                                        </li>
                                      ))}
                                    {product.compositions.length > 2 && (
                                      <li className="flex items-center gap-1.5 font-semibold text-pink-600">
                                        <span className="h-1 w-1 rounded-full bg-pink-400"></span>
                                        +{product.compositions.length - 2} loại
                                        khác
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}

                              {/* Price and Stock */}
                              <div className="mb-3 mt-auto flex items-end justify-between">
                                <div>
                                  <p className="mb-0.5 text-xs text-gray-500">
                                    Giá chỉ từ
                                  </p>
                                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                                    {__helpers.formatCurrency(product.price)}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="mb-0.5 text-xs text-gray-500">
                                    Còn lại
                                  </p>
                                  <span className="text-base font-bold text-gray-800">
                                    {product.stock}{' '}
                                    <span className="text-xs font-normal text-gray-500">
                                      SP
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAddToCart(product.id)}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/30"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  Thêm
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    router.push(`/product/${product.id}`)
                                  }
                                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900"
                                >
                                  <Eye className="h-4 w-4" />
                                  Chi tiết
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/60 p-4 shadow-xl backdrop-blur-lg"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-xl bg-white/80 p-2 text-gray-700 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        {renderPagination()}
                      </motion.div>
                    </AnimatePresence>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-xl bg-white/80 p-2 text-gray-700 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
