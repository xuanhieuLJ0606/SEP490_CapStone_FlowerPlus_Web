import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

interface SyncStatusBadgeProps {
  status: SyncStatus | null | undefined;
  size?: 'sm' | 'md' | 'lg';
}

export function SyncStatusBadge({ status, size = 'sm' }: SyncStatusBadgeProps) {
  if (!status) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Unknown
      </Badge>
    );
  }

  const getStatusConfig = (status: SyncStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          variant: 'secondary' as const,
          icon: Clock,
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'SYNCING':
        return {
          variant: 'secondary' as const,
          icon: Loader2,
          text: 'Syncing',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          animate: true
        };
      case 'SYNCED':
        return {
          variant: 'secondary' as const,
          icon: CheckCircle,
          text: 'Synced',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'FAILED':
        return {
          variant: 'destructive' as const,
          icon: XCircle,
          text: 'Failed',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: Clock,
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const iconSize =
    size === 'lg' ? 'h-4 w-4' : size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3';
  const textSize =
    size === 'lg' ? 'text-sm' : size === 'md' ? 'text-xs' : 'text-xs';

  return (
    <Badge
      variant={config.variant}
      className={`gap-1 ${config.className} ${textSize}`}
    >
      <Icon className={`${iconSize} ${config.animate ? 'animate-spin' : ''}`} />
      {config.text}
    </Badge>
  );
}
