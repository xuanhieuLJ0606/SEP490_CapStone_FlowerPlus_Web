import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetVouchers = () => {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: () => {
      return BaseRequest.Get('/vouchers');
    }
  });
};

export const useCreateVoucher = () => {
  return useMutation({
    mutationKey: ['create-voucher'],
    mutationFn: (data: any) => {
      return BaseRequest.Post('/vouchers', data);
    }
  });
};
