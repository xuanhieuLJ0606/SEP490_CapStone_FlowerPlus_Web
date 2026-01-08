import { useSyncProducts } from '@/queries/sync.query';
import { toast } from '../ui/use-toast';
import { Button } from '../ui/button';

interface ManualSyncButtonsProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function ManualSyncButtons({
  variant = 'outline',
  size = 'sm',
  showLabels = true
}: ManualSyncButtonsProps) {
  const syncProducts = useSyncProducts();

  const handleSyncProducts = async () => {
    try {
      await syncProducts.mutateAsync();
      toast({
        title: 'Bắt đầu đồng bộ',
        description: 'Hệ thống đã bắt đầu đồng bộ product.',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to start product sync. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant={variant} onClick={handleSyncProducts}>
        Đồng bộ product
      </Button>
    </div>
  );
}
