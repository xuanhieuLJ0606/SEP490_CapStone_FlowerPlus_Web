'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS<'bar'> | null>(null);

  // Format data for display
  const formattedData = data.map((item) => ({
    ...item,
    month: new Date(item.month + '-01').toLocaleDateString('vi-VN', {
      month: 'short',
      year: 'numeric'
    })
  }));

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    const barColor = isDark ? '#f472b6' : '#ec4899';

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: formattedData.map((item) => item.month),
        datasets: [
          {
            label: 'Doanh thu (₫)',
            data: formattedData.map((item) => item.revenue),
            backgroundColor: barColor,
            borderRadius: 4,
            hoverBackgroundColor: isDark ? '#f91880' : '#db2777'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} ₫`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: textColor,
              callback: (value) => value.toLocaleString('vi-VN')
            },
            grid: {
              color: gridColor
            }
          },
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [formattedData]);

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">
          Doanh thu theo tháng
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Doanh thu bán hàng hàng tháng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
