import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  trend?: 'up' | 'down';
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  color
}: StatsCardProps) {
  const colorClasses = {
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-rose-500',
    purple: 'from-purple-500 to-pink-500'
  };

  return (
    <Card
      className={cn(
        'border-2 bg-white transition-all hover:shadow-lg',
        color && 'border-transparent'
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          </div>
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full text-2xl',
              color
                ? `bg-gradient-to-br ${colorClasses[color]} text-white`
                : 'bg-slate-100'
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
