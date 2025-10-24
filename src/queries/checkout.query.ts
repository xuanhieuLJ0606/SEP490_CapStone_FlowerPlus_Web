import BaseRequest from '@/config/axios.config';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['checkout'],
    mutationFn: async () => {
      return BaseRequest.Post('/orders/checkout');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-cart'] });
    }
  });
};
