import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SyncStatusBadge } from '@/components/ui/sync-status-badge';
import { Loader2, Database, RefreshCw } from 'lucide-react';

interface SyncStatsData {
  categories: {
    total: number;
    pending: number;
    syncing: number;
    synced: number;
    failed: number;
  };
  products: {
    total: number;
    pending: number;
    syncing: number;
    synced: number;
    failed: number;
  };
}

interface SyncStatsCardProps {
  data?: SyncStatsData;
  isLoading?: boolean;
}

export function SyncStatsCard({ data, isLoading }: SyncStatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Sync Status Overview
        </CardTitle>
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Categories */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">
            Categories ({data.categories.total})
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <SyncStatusBadge status="PENDING" size="sm" />
              <span>
                {data.categories.pending} (
                {calculatePercentage(
                  data.categories.pending,
                  data.categories.total
                )}
                %)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <SyncStatusBadge status="SYNCING" size="sm" />
              <span>
                {data.categories.syncing} (
                {calculatePercentage(
                  data.categories.syncing,
                  data.categories.total
                )}
                %)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <SyncStatusBadge status="SYNCED" size="sm" />
              <span>
                {data.categories.synced} (
                {calculatePercentage(
                  data.categories.synced,
                  data.categories.total
                )}
                %)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <SyncStatusBadge status="FAILED" size="sm" />
              <span>
                {data.categories.failed} (
                {calculatePercentage(
                  data.categories.failed,
                  data.categories.total
                )}
                %)
              </span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">
            Products ({data.products.total})
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <SyncStatusBadge status="PENDING" size="sm" />
              <span>
                {data.products.pending} (
                {calculatePercentage(
                  data.products.pending,
                  data.products.total
                )}
                %)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <SyncStatusBadge status="SYNCING" size="sm" />
              <span>
                {data.products.syncing} (
                {calculatePercentage(
                  data.products.syncing,
                  data.products.total
                )}
                %)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <SyncStatusBadge status="SYNCED" size="sm" />
              <span>
                {data.products.synced} (
                {calculatePercentage(data.products.synced, data.products.total)}
                %)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <SyncStatusBadge status="FAILED" size="sm" />
              <span>
                {data.products.failed} (
                {calculatePercentage(data.products.failed, data.products.total)}
                %)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
