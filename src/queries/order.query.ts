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

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['cancel-order'],
    mutationFn: async (data: { orderId: number; reason: string }) => {
      return BaseRequest.Post(`/orders/${data.orderId}/cancel`, {
        reason: data.reason
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders-by-user'] });
    }
  });
};

export const useGetRefundRequests = () => {
  return useQuery({
    queryKey: ['refund-requests'],
    queryFn: () => BaseRequest.Get('/orders/refund-requests')
  });
};

export const useGetMyRefundRequests = () => {
  return useQuery({
    queryKey: ['my-refund-requests'],
    queryFn: () => BaseRequest.Get('/orders/my-refund-requests')
  });
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['process-refund'],
    mutationFn: async (data: {
      refundId: number;
      status: string;
      adminNote: string;
      proofImageUrl: string;
    }) => {
      return BaseRequest.Post(
        `/orders/refund-requests/${data.refundId}/process`,
        {
          status: data.status,
          adminNote: data.adminNote,
          proofImageUrl: data.proofImageUrl
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refund-requests'] });
    }
  });
};
