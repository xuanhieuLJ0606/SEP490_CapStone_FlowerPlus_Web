import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/types/notification';

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await BaseRequest.Get<Notification[]>('/notifications');
      return res.data || [];
    }
  });
};

export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await BaseRequest.Get<number>('/notifications/unread-count');
      return res.data || 0;
    },
    refetchInterval: 30000 // Polling mỗi 30 giây
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['mark-notification-read'],
    mutationFn: async (notificationId: number) => {
      const [error] = await BaseRequest.Put(
        `/notifications/${notificationId}/read`,
        {}
      );
      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count']
      });
    }
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['mark-all-notifications-read'],
    mutationFn: async () => {
      const [error] = await BaseRequest.Put('/notifications/read-all', {});
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count']
      });
    }
  });
};
