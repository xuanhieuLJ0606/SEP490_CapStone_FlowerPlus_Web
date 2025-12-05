import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetVouchers = () => {
  return useQuery({
    queryKey: ['vouchers'],
    queryFn: () => {
      return BaseRequest.Get('/vouchers');
    }
  });
};

export const useGetVoucher = (id: number) => {
  return useQuery({
    queryKey: ['voucher', id],
    queryFn: () => {
      return BaseRequest.Get(`/vouchers/${id}`);
    },
    enabled: !!id
  });
};

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-voucher'],
    mutationFn: (data: any) => {
      return BaseRequest.Post('/vouchers', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    }
  });
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-voucher'],
    mutationFn: (data: { id: number; payload: any }) => {
      return BaseRequest.Put(`/vouchers/${data.id}`, data.payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    }
  });
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-voucher'],
    mutationFn: (id: number) => {
      return BaseRequest.Delete(`/vouchers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    }
  });
};
