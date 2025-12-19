import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  FavoriteCacheManager,
  createDebouncedToggle,
  FavoriteBatchProcessor,
  FavoritePerformanceMonitor
} from '@/lib/favorite-cache-utils';
import { useFavoriteToggle } from '@/queries/favorite.query';

// Hook for managing favorite performance optimizations
export function useFavoritePerformance() {
  const queryClient = useQueryClient();
  const cacheManager = useRef(new FavoriteCacheManager(queryClient));
  const performanceMonitor = useRef(new FavoritePerformanceMonitor());
  const toggleMutation = useFavoriteToggle();

  // Batch processor for multiple operations
  const batchProcessor = useRef(
    new FavoriteBatchProcessor((operations) => {
      // Process batched operations
      operations.forEach((operation, productId) => {
        toggleMutation.mutate({ productId });
      });
    })
  );

  // Debounced toggle to prevent rapid clicks
  const debouncedToggle = useRef(
    createDebouncedToggle((productId: number) => {
      const startTime = Date.now();

      toggleMutation.mutate(
        { productId },
        {
          onSuccess: () => {
            performanceMonitor.current.recordToggleLatency(startTime);
            performanceMonitor.current.recordSuccess();
          },
          onError: () => {
            performanceMonitor.current.recordError();
          }
        }
      );
    }, 300)
  );

  // Prefetch favorites for visible products
  const prefetchFavorites = (productIds: number[]) => {
    cacheManager.current.prefetchFavoriteStatuses(productIds);
  };

  // Warm up cache with initial data
  const warmUpCache = (initialData: any) => {
    cacheManager.current.warmUpCache(initialData);
  };

  // Get performance metrics
  const getMetrics = () => {
    return performanceMonitor.current.getMetrics();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      batchProcessor.current.flush();
      cacheManager.current.cleanupStaleCache();
    };
  }, []);

  return {
    cacheManager: cacheManager.current,
    debouncedToggle: debouncedToggle.current,
    batchProcessor: batchProcessor.current,
    prefetchFavorites,
    warmUpCache,
    getMetrics
  };
}

// Hook for intersection observer to prefetch favorites
export function useFavoriteIntersectionObserver() {
  const { prefetchFavorites } = useFavoritePerformance();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedProducts = useRef(new Set<number>());

  const observeProduct = (element: Element, productId: number) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const productId = parseInt(
                entry.target.getAttribute('data-product-id') || '0'
              );
              if (productId && !observedProducts.current.has(productId)) {
                observedProducts.current.add(productId);
                prefetchFavorites([productId]);
              }
            }
          });
        },
        {
          rootMargin: '100px', // Prefetch when product is 100px away from viewport
          threshold: 0.1
        }
      );
    }

    element.setAttribute('data-product-id', productId.toString());
    observerRef.current.observe(element);
  };

  const unobserveProduct = (element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  };

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    observeProduct,
    unobserveProduct
  };
}

// Hook for managing favorite state with local storage backup
export function useFavoriteLocalStorage() {
  const STORAGE_KEY = 'favorite_cache';
  const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  const saveFavoriteToStorage = (productId: number, isFavorited: boolean) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};

      data[productId] = {
        isFavorited,
        timestamp: Date.now()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save favorite to localStorage:', error);
    }
  };

  const getFavoriteFromStorage = (productId: number): boolean | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      const item = data[productId];

      if (!item) return null;

      // Check if data is expired
      if (Date.now() - item.timestamp > STORAGE_EXPIRY) {
        delete data[productId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return null;
      }

      return item.isFavorited;
    } catch (error) {
      console.warn('Failed to get favorite from localStorage:', error);
      return null;
    }
  };

  const clearExpiredStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const data = JSON.parse(stored);
      const now = Date.now();
      let hasChanges = false;

      Object.keys(data).forEach((productId) => {
        if (now - data[productId].timestamp > STORAGE_EXPIRY) {
          delete data[productId];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.warn('Failed to clear expired storage:', error);
    }
  };

  // Clear expired data on mount
  useEffect(() => {
    clearExpiredStorage();
  }, []);

  return {
    saveFavoriteToStorage,
    getFavoriteFromStorage,
    clearExpiredStorage
  };
}
