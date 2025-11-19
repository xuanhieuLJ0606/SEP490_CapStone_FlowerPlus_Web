import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => {
      return BaseRequest.Get('/orders/get-list-orders');
    }
  });
};

export const useGetOrdersByUser = () => {
  return useQuery({
    queryKey: ['orders-by-user'],
    queryFn: () => {
      return BaseRequest.Get('/orders/get-list-orders-by-user');
    }
  });
};

export const useCheckoutProductCustom = () => {
  return useMutation({
    mutationKey: ['checkout-product-custom'],
    mutationFn: async (data: any) => {
      return BaseRequest.Post('/orders/checkout-product', data);
    }
  });
};

export const useAddTransactionToOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['add-transaction-to-order'],
    mutationFn: async (data: any) => {
      return BaseRequest.Post('/orders/add-transaction-to-order', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};

export const useUpdateDeliveryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-delivery-status'],
    mutationFn: async (data: any) => {
      return BaseRequest.Post(
        `/orders/${data.orderId}/delivery-status/set`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};
