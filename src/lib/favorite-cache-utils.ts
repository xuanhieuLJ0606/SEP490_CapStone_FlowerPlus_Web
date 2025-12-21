import { QueryClient } from '@tanstack/react-query';
import { favoriteKeys } from '@/queries/favorite.query';
import type {
  FavoriteStatusResponse,
  FavoriteStatusMap
} from '@/types/favorite.types';

export class FavoriteCacheManager {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  // Optimistically update favorite status
  optimisticToggle(productId: number, currentStatus: boolean) {
    const newStatus = !currentStatus;

    // Update individual status cache
    this.queryClient.setQueryData(favoriteKeys.status(productId), {
      productId,
      favorited: newStatus
    });

    // Update status maps that include this product
    this.queryClient.setQueriesData(
      { queryKey: favoriteKeys.all, predicate: this.isStatusMapQuery },
      (oldData: FavoriteStatusMap | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          [productId]: newStatus
        };
      }
    );

    return { productId, favorited: newStatus };
  }

  // Revert optimistic update on error
  revertOptimisticUpdate(productId: number, originalStatus: boolean) {
    this.queryClient.setQueryData(favoriteKeys.status(productId), {
      productId,
      favorited: originalStatus
    });

    this.queryClient.setQueriesData(
      { queryKey: favoriteKeys.all, predicate: this.isStatusMapQuery },
      (oldData: FavoriteStatusMap | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          [productId]: originalStatus
        };
      }
    );
  }

  // Batch update favorite statuses
  batchUpdateStatuses(statusMap: FavoriteStatusMap) {
    Object.entries(statusMap).forEach(([productId, favorited]) => {
      this.queryClient.setQueryData(favoriteKeys.status(parseInt(productId)), {
        productId: parseInt(productId),
        favorited
      });
    });
  }

  // Prefetch favorite status for products
  prefetchFavoriteStatuses(productIds: number[]) {
    productIds.forEach((productId) => {
      this.queryClient.prefetchQuery({
        queryKey: favoriteKeys.status(productId),
        staleTime: 2 * 60 * 1000 // 2 minutes
      });
    });
  }

  // Prefetch favorites list
  prefetchFavoritesList(page: number = 0, size: number = 12) {
    this.queryClient.prefetchQuery({
      queryKey: favoriteKeys.list(page, size),
      staleTime: 5 * 60 * 1000 // 5 minutes
    });
  }

  // Invalidate all favorite-related queries
  invalidateAllFavorites() {
    this.queryClient.invalidateQueries({
      queryKey: favoriteKeys.all
    });
  }

  // Invalidate specific product's favorite data
  invalidateProductFavorites(productId: number) {
    this.queryClient.invalidateQueries({
      queryKey: favoriteKeys.status(productId)
    });

    this.queryClient.invalidateQueries({
      queryKey: favoriteKeys.count(productId)
    });

    // Invalidate status maps that include this product
    this.queryClient.invalidateQueries({
      queryKey: favoriteKeys.all,
      predicate: (query) => {
        const key = query.queryKey;
        return (
          key.includes('statusMap') &&
          Array.isArray(key[key.length - 1]) &&
          (key[key.length - 1] as number[]).includes(productId)
        );
      }
    });
  }

  // Get cached favorite status without triggering a fetch
  getCachedFavoriteStatus(
    productId: number
  ): FavoriteStatusResponse | undefined {
    return this.queryClient.getQueryData(favoriteKeys.status(productId));
  }

  // Check if multiple products are cached
  getCachedStatusMap(productIds: number[]): Partial<FavoriteStatusMap> {
    const statusMap: Partial<FavoriteStatusMap> = {};

    productIds.forEach((productId) => {
      const cached = this.getCachedFavoriteStatus(productId);
      if (cached) {
        statusMap[productId] = cached.favorited;
      }
    });

    return statusMap;
  }

  // Warm up cache with initial data
  warmUpCache(initialData: {
    favoriteStatuses?: Array<{ productId: number; favorited: boolean }>;
    favoriteCounts?: Array<{ productId: number; count: number }>;
  }) {
    // Set favorite statuses
    initialData.favoriteStatuses?.forEach(({ productId, favorited }) => {
      this.queryClient.setQueryData(favoriteKeys.status(productId), {
        productId,
        favorited
      });
    });

    // Set favorite counts
    initialData.favoriteCounts?.forEach(({ productId, count }) => {
      this.queryClient.setQueryData(favoriteKeys.count(productId), count);
    });
  }

  // Clean up stale cache entries
  cleanupStaleCache() {
    const now = Date.now();
    const staleTime = 10 * 60 * 1000; // 10 minutes

    this.queryClient
      .getQueryCache()
      .getAll()
      .forEach((query) => {
        if (
          query.queryKey[0] === 'favorites' &&
          query.state.dataUpdatedAt &&
          now - query.state.dataUpdatedAt > staleTime
        ) {
          this.queryClient.removeQueries({ queryKey: query.queryKey });
        }
      });
  }

  private isStatusMapQuery = (query: any) => {
    const key = query.queryKey;
    return key.includes('statusMap');
  };
}

