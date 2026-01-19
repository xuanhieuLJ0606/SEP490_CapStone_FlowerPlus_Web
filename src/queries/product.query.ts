import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetListProductByPaging = (
  page: number,
  size: number,
  keyword: string,
  type: string,
  categoryId?: number
) => {
  return useQuery({
    queryKey: [
      'get-list-product-by-paging',
      page,
      size,
      keyword,
      type,
      categoryId
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (keyword) {
        params.append('keyword', keyword);
      }
      if (type) {
        params.append('type', type);
      }
      if (categoryId) {
        params.append('categoryId', categoryId.toString());
      }
      const res = await BaseRequest.Get(
        `/products/get-list-product?active=true&pageNumber=${page}&pageSize=${size}&${params.toString()}`
      );
      return res.data;
    }
  });
};

export const useGetProductById = (
  id: number | null,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['get-product-by-id', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const res = await BaseRequest.Get(`/products/get-product-by-id?id=${id}`);
      return res;
    },
    enabled: options?.enabled !== false && !!id
  });
};

export const useGetProductByIdMutation = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await BaseRequest.Get(`/products/get-product-by-id?id=${id}`);
      return res.data;
    }
  });
};

export const useGetProductCustomByPaging = (page: number, size: number) => {
  return useQuery({
    queryKey: ['get-product-custom-by-paging', page, size],
    queryFn: async () => {
      const res = await BaseRequest.Get(
        `/products/get-list-product-by-user?type=PRODUCT&active=true&pageNumber=${page}&pageSize=${size}&custom=true`
      );
      return res.data;
    }
  });
};

export const useGetListProductToView = (page: number, size: number) => {
  return useQuery({
    queryKey: ['get-list-product-to-view', page, size],
    queryFn: async () => {
      const res = await BaseRequest.Get(
        `/products/get-list-product-view?active=true&pageNumber=${page}&pageSize=${size}`
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - cache data for 5 minutes
    refetchOnMount: false, // Don't refetch on mount if data is fresh
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  });
};
