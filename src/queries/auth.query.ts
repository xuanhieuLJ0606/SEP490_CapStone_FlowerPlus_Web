import BaseRequest, { BaseRequestV2 } from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';
import __helpers from '@/helpers/index';
import { useDispatch } from 'react-redux';
import { setInfoUser } from '@/redux/auth.slice';

export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (model: any) => {
      return BaseRequestV2.Post(`/auth/login`, model);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (model: any) => {
      return BaseRequestV2.Post(`/auth/register`, model);
    }
  });
};

export const useGetMyInfo = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['get-my-info'],
    queryFn: async () => {
      const res = await BaseRequest.Get(`/auth/me`);
      console.log('res', res.data);
      dispatch(setInfoUser(res.data));
      return res.data;
    },
    enabled: !!__helpers.cookie_get('AT')
  });
};

export const useLoginGoogle = () => {
  return useMutation({
    mutationKey: ['login-google'],
    mutationFn: async () => {
      return BaseRequest.Get(`/api/auth/google-login`);
    }
  });
};
export const useInitForgotPassword = () => {
  return useMutation({
    mutationKey: ['init-forgot-password'],
    mutationFn: async (model: any) => {
      return BaseRequestV2.Post(`/api/auth/forgot-password/initiate`, model);
    }
  });
};

export const useCompletedForgotPassword = () => {
  return useMutation({
    mutationKey: ['completed-password'],
    mutationFn: async (model: any) => {
      return BaseRequestV2.Post(`/api/auth/forgot-password/complete`, model);
    }
  });
};

export const useInitChangePassword = () => {
  return useMutation({
    mutationKey: ['init-change-password'],
    mutationFn: async (model: any) => {
      return BaseRequestV2.Post(`/api/user/change-password/initiate`, model);
    }
  });
};

export const useCompletedChangePassword = () => {
  return useMutation({
    mutationKey: ['completed-change-password'],
    mutationFn: async (model: any) => {
      return BaseRequestV2.Post(`/api/user/change-password/complete`, model);
    }
  });
};
