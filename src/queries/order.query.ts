import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

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
