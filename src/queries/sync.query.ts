import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BaseRequest from '@/config/axios.config';

export interface SyncStatsData {
  categories: {
    total: number;
    pending: number;
    syncing: number;
    synced: number;
    failed: number;
  };
  products: {
    total: number;
    pending: number;
    syncing: number;
    synced: number;
    failed: number;
  };
}

export const useGetSyncStats = () => {
  return useQuery({
    queryKey: ['sync-stats'],
    queryFn: async () => {
      return await BaseRequest.Get('/sync/stats');
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  });
};

export const useSyncCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await BaseRequest.Post('/sync/categories', {});
    },
    onSuccess: () => {
      // Invalidate and refetch sync stats and categories
      queryClient.invalidateQueries({ queryKey: ['sync-stats'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useSyncProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await BaseRequest.Post('/sync/products', {});
    },
    onSuccess: () => {
      // Invalidate and refetch sync stats and products
      queryClient.invalidateQueries({ queryKey: ['sync-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useSyncAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await BaseRequest.Post('/sync/all', {});
    },
    onSuccess: () => {
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: ['sync-stats'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export interface SyncProductUpdatePayload {
  category_id: number;
  price: number;
  product_id: number;
  product_name: string;
  product_string: string;
}

export const useSyncProductUpdate = () => {
  return useMutation({
    mutationFn: async (payload: SyncProductUpdatePayload) => {
      // Gọi API backend để sync với AI service
      return await BaseRequest.Put('/sync/products/update', {
        category_id: payload.category_id,
        price: payload.price,
        product_id: payload.product_id,
        product_name: payload.product_name,
        product_string: payload.product_string
      });
    }
  });
};
