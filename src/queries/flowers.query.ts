import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetFlowersByPaging = (page: number, size: number) => {
  return useQuery({
    queryKey: ['flowers', page, size],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/flowers?page=${page}&size=${size}`);
      return res;
    }
  });
};

export const useCreateFlower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Post('/flowers', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flowers'] });
    }
  });
};

export const useUpdateFlower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Put(`/flowers/${data.id}`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flowers'] });
    }
  });
};

export const useDeleteFlower = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await BaseRequest.Delete(`/products/delete-product?id=${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flowers'] });
    }
  });
};
