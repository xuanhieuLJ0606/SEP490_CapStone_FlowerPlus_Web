import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetCategories = (isPublic: boolean = true) => {
  return useQuery({
    queryKey: ['categories', isPublic],
    queryFn: async () => {
      if (isPublic) {
        return await BaseRequest.Get(
          `/categories/tree?isPublic=${isPublic.toString()}`
        );
      } else {
        return await BaseRequest.Get('/categories/tree');
      }
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
      const res = await BaseRequest.Post('/categories/create-category', data);
      return res;
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await BaseRequest.Post(`/categories/update-category`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories']
      });
    }
  });
};
