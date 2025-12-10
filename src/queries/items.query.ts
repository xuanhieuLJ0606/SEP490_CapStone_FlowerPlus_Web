import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetItemsByPaging = (page: number, size: number) => {
  return useQuery({
    queryKey: ['items', page, size],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/items?page=${page}&size=${size}`);
      return res;
    }
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Post('/items', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Put('/items', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await BaseRequest.Delete(`/products/delete-product?id=${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });
};