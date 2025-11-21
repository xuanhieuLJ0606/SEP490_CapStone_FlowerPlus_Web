'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
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
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface OrdersChartProps {
  data: Array<{
    month: string;
    orderCount: number;
  }>;
}

export function OrdersChart({ data }: OrdersChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS<'line'> | null>(null);

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
    const lineColor = isDark ? '#60a5fa' : '#3b82f6';
    const pointColor = isDark ? '#93c5fd' : '#1e40af';

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: formattedData.map((item) => item.month),
        datasets: [
          {
            label: 'Đơn hàng',
            data: formattedData.map((item) => item.orderCount),
            borderColor: lineColor,
            backgroundColor: `${lineColor}10`,
            borderWidth: 3,
            fill: true,
            pointRadius: 6,
            pointBackgroundColor: pointColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            tension: 0.4
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
              label: (context) => `Đơn hàng: ${context.parsed.y} đơn`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: textColor,
              callback: (value) => value.toString()
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
          Đơn hàng theo tháng
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Số lượng đơn hàng bán được hàng tháng
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
