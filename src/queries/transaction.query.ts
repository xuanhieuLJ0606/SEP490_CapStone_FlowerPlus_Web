import BaseRequest from '@/config/axios.config';
import __helpers from '@/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => {
      return BaseRequest.Get('/transactions/get-list-transactions');
    },
    enabled: !!__helpers.cookie_get('AT')
  });
};

export const useGetTransactionsWithOrder = () => {
  return useQuery({
    queryKey: ['transactions-with-order'],
    queryFn: () => {
      return BaseRequest.Get('/transactions/get-list-transactions-with-order');
    },
    enabled: !!__helpers.cookie_get('AT')
  });
};

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-transaction-status'],
    mutationFn: async (data: { transactionId: number; status: string }) => {
      return BaseRequest.Put(
        `/transactions/${data.transactionId}/update-status`,
        { status: data.status }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions-with-order'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
};
