import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Grid3X3, List, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserFavorites } from '@/queries/favorite.query';
import { useAddItemToCart } from '@/queries/cart.query';
import { FavoriteErrorBoundary } from './FavoriteErrorBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FavoriteButton from './FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

interface FavoritesPageProps {
  className?: string;
}

function FavoriteProductCard({
  product,
  index
}: {
  product: any;
  index: number;
}) {
  const navigate = useNavigate();
  const { mutateAsync: addItemToCart } = useAddItemToCart();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1
      }
    }
  };

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      productId: product.id,
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
      description: `${product.name} đã được thêm vào giỏ hàng`,
      variant: 'default'
    });
  };

  // Parse images from JSON string
  const getProductImage = () => {
    try {
      if (product.images) {
        const imageArray = JSON.parse(product.images);
        return Array.isArray(imageArray) && imageArray.length > 0
          ? imageArray[0]
          : null;
      }
      return null;
    } catch (error) {
      console.warn('Failed to parse product images:', error);
      return null;
    }
  };

  const productImage = getProductImage();

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group relative h-full"
    >
      <Card className="flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div
          className="relative aspect-square overflow-hidden"
          onClick={handleProductClick}
        >
          {/* Product Image */}
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}

          {/* Fallback placeholder */}
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 ${productImage ? 'hidden' : ''}`}
          >
            <span className="text-4xl">🌸</span>
          </div>

          {/* Favorite Button */}
          <div className="absolute right-2 top-2">
            <FavoriteButton productId={product.id} size="sm" variant="rose" />
          </div>

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge
              variant="destructive"
              className="absolute bottom-2 left-2 px-1.5 py-0.5 text-xs"
            >
              Còn {product.stock}
            </Badge>
          )}

          {product.stock === 0 && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 px-1.5 py-0.5 text-xs"
            >
              Hết hàng
            </Badge>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-3">
          {/* Product Info */}
          <div
            className="mb-2 flex-1 cursor-pointer"
            onClick={handleProductClick}
          >
            <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors hover:text-primary">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-primary">
              {product.price?.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
              })}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="mt-auto h-8 w-full bg-rose-500 text-xs"
            disabled={product.stock === 0}
            variant={product.stock === 0 ? 'secondary' : 'default'}
            size="sm"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-1 h-3 w-3" />
            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-6 rounded-full bg-muted p-6">
        <Heart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">Chưa có sản phẩm yêu thích</h3>
      <p className="mb-6 max-w-md text-muted-foreground">
        Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. Hãy khám phá và thêm
        những sản phẩm bạn thích!
      </p>
      <Button onClick={() => navigate('/products')}>Khám phá sản phẩm</Button>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="flex h-full flex-col overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <CardContent className="flex flex-1 flex-col p-3">
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="mb-2 h-3 w-full" />
            <Skeleton className="mb-3 h-4 w-1/2 flex-1" />
            <Skeleton className="mt-auto h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FavoritesPageInner({ className }: FavoritesPageProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const pageSize = 12;

  const {
    data: favoritesData,
    isLoading,
    isError,
    error
  } = useUserFavorites(currentPage, pageSize);

  const favorites = favoritesData?.listObjects || [];
  const totalPages = favoritesData?.totalPages || 0;
  const totalElements = favoritesData?.totalRecords || 0;

  // Filter favorites based on search query
  const filteredFavorites = favorites.filter(
    (product: any) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các sản phẩm bạn yêu thích
          </p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
        </div>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-destructive">
            Có lỗi xảy ra khi tải danh sách yêu thích:{' '}
            {(error as Error)?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
            <p className="text-sm text-muted-foreground">
              {totalElements > 0
                ? `${totalElements} sản phẩm trong danh sách yêu thích`
                : 'Quản lý các sản phẩm bạn yêu thích'}
            </p>
          </div>

          {totalElements > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      {totalElements > 0 && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm yêu thích..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {favorites.length === 0 ? (
        <EmptyState />
      ) : filteredFavorites.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            Không tìm thấy sản phẩm nào phù hợp với "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <motion.div
            className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                : 'grid-cols-1'
            }`}
            layout
          >
            {filteredFavorites.map((product: any, index: number) => (
              <FavoriteProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Trước
                </Button>

                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Trang {currentPage + 1} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function FavoritesPage(props: FavoritesPageProps) {
  return (
    <FavoriteErrorBoundary>
      <FavoritesPageInner {...props} />
    </FavoriteErrorBoundary>
  );
}
