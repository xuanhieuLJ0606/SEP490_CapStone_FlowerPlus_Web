import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BaseRequest from '@/config/axios.config';
import { toast } from '@/components/ui/use-toast';

interface SyncItemButtonProps {
  type: 'category' | 'product';
  id: number;
  size?: 'sm' | 'md';
}

export function SyncItemButton({ type, id, size = 'sm' }: SyncItemButtonProps) {
  const queryClient = useQueryClient();

  const syncItem = useMutation({
    mutationFn: async () => {
      if (type === 'category') {
        return await BaseRequest.Post('/sync/categories', {});
      } else {
        return await BaseRequest.Post('/sync/products', {});
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-stats'] });
      queryClient.invalidateQueries({
        queryKey: [type === 'category' ? 'categories' : 'products']
      });

      toast({
        title: 'Sync Triggered',
        description: `${type === 'category' ? 'Category' : 'Product'} sync has been started.`
      });
    },
    onError: () => {
      toast({
        title: 'Sync Failed',
        description: `Failed to trigger ${type} sync. Please try again.`,
        variant: 'destructive'
      });
    }
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => syncItem.mutate()}
      disabled={syncItem.isPending}
      className="h-8 w-8 p-0"
      title={`Sync this ${type}`}
    >
      <RefreshCw
        className={`h-3 w-3 ${syncItem.isPending ? 'animate-spin' : ''}`}
      />
    </Button>
  );
}
