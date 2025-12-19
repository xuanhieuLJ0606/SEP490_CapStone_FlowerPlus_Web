import React from 'react';
import { Heart, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FavoriteNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  product?: {
    id: number;
    name: string;
    image?: string;
    price: number;
  };
  type: 'added' | 'removed';
  onViewFavorites?: () => void;
  onAddToCart?: () => void;
}

export function FavoriteNotification({
  isVisible,
  onClose,
  product,
  type,
  onViewFavorites,
  onAddToCart
}: FavoriteNotificationProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-dismiss after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const notificationVariants = {
    hidden: {
      opacity: 0,
      y: -100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed right-4 top-4 z-50 w-80"
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="border-l-4 border-l-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`rounded-full p-2 ${
                    type === 'added'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      type === 'added' ? 'fill-current' : ''
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {type === 'added'
                      ? 'Đã thêm vào yêu thích!'
                      : 'Đã xóa khỏi yêu thích!'}
                  </p>

                  {product && (
                    <div className="mt-2 flex items-center gap-2">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-muted-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs font-medium text-primary">
                          {product.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {type === 'added' && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onViewFavorites}
                        className="text-xs"
                      >
                        Xem danh sách
                      </Button>
                      {onAddToCart && (
                        <Button
                          size="sm"
                          onClick={onAddToCart}
                          className="text-xs"
                        >
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          Thêm vào giỏ
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing favorite notifications
export function useFavoriteNotifications() {
  const [notification, setNotification] = React.useState<{
    isVisible: boolean;
    product?: any;
    type: 'added' | 'removed';
  }>({
    isVisible: false,
    type: 'added'
  });

  const showNotification = React.useCallback(
    (type: 'added' | 'removed', product?: any) => {
      setNotification({
        isVisible: true,
        type,
        product
      });
    },
    []
  );

  const hideNotification = React.useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification
  };
}

// Toast-style notification for simpler use cases
export function showFavoriteToast(
  type: 'added' | 'removed',
  productName?: string
) {
  // This would integrate with your existing toast system
  const message =
    type === 'added'
      ? `Đã thêm ${productName || 'sản phẩm'} vào yêu thích`
      : `Đã xóa ${productName || 'sản phẩm'} khỏi yêu thích`;

  // Using sonner toast (already implemented in favorite.query.ts)
  return message;
}
