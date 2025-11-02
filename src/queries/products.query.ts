import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetProductsByPaging = (
  page: number,
  size: number,
  categoryId?: number
) => {
  return useQuery({
    queryKey: ['get-list-product-by-paging', page, size, categoryId],
    queryFn: async () => {
      let url = `/products/search?page=${page}&size=${size}`;
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }
      const res = await BaseRequest.Get(url);
      return res;
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Post('/products/create-product', data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Put(`/products/${data.id}`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-list-product-by-paging']
      });
    }
  });
};
