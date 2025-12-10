import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: async (request: any): Promise<any> => {
      const res = await BaseRequest.Post('/chatbot/send-message', request);
      console.log(res);
      return res as any;
    }
  });
};

export const useGetChatHistory = (userId: number = 1) => {
  return useQuery({
    queryKey: ['chat-history', userId],
    queryFn: async (): Promise<any> => {
      const res = await BaseRequest.Get(
        `/chatbot/chat-history?userId=${userId}`
      );
      console.log('history', res);

      return res;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};
