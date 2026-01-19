import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Admin queries for managing personal vouchers
export const useGetPersonalVouchers = (params?: {
  page?: number;
  size?: number;
  userId?: number | null;
  isUsed?: boolean;
  createdBy?: string;
  searchTerm?: string;
}) => {
  return useQuery({
    queryKey: ['personal-vouchers', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      if (params?.page !== undefined)
        searchParams.append('page', params.page.toString());
      if (params?.size !== undefined)
        searchParams.append('size', params.size.toString());
      if (params?.userId)
        searchParams.append('userId', params.userId.toString());
      if (params?.isUsed !== undefined)
        searchParams.append('isUsed', params.isUsed.toString());
      if (params?.createdBy) searchParams.append('createdBy', params.createdBy);
      if (params?.searchTerm)
        searchParams.append('searchTerm', params.searchTerm);

      const queryString = searchParams.toString();
      const url = queryString
        ? `/personal-vouchers/admin/search?${queryString}`
        : '/personal-vouchers/admin/list';
      return BaseRequest.Get(url);
    }
  });
};

export const useGetPersonalVouchersByVoucherId = (voucherId: number) => {
  return useQuery({
    queryKey: ['personal-vouchers-by-voucher', voucherId],
    queryFn: () => {
      return BaseRequest.Get(
        `/personal-vouchers/admin/by-voucher/${voucherId}`
      );
    },
    enabled: !!voucherId
  });
};

export const useGetVouchersExpiringSoon = () => {
  return useQuery({
    queryKey: ['personal-vouchers-expiring-soon'],
    queryFn: () => {
      return BaseRequest.Get('/personal-vouchers/admin/expiring-soon');
    }
  });
};

export const useCreatePersonalVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-personal-voucher'],
    mutationFn: (data: any) => {
      return BaseRequest.Post('/personal-vouchers/admin/create', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-vouchers'] });
    }
  });
};

export const useCreateBulkPersonalVouchers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-bulk-personal-vouchers'],
    mutationFn: (data: any) => {
      return BaseRequest.Post('/personal-vouchers/admin/create-bulk', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-vouchers'] });
    }
  });
};

export const useDeletePersonalVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-personal-voucher'],
    mutationFn: (userVoucherId: number) => {
      return BaseRequest.Delete(`/personal-vouchers/admin/${userVoucherId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-vouchers'] });
    }
  });
};

export const useDeleteAllPersonalVouchersForUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-all-personal-vouchers-for-user'],
    mutationFn: (userId: number) => {
      return BaseRequest.Delete(`/personal-vouchers/admin/user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-vouchers'] });
    }
  });
};

export const useUpdatePersonalVoucher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-personal-voucher'],
    mutationFn: async (data: { voucherId: number; payload: any }) => {
      console.log('Calling API: PUT /vouchers/' + data.voucherId, data.payload);
      // Update the underlying voucher which affects all personal vouchers with this voucherId
      const result = await BaseRequest.Put(
        `/vouchers/${data.voucherId}`,
        data.payload
      );
      console.log('API Response:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
    }
  });
};

export const useGetPersonalVoucherById = (userVoucherId: number) => {
  return useQuery({
    queryKey: ['personal-voucher', userVoucherId],
    queryFn: () => {
      return BaseRequest.Get(`/personal-vouchers/admin/${userVoucherId}`);
    },
    enabled: !!userVoucherId
  });
};

// User queries for viewing their personal vouchers
export const useGetMyPersonalVouchers = () => {
  return useQuery({
    queryKey: ['my-personal-vouchers'],
    queryFn: () => {
      return BaseRequest.Get('/personal-vouchers/my-vouchers');
    }
  });
};

export const useGetMyPersonalVouchersWithPagination = (params?: {
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ['my-personal-vouchers-paginated', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      // Convert frontend page (1-based) to backend page (0-based)
      if (params?.page !== undefined)
        searchParams.append('page', (params.page - 1).toString());
      if (params?.size !== undefined)
        searchParams.append('size', params.size.toString());

      const queryString = searchParams.toString();
      const url = queryString
        ? `/personal-vouchers/my-vouchers/paginated?${queryString}`
        : '/personal-vouchers/my-vouchers/paginated';
      return BaseRequest.Get(url);
    }
  });
};

export const useGetMyActivePersonalVouchers = () => {
  return useQuery({
    queryKey: ['my-active-personal-vouchers'],
    queryFn: () => {
      return BaseRequest.Get('/personal-vouchers/my-vouchers/active');
    }
  });
};

export const useGetMyPersonalVoucherCount = () => {
  return useQuery({
    queryKey: ['my-personal-voucher-count'],
    queryFn: () => {
      return BaseRequest.Get('/personal-vouchers/my-vouchers/count');
    }
  });
};

// Voucher validation queries
export const useValidatePersonalVoucher = () => {
  return useMutation({
    mutationKey: ['validate-personal-voucher'],
    mutationFn: (data: any) => {
      return BaseRequest.Post('/personal-vouchers/validate', data);
    }
  });
};

export const useValidatePersonalVoucherForCart = () => {
  return useMutation({
    mutationKey: ['validate-personal-voucher-for-cart'],
    mutationFn: (code: string) => {
      return BaseRequest.Get(
        `/personal-vouchers/validate-current-cart?code=${code}`
      );
    }
  });
};
