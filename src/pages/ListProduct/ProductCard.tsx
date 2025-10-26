'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  index: number;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  stock,
  image,
  index
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.08, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-shadow duration-300 hover:shadow-2xl">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-secondary/30 to-secondary/10 md:h-72">
          <motion.div
            variants={imageVariants}
            initial="initial"
            animate={isHovered ? 'hover' : 'initial'}
            className="flex h-full w-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: image ? `url(${image})` : 'none'
            }}
          >
            {!image && (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <span className="text-4xl">🌸</span>
              </div>
            )}
          </motion.div>

          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-3 backdrop-blur-sm transition-all hover:bg-white"
          >
            <Heart
              size={20}
              className={
                isLiked ? 'fill-primary stroke-primary' : 'stroke-foreground'
              }
            />
          </motion.button>

          {/* Badge */}
          {stock <= 5 && stock > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
            >
              {stock} left
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6">
          {/* Product Info */}
          <div className="mb-4">
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground">
              {name}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Price and Button */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {price.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </span>
              {stock === 0 && (
                <span className="text-xs font-semibold text-destructive">
                  Out of stock
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={stock === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
