import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  label?: string | null;
  labelColor?: string;
  image: string;
}

interface ProductGridProps {
  products: Product[];
  maxShowProduct: number;
  title?: string;
}

export default function ProductGrid({
  products,
  maxShowProduct,
  title = 'SẢN PHẨM'
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(products.length / maxShowProduct);

  const startIndex = currentPage * maxShowProduct;
  const endIndex = startIndex + maxShowProduct;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Hàm xử lý khi ấn vào icon giỏ hàng
  const handleAddToCart = (product: Product) => {
    // TODO: Thực hiện action thêm vào giỏ hàng ở đây
    // Ví dụ: dispatch(addToCart(product));
    // Hiện tại chỉ log ra console
    console.log('Thêm vào giỏ hàng:', product);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Title */}
        <motion.div
          className="mb-8 rounded-lg  p-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="bg-green mx-auto w-fit rounded-sm p-3 text-center text-[13px] font-bold text-white">
            {title}
          </h2>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {currentProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: 'easeOut'
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -3,
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              className="h-full"
              style={{ willChange: 'transform' }}
            >
              <Card className="flex h-full flex-col bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                <CardContent className="flex h-full flex-col p-0">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <div className="flex h-48 w-full items-center justify-center rounded-t-lg bg-gradient-to-br from-pink-200 to-blue-200">
                      <span className="font-semibold text-gray-600">
                        Hình ảnh hoa
                      </span>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute left-2 top-2">
                      <Badge className="bg-green-500 text-white">
                        -{product.discount}%
                      </Badge>
                    </div>

                    {product.label && (
                      <div className="absolute right-2 top-2">
                        <Badge className={`${product.labelColor} text-white`}>
                          {product.label}
                        </Badge>
                      </div>
                    )}

                    {/* Cart Icon Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2 bg-white/80 shadow-md hover:bg-green-100"
                      onClick={() => handleAddToCart(product)}
                      aria-label="Thêm vào giỏ hàng"
                    >
                      <ShoppingCart className="h-5 w-5 text-green-700" />
                    </Button>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-grow flex-col p-4">
                    <h3 className="mb-2 line-clamp-2 flex-grow text-sm font-semibold text-green-800">
                      {product.name}
                    </h3>

                    <div className="mt-auto space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400 line-through">
                          {product.originalPrice.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      <div className="text-lg font-bold text-green-800">
                        {product.discountedPrice.toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={i === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i)}
                  className={`h-8 w-8  p-0 ${i === currentPage ? 'bg-green text-white' : ''}`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2"
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Page Info */}
        {totalPages > 1 && (
          <motion.div className="mt-4 text-center text-sm text-gray-600"></motion.div>
        )}
      </div>
    </div>
  );
}
