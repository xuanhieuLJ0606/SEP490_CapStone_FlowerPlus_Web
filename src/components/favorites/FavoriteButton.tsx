import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  useFavoriteStatus,
  useOptimisticFavoriteToggle
} from '@/queries/favorite.query';
import { FavoriteErrorBoundary } from './FavoriteErrorBoundary';

interface FavoriteButtonProps {
  productId: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCount?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'ghost' | 'outline' | 'rose';
}

const sizeClasses = {
  sm: 'h-8 w-8 p-1.5',
  md: 'h-10 w-10 p-2',
  lg: 'h-12 w-12 p-2.5'
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24
};

function FavoriteButtonInner({
  productId,
  size = 'md',
  className,
  showCount = false,
  disabled = false,
  variant = 'default'
}: FavoriteButtonProps) {
  const { data: favoriteStatus, isLoading: isStatusLoading } =
    useFavoriteStatus(productId);
  const toggleMutation = useOptimisticFavoriteToggle();
  console.log(favoriteStatus);

  const isFavorited = favoriteStatus?.favorited || false;
  const isLoading = isStatusLoading || toggleMutation.isPending;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isLoading) return;

    toggleMutation.mutate({ productId });
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center rounded-full transition-all duration-200',
    'hover:scale-105 active:scale-95',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    sizeClasses[size],
    {
      'bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm':
        variant === 'default',
      'bg-transparent hover:bg-white/10': variant === 'ghost',
      'border border-border bg-background hover:bg-accent':
        variant === 'outline',
      'bg-rose-50/90 backdrop-blur-sm hover:bg-rose-100/90 shadow-sm border border-rose-200/50':
        variant === 'rose',
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-pointer': !disabled && !isLoading
    },
    className
  );

  const heartVariants = {
    unfavorited: {
      scale: 1,
      rotate: 0
    },
    favorited: {
      scale: [1, 1.2, 1],
      rotate: [0, -10, 10, 0]
    },
    loading: {
      scale: 0.8,
      opacity: 0.5
    }
  };

  return (
    <motion.button
      className={baseClasses}
      onClick={handleToggle}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.9 }}
      aria-label={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      title={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      {isLoading ? (
        <Loader2
          size={iconSizes[size]}
          className="animate-spin text-muted-foreground"
        />
      ) : (
        <motion.div
          variants={heartVariants}
          animate={
            isLoading ? 'loading' : isFavorited ? 'favorited' : 'unfavorited'
          }
          initial="unfavorited"
          transition={{
            duration: 0.6,
            ease: 'easeInOut'
          }}
        >
          <Heart
            size={iconSizes[size]}
            className={cn('transition-colors duration-200', {
              'fill-rose-500 stroke-rose-500 text-rose-500':
                isFavorited && variant === 'rose',
              'fill-red-500 stroke-red-500 text-red-500':
                isFavorited && variant !== 'rose',
              'stroke-current text-rose-400 hover:text-rose-500':
                !isFavorited && variant === 'rose',
              'stroke-current text-muted-foreground hover:text-red-400':
                !isFavorited && variant !== 'rose'
            })}
          />
        </motion.div>
      )}

      {/* Ripple effect on click */}
      {!disabled && !isLoading && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full',
            variant === 'rose' ? 'bg-rose-400/20' : 'bg-red-400/20'
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={isFavorited ? { scale: 1.5, opacity: [0, 1, 0] } : {}}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.button>
  );
}

export default function FavoriteButton(props: FavoriteButtonProps) {
  return (
    <FavoriteErrorBoundary>
      <FavoriteButtonInner {...props} />
    </FavoriteErrorBoundary>
  );
}

// Compact version for use in lists
export function CompactFavoriteButton({
  productId,
  className
}: {
  productId: number;
  className?: string;
}) {
  return (
    <FavoriteButton
      productId={productId}
      size="sm"
      variant="ghost"
      className={className}
    />
  );
}

// Large version for product detail pages
export function LargeFavoriteButton({
  productId,
  className,
  showCount = true
}: {
  productId: number;
  className?: string;
  showCount?: boolean;
}) {
  return (
    <FavoriteButton
      productId={productId}
      size="lg"
      variant="outline"
      showCount={showCount}
      className={className}
    />
  );
}
