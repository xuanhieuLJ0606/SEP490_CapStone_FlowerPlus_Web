import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FavoriteButton from '@/components/favorites/FavoriteButton';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  images: string;
  isActive?: boolean;
  categories?: Array<{ id: number; name: string }>;
  compositions?: Array<{
    childId: number;
    childName: string;
    childType: string;
    quantity: number;
    childPrice: number;
    childImage: string;
  }>;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: number, productName: string) => void;
  className?: string;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

// Helper function để parse JSON string thành array
const parseImages = (imagesStr: string): string[] => {
  try {
    const parsed = JSON.parse(imagesStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function ProductCard({
  product,
  index,
  onAddToCart
}: {
  product: Product;
  index: number;
  onAddToCart?: (productId: number, productName: string) => void;
}) {
  const navigate = useNavigate();
  const images = parseImages(product.images);
  const firstImage = images.length > 0 ? images[0] : '';

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product.id, product.name);
  };

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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="group relative"
    >
      <Card className="cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div
          className="relative aspect-square overflow-hidden"
          onClick={handleProductClick}
        >
          {/* Product Image */}
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: firstImage ? `url(${firstImage})` : 'none'
            }}
          >
            {!firstImage && (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="text-4xl">🌸</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.stock !== undefined &&
              product.stock <= 5 &&
              product.stock > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Còn {product.stock}
                </Badge>
              )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="text-xs">
                Hết hàng
              </Badge>
            )}
            {product.compositions && product.compositions.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Package className="mr-1 h-3 w-3" />
                {product.compositions.length} thành phần
              </Badge>
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
        </div>

        <CardContent className="p-4">
          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {product.categories.slice(0, 2).map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Product Info */}
          <div className="mb-3 cursor-pointer" onClick={handleProductClick}>
            <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors hover:text-primary">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {product.description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-xl font-bold text-primary">
              {product.price?.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
              })}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full"
            disabled={product.stock === 0}
            variant={product.stock === 0 ? 'secondary' : 'default'}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProductGrid({
  products,
  onAddToCart,
  className = '',
  columns = { sm: 2, md: 3, lg: 4, xl: 4 }
}: ProductGridProps) {
  const gridClasses = `grid gap-6 grid-cols-1 sm:grid-cols-${columns.sm || 2} md:grid-cols-${columns.md || 3} lg:grid-cols-${columns.lg || 4} xl:grid-cols-${columns.xl || 4}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className={`${gridClasses} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onAddToCart={onAddToCart}
        />
      ))}
    </motion.div>
  );
}

// Loading skeleton for ProductGrid
export function ProductGridSkeleton({
  count = 8,
  columns = { sm: 2, md: 3, lg: 4, xl: 4 }
}: {
  count?: number;
  columns?: { sm?: number; md?: number; lg?: number; xl?: number };
}) {
  const gridClasses = `grid gap-6 grid-cols-1 sm:grid-cols-${columns.sm || 2} md:grid-cols-${columns.md || 3} lg:grid-cols-${columns.lg || 4} xl:grid-cols-${columns.xl || 4}`;

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-square animate-pulse bg-muted" />
          <CardContent className="p-4">
            <div className="mb-2 h-4 animate-pulse rounded bg-muted" />
            <div className="mb-3 h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mb-4 h-6 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