// Debounce utility for rapid favorite toggles
export function createDebouncedToggle(
  toggleFn: (productId: number) => void,
  delay: number = 300
) {
  const timeouts = new Map<number, NodeJS.Timeout>();

  return (productId: number) => {
    // Clear existing timeout for this product
    const existingTimeout = timeouts.get(productId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      toggleFn(productId);
      timeouts.delete(productId);
    }, delay);

    timeouts.set(productId, timeout);
  };
}

// Batch operations for better performance
export class FavoriteBatchProcessor {
  private pendingOperations = new Map<number, 'add' | 'remove'>();
  private batchTimeout: NodeJS.Timeout | null = null;
  private processBatch: (operations: Map<number, 'add' | 'remove'>) => void;

  constructor(
    processBatch: (operations: Map<number, 'add' | 'remove'>) => void,
    private batchDelay: number = 500
  ) {
    this.processBatch = processBatch;
  }

  addOperation(productId: number, operation: 'add' | 'remove') {
    this.pendingOperations.set(productId, operation);
    this.scheduleBatch();
  }

  private scheduleBatch() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      if (this.pendingOperations.size > 0) {
        const operations = new Map(this.pendingOperations);
        this.pendingOperations.clear();
        this.processBatch(operations);
      }
      this.batchTimeout = null;
    }, this.batchDelay);
  }

  flush() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    if (this.pendingOperations.size > 0) {
      const operations = new Map(this.pendingOperations);
      this.pendingOperations.clear();
      this.processBatch(operations);
    }
  }
}

// Performance monitoring
export class FavoritePerformanceMonitor {
  private metrics = {
    toggleLatency: [] as number[],
    cacheHitRate: { hits: 0, misses: 0 },
    errorRate: { success: 0, errors: 0 }
  };

  recordToggleLatency(startTime: number) {
    const latency = Date.now() - startTime;
    this.metrics.toggleLatency.push(latency);

    // Keep only last 100 measurements
    if (this.metrics.toggleLatency.length > 100) {
      this.metrics.toggleLatency.shift();
    }
  }

  recordCacheHit() {
    this.metrics.cacheHitRate.hits++;
  }

  recordCacheMiss() {
    this.metrics.cacheHitRate.misses++;
  }

  recordSuccess() {
    this.metrics.errorRate.success++;
  }

  recordError() {
    this.metrics.errorRate.errors++;
  }

  getMetrics() {
    const avgLatency =
      this.metrics.toggleLatency.length > 0
        ? this.metrics.toggleLatency.reduce((a, b) => a + b, 0) /
          this.metrics.toggleLatency.length
        : 0;

    const cacheHitRate =
      this.metrics.cacheHitRate.hits + this.metrics.cacheHitRate.misses > 0
        ? this.metrics.cacheHitRate.hits /
          (this.metrics.cacheHitRate.hits + this.metrics.cacheHitRate.misses)
        : 0;

    const errorRate =
      this.metrics.errorRate.success + this.metrics.errorRate.errors > 0
        ? this.metrics.errorRate.errors /
          (this.metrics.errorRate.success + this.metrics.errorRate.errors)
        : 0;

    return {
      averageToggleLatency: avgLatency,
      cacheHitRate: cacheHitRate * 100,
      errorRate: errorRate * 100,
      totalOperations:
        this.metrics.errorRate.success + this.metrics.errorRate.errors
    };
  }

  reset() {
    this.metrics = {
      toggleLatency: [],
      cacheHitRate: { hits: 0, misses: 0 },
      errorRate: { success: 0, errors: 0 }
    };
  }
}
