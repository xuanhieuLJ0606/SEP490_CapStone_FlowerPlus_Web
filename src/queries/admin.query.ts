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

export const useGetQuarterlyRevenueByYear = (year?: number) => {
  return useQuery({
    queryKey: ['quarterly-revenue', year],
    queryFn: () => {
      const url = year
        ? `/dashboard/quarterly-revenue?year=${year}`
        : '/dashboard/quarterly-revenue';
      return BaseRequest.Get(url);
    },
    enabled: true
  });
};
