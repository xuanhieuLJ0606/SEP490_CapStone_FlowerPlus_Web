import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

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

export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: ['get-product-by-id', id],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/products/get-product-by-id?id=${id}`);
      return res.data;
    }
  });
};
