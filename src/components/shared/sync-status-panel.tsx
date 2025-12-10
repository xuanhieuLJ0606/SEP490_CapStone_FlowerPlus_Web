import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SyncStatsCard } from './sync-stats-card';
import { ManualSyncButtons } from './manual-sync-buttons';
import { useGetSyncStats } from '@/queries/sync.query';
import { RefreshCw } from 'lucide-react';

export function SyncStatusPanel() {
  const { data: syncStats, isLoading, error } = useGetSyncStats();

  return (
    <div className="space-y-4">
      {/* Manual Sync Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Manual Sync Controls
          </CardTitle>
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Trigger sync manually for immediate synchronization
            </p>
            <ManualSyncButtons size="md" />
          </div>
        </CardContent>
      </Card>

      {/* Sync Statistics */}
      <SyncStatsCard data={syncStats?.data} isLoading={isLoading} />

      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">
              Failed to load sync statistics. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
