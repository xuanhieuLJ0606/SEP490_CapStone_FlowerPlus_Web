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
  // const syncCategories = useSyncCategories();
  // const syncProducts = useSyncProducts();
  // const syncAll = useSyncAll();

  // const handleSyncCategories = async () => {
  //   try {
  //     await syncCategories.mutateAsync();
  //     toast({
  //       title: 'Sync Started',
  //       description: 'Category sync has been triggered successfully.'
  //     });
  //   } catch (error) {
  //     toast({
  //       title: 'Sync Failed',
  //       description: 'Failed to start category sync. Please try again.',
  //       variant: 'destructive'
  //     });
  //   }
  // };

  // const handleSyncProducts = async () => {
  //   try {
  //     await syncProducts.mutateAsync();
  //     toast({
  //       title: 'Sync Started',
  //       description: 'Product sync has been triggered successfully.'
  //     });
  //   } catch (error) {
  //     toast({
  //       title: 'Sync Failed',
  //       description: 'Failed to start product sync. Please try again.',
  //       variant: 'destructive'
  //     });
  //   }
  // };

  // const handleSyncAll = async () => {
  //   try {
  //     await syncAll.mutateAsync();
  //     toast({
  //       title: 'Full Sync Started',
  //       description:
  //         'Full sync (categories + products) has been triggered successfully.'
  //     });
  //   } catch (error) {
  //     toast({
  //       title: 'Sync Failed',
  //       description: 'Failed to start full sync. Please try again.',
  //       variant: 'destructive'
  //     });
  //   }
  // };

  return <div className="flex items-center gap-2"></div>;
}
