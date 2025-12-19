import BaseRequest, { BaseRequestV2 } from '@/config/axios.config';
import __helpers from '@/helpers';
import { setInfoUser } from '@/redux/auth.slice';
import { RootState } from '@/redux/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

export const useGetAllUser = (keyword: string) => {
  return useQuery({
    queryKey: ['get-all-user', keyword],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('searchTerm', keyword);
      return await BaseRequest.Get(
        `/user-management/users?${params.toString()}`
      );
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (model: any) => {
      return await BaseRequestV2.Put(
        `/user-management/users/${model.id}`,
        model
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-all-user']
      });
    }
  });
};

export const useUpdateLockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-lock-user'],
    mutationFn: async (model: any) => {
      console.log(model);
      return await axios.put(
        `/user-management/users/${model.id}/block`,
        !model.status,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-all-user']
      });
    }
  });
};

export const useGetMyInfo = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['get-my-info'],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/auth/me?includeRole=false`);
      dispatch(setInfoUser(res.data));
      return res.data;
    },
    enabled: !!__helpers.cookie_get('AT')
  });
};

export const useGetMyInfoOnce = () => {
  const dispatch = useDispatch();
  const infoUser = useSelector((state: RootState) => state.auth.infoUser);
  const hasToken = !!__helpers.cookie_get('AT');

  return useQuery({
    queryKey: ['get-my-info'],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/api/user/my-profile`);
      dispatch(setInfoUser(res.data));
      return res.data;
    },
    enabled: hasToken && !infoUser,
    staleTime: Infinity
  });
};

export const useGetUsers = (params?: {
  search?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ['get-users', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('searchTerm', params.search);
      // Convert page from 0-based to 1-based for backend
      if (params?.page !== undefined)
        searchParams.append('page', (params.page + 1).toString());
      if (params?.size !== undefined)
        searchParams.append('size', params.size.toString());

      const queryString = searchParams.toString();
      const url = queryString
        ? `/user-management/users?${queryString}`
        : '/user-management/users';
      return await BaseRequest.Get(url);
    }
  });
};

export const useGetUsersForVoucher = (params?: {
  search?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ['get-users-for-voucher', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.page !== undefined)
        searchParams.append('page', (params.page + 1).toString());
      if (params?.size !== undefined)
        searchParams.append('size', params.size.toString());

      const queryString = searchParams.toString();
      const url = queryString
        ? `/auth/get-list-users?${queryString}`
        : '/auth/get-list-users';
      return await BaseRequest.Get(url);
    }
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (model: any) => {
      return BaseRequestV2.Post(`/auth/register`, model);
    }
  });
};
