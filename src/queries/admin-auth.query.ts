import BaseRequest from '@/config/axios.config';
import { useMutation } from '@tanstack/react-query';

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async (request: any): Promise<any> => {
      const res = await BaseRequest.Post('/admin-auth/login', request);
      return res; // Extract data from TFUResponse
    }
  });
};
