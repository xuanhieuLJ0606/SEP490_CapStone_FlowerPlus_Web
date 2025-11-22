import BaseRequest from '@/config/axios.config';
import __helpers from '@/helpers';
import { useQuery } from '@tanstack/react-query';

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => {
      return BaseRequest.Get('/dashboard/summary');
    }
  });
};
