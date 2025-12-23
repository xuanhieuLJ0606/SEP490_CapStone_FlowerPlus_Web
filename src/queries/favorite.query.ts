import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  FavoriteStatusResponse,
  FavoriteToggleRequest,
  FavoriteStatusMap
} from '@/types/favorite.types';
import __helpers from '@/helpers';

// Helper function to safely extract data from API response
const extractData = (response: any) => {
  return response?.data || response;
};

// Query Keys
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (page: number, size: number) =>
    [...favoriteKeys.lists(), page, size] as const,
  status: (productId: number) =>
    [...favoriteKeys.all, 'status', productId] as const,
  statusMap: (productIds: number[]) =>
    [...favoriteKeys.all, 'statusMap', productIds] as const,
  count: (productId: number) =>
    [...favoriteKeys.all, 'count', productId] as const
};

// Get user's favorites with pagination
export const useUserFavorites = (page: number, size: number) => {
  return useQuery({
    queryKey: favoriteKeys.list(page, size),
    queryFn: async () => {
      const res = await BaseRequest.Get(
        `/favorites?pageNumber=${page}&pageSize=${size}`
      );
      return extractData(res);
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Check if a product is favorited
export const useFavoriteStatus = (
  productId: number | null,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: favoriteKeys.status(productId!),
    queryFn: async (): Promise<FavoriteStatusResponse> => {
      if (!productId) throw new Error('Product ID is required');
      const res = await BaseRequest.Get(`/favorites/check/${productId}`);
      return extractData(res);
    },
    enabled:
      options?.enabled !== false && !!productId && !!__helpers.cookie_get('AT'),
    staleTime: 30 * 1000, // 30 seconds - shorter to allow faster updates
    refetchOnMount: 'always'
  });
};

// Check favorite status for multiple products
export const useFavoriteStatusMap = (
  productIds: number[],
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: favoriteKeys.statusMap(productIds),
    queryFn: async (): Promise<FavoriteStatusMap> => {
      if (!productIds.length) return {};
      const res = await BaseRequest.Post(
        '/favorites/check-multiple',
        productIds
      );
      return extractData(res);
    },
    enabled: options?.enabled !== false && productIds.length > 0,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

// Get favorite count for a product (public endpoint)
export const useFavoriteCount = (
  productId: number | null,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: favoriteKeys.count(productId!),
    queryFn: async (): Promise<number> => {
      if (!productId) throw new Error('Product ID is required');
      const res = await BaseRequest.Get(`/favorites/count/${productId}`);
      return extractData(res);
    },
    enabled: options?.enabled !== false && !!productId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Toggle favorite status
export const useFavoriteToggle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      request: FavoriteToggleRequest
    ): Promise<FavoriteStatusResponse> => {
      const res = await BaseRequest.Post('/favorites/toggle', request);
      return extractData(res);
    },
    onSuccess: (data, variables) => {
      // Update favorite status cache immediately
      queryClient.setQueryData(favoriteKeys.status(variables.productId), data);

      queryClient.invalidateQueries({
        queryKey: favoriteKeys.status(variables.productId)
      });

      // Invalidate favorites list to refresh
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.lists()
      });

      // Update favorite count cache
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.count(variables.productId)
      });

      // Invalidate status maps that include this product
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.all,
        predicate: (query) => {
          const key = query.queryKey;
          return (
            key.includes('statusMap') &&
            Array.isArray(key[key.length - 1]) &&
            (key[key.length - 1] as number[]).includes(variables.productId)
          );
        }
      });

      // Show success message
      const message = data.favorited
        ? 'Đã thêm vào yêu thích'
        : 'Đã xóa khỏi yêu thích';
      toast.success(message);
    },
    onError: (error: any) => {
      console.error('Error toggling favorite:', error);
      const message =
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật yêu thích';
      toast.error(message);
    },
    retry: (failureCount, error: any) => {
      // Retry on network errors, but not on 4xx client errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000) // Exponential backoff
  });
};

// Remove favorite
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number): Promise<string> => {
      const res = await BaseRequest.Delete(`/favorites/${productId}`);
      return extractData(res);
    },
    onSuccess: (data, productId) => {
      // Update favorite status cache
      queryClient.setQueryData(favoriteKeys.status(productId), {
        productId,
        favorited: false
      });

      // Invalidate favorites list to refresh
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.lists()
      });

      // Update favorite count cache
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.count(productId)
      });

      // Invalidate status maps that include this product
      queryClient.invalidateQueries({
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

      toast.success('Đã xóa khỏi danh sách yêu thích');
    },
    onError: (error: any) => {
      console.error('Error removing favorite:', error);
      const message =
        error.response?.data?.message || 'Có lỗi xảy ra khi xóa yêu thích';
      toast.error(message);
    },
    retry: (failureCount, error: any) => {
      // Retry on network errors, but not on 4xx client errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Optimistic toggle hook for better UX with enhanced caching
export const useOptimisticFavoriteToggle = () => {
  const queryClient = useQueryClient();
  const toggleMutation = useFavoriteToggle();

  return {
    ...toggleMutation,
    mutate: (request: FavoriteToggleRequest) => {
      const startTime = Date.now();

      // Get current status for optimistic update
      const previousStatus = queryClient.getQueryData(
        favoriteKeys.status(request.productId)
      ) as FavoriteStatusResponse | undefined;
      const currentStatus = previousStatus?.favorited || false;

      // Optimistically update the UI
      const newStatus = !currentStatus;
      const optimisticData: FavoriteStatusResponse = {
        productId: request.productId,
        favorited: newStatus
      };

      // Set query data optimistically - this should trigger re-render
      queryClient.setQueryData(
        favoriteKeys.status(request.productId),
        optimisticData
      );

      // Force refetch to ensure UI updates immediately
      queryClient.refetchQueries({
        queryKey: favoriteKeys.status(request.productId),
        type: 'active'
      });

      // Update status maps optimistically
      queryClient.setQueriesData(
        {
          queryKey: favoriteKeys.all,
          predicate: (query) => query.queryKey.includes('statusMap')
        },
        (oldData: FavoriteStatusMap | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            [request.productId]: newStatus
          };
        }
      );

      // Perform the actual mutation
      toggleMutation.mutate(request, {
        onSuccess: (data) => {
          // The parent mutation already handles cache updates
          // Just record performance metrics
          const latency = Date.now() - startTime;
          console.debug(`Favorite toggle completed in ${latency}ms`);
        },
        onError: () => {
          // Revert optimistic updates on error
          queryClient.setQueryData(
            favoriteKeys.status(request.productId),
            previousStatus
          );

          queryClient.setQueriesData(
            {
              queryKey: favoriteKeys.all,
              predicate: (query) => query.queryKey.includes('statusMap')
            },
            (oldData: FavoriteStatusMap | undefined) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                [request.productId]: currentStatus
              };
            }
          );
        }
      });
    }
  };
};
