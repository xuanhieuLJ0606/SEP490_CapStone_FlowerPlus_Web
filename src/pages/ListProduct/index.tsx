'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Eye,
  Heart,
  Sparkles,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetListProductByPaging } from '@/queries/product.query';
import { PRODUCT_TYPE } from '@/constants/data';
import { useParams } from 'react-router-dom';
import __helpers from '@/helpers';
import { useAddItemToCart } from '@/queries/cart.query';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from '@/routes/hooks';

const ITEMS_PER_PAGE = 10;

// Helper to safely parse images field
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

export default function ListProduct() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [keyword] = useState('');
  const { categoryId } = useParams();
  const { data: resProducts } = useGetListProductByPaging(
    currentPage,
    ITEMS_PER_PAGE,
    keyword,
    PRODUCT_TYPE.PRODUCT,
    categoryId ? Number(categoryId) : undefined
  );
  const { mutateAsync: addToCart } = useAddItemToCart();
  const router = useRouter();

  const products = resProducts?.listObjects || [];
  const totalItems = resProducts?.totalRecords || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleLike = (productId) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
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
          className={`rounded-xl px-5 py-2.5 font-semibold ${
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

  if (products.length === 0) {
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
            Không có sản phẩm nào
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
        {/* Header with gradient */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm"
          >
            <motion.div>
              <Sparkles className="h-5 w-5 text-pink-500" />
            </motion.div>
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
            Danh sách sản phẩm
          </motion.h1>
        </motion.div>

        {/* Products Grid with stagger animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => {
              // Parse images array (should be an array of image URLs)
              const imageList: string[] = parseImages(product.images);
              const firstImage = imageList.length > 0 ? imageList[0] : '';
              return (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }
                    },
                    exit: {
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.3 }
                    }
                  }}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative flex"
                >
                  <motion.div
                    animate={{
                      y: hoveredCard === product.id ? -12 : 0,
                      scale: hoveredCard === product.id ? 1.05 : 1
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
                    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                      <motion.img
                        src={firstImage}
                        alt={product.name}
                        animate={{
                          scale: hoveredCard === product.id ? 1.1 : 1,
                          rotate: hoveredCard === product.id ? 2 : 0
                        }}
                        transition={{
                          duration: 0.6,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        className="h-full w-full object-cover"
                      />

                      {/* Gradient overlay */}
                      <motion.div
                        animate={{
                          opacity: hoveredCard === product.id ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                      ></motion.div>

                      {/* Badges */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="absolute left-4 top-4 flex flex-col gap-2"
                      >
                        {product.stock < 10 && (
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                            className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                          >
                            🔥 Sắp hết
                          </motion.span>
                        )}
                        {product.price > 200000 && (
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                          >
                            <Star className="h-3 w-3 fill-white" />
                            Premium
                          </motion.span>
                        )}
                      </motion.div>

                      {/* Like button */}
                      <motion.button
                        onClick={() => toggleLike(product.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          scale: likedProducts.has(product.id) ? 1.1 : 1,
                          backgroundColor: likedProducts.has(product.id)
                            ? 'rgb(236, 72, 153)'
                            : 'rgba(255, 255, 255, 0.8)'
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17
                        }}
                        className="absolute right-4 top-4 rounded-full p-2.5 backdrop-blur-md"
                      >
                        <motion.div
                          animate={{
                            scale: likedProducts.has(product.id)
                              ? [1, 1.3, 1]
                              : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              likedProducts.has(product.id)
                                ? 'fill-white text-white'
                                : 'text-pink-500'
                            }`}
                          />
                        </motion.div>
                      </motion.button>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Categories */}
                      <div className="mb-3 flex flex-wrap gap-2">
                        {product.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-3 py-1.5 text-xs font-semibold text-pink-700"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>

                      {/* Name */}
                      <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-pink-600">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                        {product.description}
                      </p>

                      {/* Compositions */}
                      {product.compositions.length > 0 && (
                        <div className="mb-4 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 p-3">
                          <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-700">
                            Bao gồm:
                          </p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            {product.compositions
                              .slice(0, 2)
                              .map((comp, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400"></span>
                                  {comp.childName}{' '}
                                  <span className="font-semibold text-pink-600">
                                    x{comp.quantity}
                                  </span>
                                </li>
                              ))}
                            {product.compositions.length > 2 && (
                              <li className="flex items-center gap-2 font-semibold text-pink-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-pink-400"></span>
                                +{product.compositions.length - 2} loại khác
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Price and Stock */}
                      <div className="mb-4 mt-auto flex items-end justify-between">
                        <div>
                          <p className="mb-1 text-xs text-gray-500">
                            Giá chỉ từ
                          </p>
                          <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                            {__helpers.formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="mb-1 text-xs text-gray-500">Còn lại</p>
                          <span className="text-lg font-bold text-gray-800">
                            {product.stock}{' '}
                            <span className="text-sm font-normal text-gray-500">
                              SP
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product.id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:from-pink-600 hover:to-rose-600 hover:shadow-xl hover:shadow-pink-500/40"
                        >
                          <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 2
                            }}
                          >
                            <ShoppingCart className="h-5 w-5" />
                          </motion.div>
                          Thêm giỏ
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/product/${product.id}`)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-black shadow-lg"
                        >
                          <Eye className="h-5 w-5" />
                          Xem chi tiết
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Pagination with glassmorphism */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-lg"
          >
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl bg-white/80 p-3 text-gray-700 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                {renderPagination()}
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl bg-white/80 p-3 text-gray-700 backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
