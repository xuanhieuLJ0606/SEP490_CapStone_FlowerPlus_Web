import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BaseRequest from '@/config/axios.config';
import __helpers from '@/helpers';

export const useAddItemToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['add-item-to-cart'],
    mutationFn: async (data: any) => {
      return BaseRequest.Post(`/cart/items`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-cart'] });
    }
  });
};

export const useGetCart = () => {
  return useQuery({
    queryKey: ['get-cart'],
    queryFn: async () => {
      return BaseRequest.Get(`/cart`);
    },
    enabled: !!__helpers.cookie_get('AT')
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-item'],
    mutationFn: async (data: any) => {
      return BaseRequest.Put(`/cart/items/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-cart'] });
    }
  });
};

export const useRemoveItemInCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['remove-item-in-cart'],
    mutationFn: async (data: any) => {
      return BaseRequest.Delete(`/cart/items/${data.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-cart'] });
    }
  });
};
