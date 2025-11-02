import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await BaseRequest.Get('/categories/tree');
      return res;
    }
  });
};

export const useGetCategoriesByPaging = (
  page: number,
  size: number,
  keyword: string
) => {
  return useQuery({
    queryKey: ['categories', page, size],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (keyword) {
        params.append('keyword', keyword);
      }

      const res = await BaseRequest.Get(
        `/categories/search?page=${page}&size=${size}&${params.toString()}`
      );
      return res;
    }
  });
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Post('/categories', data);
      return res;
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Put(`/categories/update`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories']
      });
    }
  });
};
