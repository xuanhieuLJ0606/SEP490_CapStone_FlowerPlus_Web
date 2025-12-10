import { Button } from '@/components/ui/button';
import { Database, Package, Zap } from 'lucide-react';
import {
  useSyncCategories,
  useSyncProducts,
  useSyncAll
} from '@/queries/sync.query';
import { toast } from '@/components/ui/use-toast';

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
  const syncCategories = useSyncCategories();
  const syncProducts = useSyncProducts();
  const syncAll = useSyncAll();

  const handleSyncCategories = async () => {
    try {
      await syncCategories.mutateAsync();
      toast({
        title: 'Sync Started',
        description: 'Category sync has been triggered successfully.'
      });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to start category sync. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSyncProducts = async () => {
    try {
      await syncProducts.mutateAsync();
      toast({
        title: 'Sync Started',
        description: 'Product sync has been triggered successfully.'
      });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to start product sync. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSyncAll = async () => {
    try {
      await syncAll.mutateAsync();
      toast({
        title: 'Full Sync Started',
        description:
          'Full sync (categories + products) has been triggered successfully.'
      });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to start full sync. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const buttonSize = size === 'lg' ? 'default' : size === 'md' ? 'sm' : 'sm';
  const iconSize = size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={buttonSize}
        onClick={handleSyncCategories}
        disabled={syncCategories.isPending}
        className="gap-2"
      >
        <Database
          className={`${iconSize} ${syncCategories.isPending ? 'animate-spin' : ''}`}
        />
        {showLabels &&
          (syncCategories.isPending ? 'Syncing...' : 'Sync Categories')}
      </Button>

      <Button
        variant={variant}
        size={buttonSize}
        onClick={handleSyncProducts}
        disabled={syncProducts.isPending}
        className="gap-2"
      >
        <Package
          className={`${iconSize} ${syncProducts.isPending ? 'animate-spin' : ''}`}
        />
        {showLabels &&
          (syncProducts.isPending ? 'Syncing...' : 'Sync Products')}
      </Button>

      <Button
        variant={variant}
        size={buttonSize}
        onClick={handleSyncAll}
        disabled={syncAll.isPending}
        className="gap-2"
      >
        <Zap
          className={`${iconSize} ${syncAll.isPending ? 'animate-spin' : ''}`}
        />
        {showLabels && (syncAll.isPending ? 'Syncing...' : 'Sync All')}
      </Button>
    </div>
  );
}
