import BaseRequest from '@/config/axios.config';
import __helpers from '@/helpers';
import { useQuery } from '@tanstack/react-query';

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => {
      return BaseRequest.Get('/transactions/get-list-transactions');
    },
    enabled: !!__helpers.cookie_get('AT')
  });
};
