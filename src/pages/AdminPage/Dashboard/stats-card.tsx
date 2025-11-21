import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              {description}
            </p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
